import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loading from '../components/loading';
import { COLOR_CODE } from '../utils/enums';
import searchProfiles from '../api/search.profiles';
import SearchedProfilesList from '../components/searched.profiles.list';

FontAwesome.loadFont();
const { width, height } = Dimensions.get('window');

const SearchProfilesScreen = ({ searchProfilesRefObj }: any) => {  
  const { userId, onPressProfileHandler, setIsSearchSelected } = searchProfilesRefObj;
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<any>([]);
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await searchProfiles(1, 20, searchText, userId);
      if (res) {
        setSearchResult(res);
      }
      setIsLoading(false);
    }
    let delayTimoutId: any = null;
    if (searchText.length >= 4) {
      delayTimoutId = setTimeout(() => {
        fetchData();
      }, 2000);
    }

    return () => {
      if (delayTimoutId) {
        clearInterval(delayTimoutId);
      }
    }
  }, [searchText]);
  
  const onCancelPressHandler = () => {
    setIsSearchSelected(false);
  }

  const onSearchTextChange = (text: string) => {
    setSearchText(text?.toLowerCase());
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleTapOutside = () => {
    if (textInputRef.current) {
      textInputRef.current.blur();
      setIsFocused(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleTapOutside}>
      <LinearGradient colors={[COLOR_CODE.BRIGHT_BLUE, COLOR_CODE.BRIGHT_RED]} style={styles.gradient}>
        <View style={styles.searchContainer}>
          <TextInput ref={textInputRef} placeholder='Search users...' 
            value={searchText} 
            style={[styles.searchTextInput, (isFocused ? { borderColor: COLOR_CODE.BRIGHT_RED, borderWidth: 1 } : { borderWidth: 0 })]} 
            onChangeText={onSearchTextChange} onFocus={handleFocus} 
          />
        </View>
      
        <View style={styles.horizontalLine}></View>

        <View style={styles.searchResultContainer}>
          {
            isFocused ? 
            (
              isLoading ? 
              (
                <Loading />
              ) : 
              (<SearchedProfilesList searchResult={searchResult} onPressProfileHandler={onPressProfileHandler} onCancelPressHandler={onCancelPressHandler}/>)
            ) : (
              <SearchedProfilesList searchResult={searchResult} onPressProfileHandler={onPressProfileHandler} onCancelPressHandler={onCancelPressHandler}/>
            )
          }
        </View>

        {/* <View style={styles.horizontalLine}></View> */}

        <View style={styles.cancelSearchContainer}>
          <TouchableOpacity style={styles.cancelIconPressable} onPress={onCancelPressHandler}>
            <FontAwesome name='times-circle-o' color={COLOR_CODE.OFF_WHITE} size={50} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

export default SearchProfilesScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 30,
  },

  searchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchTextInput: {
    height: '50%',
    width: '90%',
    borderRadius: 30,
    padding: 10,
    backgroundColor: COLOR_CODE.LIGHT_SILVER,
  },

  searchResultContainer: {
    flex: 5
  },

  cancelSearchContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelIconPressable: {
    height: '100%',
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  horizontalLine: {
    height: 1,
    width: '100%',
    backgroundColor: COLOR_CODE.LIGHT_GREY
  }, 
});
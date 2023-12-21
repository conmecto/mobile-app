import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from '../components/top.bar';
import { COLOR_CODE } from '../utils/enums';
import TopMatchDropdown from '../components/top.match.dropdown';
import getTopMatches from '../api/top.matches';
import Loading from '../components/loading';
import TopMatchesFlatList from '../components/top.matches';
import SearchProfilesScreen from './search.profiles';

type UserProfileDetail = {
  id: number,
  userName?: string,
  profilePicture?: string,
  userId: number,
  name: string,
}

type UserMatchRes = {
  id: number,
  userId1: number,
  userId2: number,
  score: number,
  city: string,
  country: string,
  createdAt: Date,
  profileUserId1?: UserProfileDetail,
  profileUserId2?: UserProfileDetail
}

FontAwesome.loadFont();
const { width, height } = Dimensions.get('window');

const ExploreScreen = ({ navigation, route }: any) => {
  const { userId } = route.params;
  const [isSearchSelected, setIsSearchSelected] = useState(false);
  const [topMatchCount, setTopMatchCount] = useState(10);
  const [topMatches, setTopMatches] = useState<UserMatchRes[]>([]);
  const [isLoadingTopMatches, setIsLoadingTopMatches] = useState(true);

  const onPressProfileHandler = (routedUserId: number) => {
    navigation.navigate('CommonProfileScreen', { ...route.params, routedUserId, showTopBar: true });
  }

  useEffect(() => {
    let check = true;
    const fetchTopMatches = async () => {
      const res: UserMatchRes[] = await getTopMatches(topMatchCount, userId);
      if (check) {
        setTopMatches(res);
        setIsLoadingTopMatches(false);
      }
    }
    fetchTopMatches();
    return () => {
      check = false;
    }
  }, [topMatchCount]);

  const onSearchPressHandler = () => {
    setIsSearchSelected(true);
  }

  const renderTopMatches = ({ item }: any) => {
    return (
      <TopMatchesFlatList item={item} profilePressedObj={{ onPressProfileHandler }} />
    );
  }
  
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <SafeAreaView style={styles.mainContainer}>
        <View style = {styles.exploreContainer}>
            {
              isSearchSelected ?
              (
                <SearchProfilesScreen searchProfilesRefObj={{ setIsSearchSelected, userId , onPressProfileHandler }} />
              ) : (
                <LinearGradient colors={[COLOR_CODE.BRIGHT_BLUE, COLOR_CODE.BRIGHT_RED]} style={styles.gradient}>
    
                  <View style={styles.searchIconContainer}> 
                    <TouchableOpacity style={styles.searchIconPressable} onPress={onSearchPressHandler}>
                      <FontAwesome name='search' color={COLOR_CODE.OFF_WHITE} size={30} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.horizontalLine}></View>

                  <View style={styles.topMatchHeaderContainer}> 
                    <View style={styles.titleContainer}> 
                      <Text style={styles.titleText}>Top Matches</Text>
                    </View>
                    <View style={styles.filterContainer}>
                      <TopMatchDropdown setTopMatchCount={setTopMatchCount}/>
                    </View>
                  </View>

                  <View style={styles.topMatchesContainer}> 
                    {
                      isLoadingTopMatches ?
                      (
                        <Loading color={COLOR_CODE.OFF_WHITE}/>
                      ) : (
                        <FlatList 
                          style={{ flex: 1 }}
                          data={
                            topMatches.map((match, index) => ({ ...match, index}))
                          }
                          renderItem={renderTopMatches}
                          keyExtractor={(item: any, index) => item.id.toString()}
                        />
                      )
                    }
                  </View>

                </LinearGradient>
              )
            }
        </View>
      </SafeAreaView>
    </View>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  exploreContainer: {
    height: '95%',
    width: '95%',
    borderRadius: 30
  },
  gradient: {
    flex: 1,
    borderRadius: 30,
  },

  searchIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchIconPressable: {
    height: width * 0.15,
    width: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topMatchHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: width * 0.06,
    fontWeight: '900',
    color: COLOR_CODE.OFF_WHITE
  },

  filterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topMatchesContainer: {
    flex: 8,
    alignItems: 'center',
  },

  horizontalLine: {
    height: 5,
    width: '100%',
    backgroundColor: COLOR_CODE.LIGHT_GREY
  }, 
});
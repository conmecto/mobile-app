import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { COLOR_CODE } from '../utils/enums';
import { lookingFor, preferencesList, traits } from '../utils/constants';
import { ThemeContext } from '../contexts/theme.context';

type UpdateProfileObj = {
  description?: string,
  city?: string,
  name: string,
  work?: string,
  university?: string,
  lookingFor?: string,
  traits?: string,
  preferences?: string
}
  
type Payload = {
  updateKey: string,
  updateObj: UpdateProfileObj,
  setOpenSelect: any,
  setUpdateObj: any
}

const { height } = Dimensions.get('window');

const EditProfileSelect = ({ updateKey, updateObj, setUpdateObj, setOpenSelect }: Payload) => {
  const { appTheme } = useContext(ThemeContext);
  let options: string[] = [];
  let maxSelect = 1;
  let selectedSet;
  if (updateKey === 'lookingFor') {
    options = lookingFor;
    if (updateObj.lookingFor) {
      selectedSet = new Set([updateObj.lookingFor]);
    }
  }
  if (updateKey === 'traits') {
    maxSelect = 2;
    options = traits;
    if (updateObj.traits?.length) {
      const traits = updateObj.traits?.split('|');
      selectedSet = new Set(traits);
    }
  }
  if (updateKey === 'preferences') {
    maxSelect = 10;
    options = preferencesList;
    if (updateObj.preferences?.length) {
      const preferences = updateObj.preferences?.split(',');
      selectedSet = new Set(preferences);
    }
  }

  const [selectedOptions, setSelectedOptions] = useState(selectedSet);

  const onPressOption = (option: string) => {
    const updatedSet = new Set(selectedOptions);
    if (updatedSet.has(option)) {
      updatedSet.delete(option);
      setSelectedOptions(updatedSet);
      return;
    } 
    if (selectedOptions?.size === maxSelect) {
      return;
    }
    updatedSet.add(option);
    setSelectedOptions(updatedSet);
  }
  
  const onPressDone = () => {
    if (selectedOptions) {
      const optionsArray = [...selectedOptions];
      if (updateKey === 'lookingFor') {
        updateObj.lookingFor = optionsArray.length ? optionsArray[0] : '';
      }
      if (updateKey === 'traits') {
        updateObj.traits = optionsArray.length ? optionsArray.join('|') : '';
      }
      if (updateKey === 'preferences') {
        updateObj.preferences = optionsArray.length ? optionsArray.join(',') : '';
      }
    }
    setUpdateObj({ ...updateObj });
    setOpenSelect('');
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
            Select Upto {maxSelect} {maxSelect > 1 ? 'Options' : 'Option'}
        </Text>
        <Button onPress={() => onPressDone()} buttonColor={COLOR_CODE.BRIGHT_BLUE} textColor={COLOR_CODE.OFF_WHITE}>
            Done
        </Button>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.tagsContainer}>
          {
            options.map((option, index) => {
              const check = selectedOptions?.has(option);
              const backgroundColor = check ? COLOR_CODE.LOGO_COLOR : COLOR_CODE.OFF_WHITE;
              const textColor = check ? COLOR_CODE.OFF_WHITE : COLOR_CODE.BLACK;
              return (
                <TouchableOpacity key={index} style={[styles.touchableOption, { backgroundColor }]} onPress={() => onPressOption(option)}>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.optionText, { color: textColor }]}>
                    {check ? '✓ ' : ''} {option}
                  </Text>                  
                </TouchableOpacity>
              );
            })
          }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { flex: 0, alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row' },
  headerText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.GREY },
  tagsContainer: { 
    flex: 1, flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', padding: 10 
  },
  touchableOption: { 
    padding: 5,
    justifyContent: 'center', 
    margin: 5, 
    borderRadius: 10, 
    height: height * 0.05,
    borderWidth: 2,
    borderColor: COLOR_CODE.LOGO_COLOR
  },
  optionText: { fontSize: 12, fontWeight: 'bold' }
});

export default EditProfileSelect;
import React, { useContext } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { COLOR_CODE } from '../utils/enums';
import { ThemeContext } from '../contexts/theme.context';

const TopBar = () => {  
  const { appTheme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, appTheme === 'dark' && { backgroundColor: COLOR_CODE.BLACK }]}>
      <Text style={[styles.text, appTheme === 'dark' && { color: COLOR_CODE.OFF_WHITE }]}>Conmecto</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLOR_CODE.OFF_WHITE,
    //borderWidth: 1
  },
  text: {
    fontWeight: 'bold',
    fontFamily: 'SavoyeLetPlain',
    fontSize: 30,
    color: COLOR_CODE.BLACK,
  }
});

export default TopBar;
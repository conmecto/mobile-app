import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { COLOR_CODE } from '../utils/enums';

const TopBar = () => {  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Conmecto</Text>
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
    fontSize: 30
  }
});

export default TopBar;
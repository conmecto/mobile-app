import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
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
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
  text: {
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 20,
    color: COLOR_CODE.BRIGHT_BLUE
  }
});

export default TopBar;
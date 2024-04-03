import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import { IMAGE_LOGO } from '../files';
import { COLOR_CODE } from '../utils/enums';

const { height, width } = Dimensions.get('window');

const LogoScreen = ({ navigation }: any) => {  
  return (
    <View style={styles.container}>
      <Image source={ IMAGE_LOGO } style={styles.logo}  />
      <Text>{'\n'}</Text>
      <Text style={styles.text}>Conmecto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  logo: {
    height: height * 0.15,
    width: height * 0.15,
    borderRadius: 100
  },
  text: {
    fontWeight: 'bold',
    fontFamily: 'SavoyeLetPlain',
    fontSize: 50
  }
});

export default LogoScreen;
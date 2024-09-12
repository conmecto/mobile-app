import React, { useState, useRef } from 'react';
import { StyleSheet, View, Easing, TouchableOpacity, Dimensions } from 'react-native';
import { Animated } from 'react-native';
import { IMAGE_LOGO_CROPPED } from '../files';

const { height } = Dimensions.get('window');

const ConmectoBotAnimated = ({ navigate }: any) => {
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const [rotateCheck, setRotateCheck] = useState(false);
  
  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const onPressRotate = () => {
    if (!rotateCheck) {
        setRotateCheck(true);
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          rotateAnimation.setValue(0);
          setRotateCheck(false);
          navigate('ConmectoChat');
        });
    }
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity disabled={rotateCheck} onPress={onPressRotate}>
          <Animated.Image source={IMAGE_LOGO_CROPPED} style={[styles.imageButton, { transform: [{ rotate: spin }] }]}/>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-evenly' },
  imageButton: { height: height * 0.09, width: height * 0.09, borderRadius: 150 },
});

export default ConmectoBotAnimated;
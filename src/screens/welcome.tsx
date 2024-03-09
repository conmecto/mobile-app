import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { COLOR_CODE } from '../utils/enums';
import { IMAGE_LOGO } from '../files';

const { height, width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
  const onPressLoginHandler = () => {
    navigation.navigate('LoginScreen');
  }

  const onPressSignupHandler = () => {
    navigation.navigate('SignupHomeScreen');
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.logoMainContainer}>
        <Image source={ IMAGE_LOGO } style={styles.logo} />
        <Text style={{ fontSize: 50, fontWeight: '800', fontFamily: 'SavoyeLetPlain' }}>Conmecto</Text>
      </View>
      <View style={styles.welcomeMainContainer}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text>
          </Text>
          {/* <Text style={styles.infoText}>
            Get ready to connect with some 
          </Text>
          <Text style={styles.infoText}>
            interesting people
          </Text> */}
        </View>
        <View style={styles.loginAndSignupContainer}>
          <TouchableOpacity style={styles.loginPressable} onPress={onPressLoginHandler}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupPressable} onPress={onPressSignupHandler}>
            <Text style={styles.signupText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  logoMainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  welcomeMainContainer: {
    flex: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLOR_CODE.BRIGHT_BLUE,
  },

  welcomeContainer: {
    flex: 1,
    //paddingLeft: 20,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  welcomeText: {
    fontSize: 50,
    fontWeight: '800',
    color: COLOR_CODE.OFF_WHITE
  },
  infoText: {
    fontSize: 20,
    fontWeight: '500',
    color: COLOR_CODE.OFF_WHITE
  },

  loginAndSignupContainer: {
    flex: 2,
    paddingBottom: 100,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    // borderWidth: 1,
    // borderColor: 'black'
  },

  loginPressable: {
    height: '25%',
    width: '70%',
    borderRadius: 40,
    backgroundColor: COLOR_CODE.OFF_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLOR_CODE.BRIGHT_BLUE
  },
  loginText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLOR_CODE.BRIGHT_BLUE
  },

  signupPressable: {
    height: '25%',
    width: '70%',
    borderRadius: 40,
    backgroundColor: COLOR_CODE.BRIGHT_RED,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLOR_CODE.BRIGHT_RED
  },
  signupText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLOR_CODE.OFF_WHITE
  },

  logo: {
    height: height * 0.15,
    width: height * 0.15
  }
});
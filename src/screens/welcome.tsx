import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLOR_CODE } from '../utils/enums';
import TopBar from '../components/top.bar';
import { Button } from 'react-native-paper';

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
      <TopBar />
      <View style={styles.container}>
        <View style={styles.hiContainer}>
          <Text style={styles.hiText}>Hi There!</Text>
          <Text style={styles.hiText}>Welcome to <Text style={{ fontSize: 25, fontWeight: '600' }}>Conmecto</Text>!</Text>
          <Text style={styles.hiText}>We're thrilled to have you</Text>
          <Text style={styles.hiText}>join our community. 🎉</Text>
        </View>
        <View style={styles.loginButtonContainer}>
          <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={onPressLoginHandler} style={styles.loginButton} labelStyle={styles.loginButtonText}>
            Login
          </Button>
        </View>
        <View style={styles.signupButtonContainer}>
          <Button mode='contained' buttonColor={COLOR_CODE.BLACK} onPress={onPressSignupHandler} style={styles.signupButton} labelStyle={styles.signupButtonText}>
            Signup
          </Button>
        </View>
      </View>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },

  hiContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 1
  },
  hiText: {
    //fontWeight: '',
    fontSize: 25,
    padding: 2,
    //color: COLOR_CODE.BLACK
  },

  loginButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    //borderWidth: 1,
    padding: 10
  },
  loginButton: {
    height: 60,
    width: 150,
    borderRadius: 30,
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 20
  },

  signupButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    //borderWidth: 1,
    padding: 10
  },
  signupButton: {
    height: 60,
    width: 150,
    borderRadius: 30,
    justifyContent: 'center',
  },
  signupButtonText: {
    fontSize: 20
  }
});
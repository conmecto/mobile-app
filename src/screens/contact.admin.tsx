import React from 'react';
import { View, Text } from 'react-native';
import { COLOR_CODE } from '../utils/enums';
import TopBar from '../components/top.bar';

const ContactAdminScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <View style={{ flex: 1, backgroundColor: COLOR_CODE.OFF_WHITE }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Something went wrong!</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Contact:</Text>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>contact@conmecto.com</Text>
        </View>
      </View>
    </View>
  );
}

export default ContactAdminScreen;
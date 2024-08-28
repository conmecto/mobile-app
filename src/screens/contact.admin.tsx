import React from 'react';
import { View, Text } from 'react-native';
import { COLOR_CODE } from '../utils/enums';
import TopBar from '../components/top.bar';

const ContactAdminScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: COLOR_CODE.OFF_WHITE, alignItems: 'center' }}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Contact:</Text>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>contact@conmecto.com</Text>
      </View>
    </View>
  );
}

export default ContactAdminScreen;
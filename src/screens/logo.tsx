import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { IMAGE_LOGO } from '../files';

const LogoScreen = ({ navigation }: any) => {  
  return (
    <View>
      <Image source={ IMAGE_LOGO } />
    </View>
  );
}

export default LogoScreen;
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLOR_CODE } from '../utils/enums';

const Loading = ({ color, flex }: any) => {
  return (
    <View style={[styles.container, { flex: flex ? flex : 1 }]}>
      <ActivityIndicator size='large' color={color ? color : COLOR_CODE.BRIGHT_BLUE} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});

export default Loading;
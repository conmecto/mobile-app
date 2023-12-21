import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchHomeScreen from '../screens/match.home';
import MatchChatScreen from '../screens/match.chat';
import CommonProfileScreen from '../screens/common.profile';
import ViewPostScreen from '../screens/view.post';
import NoMatchScreen from '../screens/no.match';

const MatchStack = createNativeStackNavigator();

const MatchNavigator = ({ params }: any) => {
  return (
    <MatchStack.Navigator initialRouteName={params.userMatchRes ? 'MatchHomeScreen' : 'NoMatchScreen'}>
      <MatchStack.Screen name='MatchHomeScreen' component={MatchHomeScreen} options={{ headerShown: false }} initialParams={params} />
      <MatchStack.Screen name='MatchChatScreen' component={MatchChatScreen} options={{ headerShown: false }} initialParams={params}/>
      <MatchStack.Screen name='CommonProfileScreen' component={CommonProfileScreen} options={{ headerShown: false }} initialParams={params}/>
      <MatchStack.Screen name='ViewPostScreen' component={ViewPostScreen} options={{ headerShown: false }} initialParams={params}/>
      <MatchStack.Screen name='NoMatchScreen' component={NoMatchScreen} options={{ headerShown: false }} initialParams={params}/>
    </MatchStack.Navigator>
  );
}

export default MatchNavigator;
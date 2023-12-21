import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExploreScreen from '../screens/explore';
import CommonProfileScreen from '../screens/common.profile';
import ViewPostScreen from '../screens/view.post';

const ExploreStack = createNativeStackNavigator();

const ExploreNavigator = (props: any) => {
  return (
    <ExploreStack.Navigator initialRouteName='ExploreScreen'>
      <ExploreStack.Screen name='ExploreScreen' component={ExploreScreen} options={{ headerShown: false }} initialParams={props.route.params} />
      <ExploreStack.Screen name='CommonProfileScreen' component={CommonProfileScreen} options={{ headerShown: false }} initialParams={props.route.params}/>
      <ExploreStack.Screen name='ViewPostScreen' component={ViewPostScreen} options={{ headerShown: false }} initialParams={props.params}/>
    </ExploreStack.Navigator>
  );
}

export default ExploreNavigator;
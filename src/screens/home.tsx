import React, { useEffect, useState } from 'react';
import HomeTabNavigator from '../navigations/home';

const HomeScreen = (props: any) => {  
  return (
    <HomeTabNavigator params={props.route.params}/>
  );
}

export default HomeScreen;
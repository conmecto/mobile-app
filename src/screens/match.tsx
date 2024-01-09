import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { omit } from 'lodash';
import TopBar from '../components/top.bar';
import getUserMatch from '../api/user.match';
import Loading from '../components/loading';
import MatchNavigator from '../navigations/match';
import { getUserId } from '../utils/user.id';
  
type UserMatchRes = {
  id: number,
  score: number,
  createdAt: Date,
  matchedUserId?: number
}

const MatchScreen = ({ navigation, route }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userMatchRes, setUserMatchRes] = useState<UserMatchRes | null>(null);
  const userId = getUserId() as number;

  useEffect(() => {
    let check = true;
    const fetchData = async () => {
      const res = await getUserMatch(userId);
      if (check) {
        if (res) {
          if (res.userId1 === userId) {
            setUserMatchRes(omit({ ...res, matchedUserId: res.userId2}, ['userId1', 'userId2']));
          } else {
            setUserMatchRes(omit({ ...res, matchedUserId: res.userId1}, ['userId1', 'userId2']));
          }
        }
        setIsLoading(false);
      };
    }
    if (isLoading) {
      fetchData();
    }
    return () => {
      check = false;
    }
  }, []);

  return (
    <View style={styles.container}>
      <TopBar />
      {
        isLoading ?
        <Loading /> :
        (
          <MatchNavigator params={{ ...route.params, userMatchRes }}/>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default MatchScreen;
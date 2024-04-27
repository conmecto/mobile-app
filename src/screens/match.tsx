import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { omit } from 'lodash';
import TopBar from '../components/top.bar';
import getUserMatch from '../api/user.match';
import Loading from '../components/loading';
import MatchNavigator from '../navigations/match';
import { getUserId } from '../utils/user.id';
  
type UserMatchRes = {
  matchId?: number,
  score?: number,
  createdAt?: Date,
  matchedUserId?: number
  city?: string,
  country?: string,
  settingId: number,
  userId: number,
  totalMatchScore: number,
  pinnedPostId?: number,
  chatNotification?: boolean
}

const MatchScreen = ({ route }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userMatchRes, setUserMatchRes] = useState<UserMatchRes | null>(null);
  const userId = getUserId() as number;

  useEffect(() => {
    let check = true;
    const fetchData = async () => {
      const res = await getUserMatch(userId);
      if (check) {
        if (res) {
          const matchRes = omit({
            ...res, 
            matchUserId: res.userId1 === userId ? res.userId2 : res.userId1,
            matchId: res.id
          }, ['userId1', 'userId2', 'id'])
          if (res.userId1 === userId) {
            setUserMatchRes(matchRes);
          } else {
            setUserMatchRes(matchRes);
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
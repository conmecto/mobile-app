import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import UserMatchesSummary from '../api/match.summary';
import TopBar from '../components/top.bar';
import { COLOR_CODE } from '../utils/enums';
import { colors } from '../utils/constants';
import { getUserId } from '../utils/user.id';
import { ThemeContext } from '../contexts/theme.context';

const { height, width } = Dimensions.get('window');

type MatchesSummary = {
  callMatchesSummary: boolean,
  currentMatches: number,
  totalMatches: number,
  highestMatchStreak: number,
  conmectoScore: number,
  avgMatchStreak: number,
  avgMatchDuration: number,
}

const MatchSummaryScreen = () => {  
  const { appTheme } = useContext(ThemeContext);
  const userId = getUserId() as number;
  const maxMatches = 5;
  const [matchesSummary, setMatchesSummary] = useState<MatchesSummary>({
    callMatchesSummary: true,
    currentMatches: 0,
    totalMatches: 0,
    highestMatchStreak: 0,
    conmectoScore: 0,
    avgMatchStreak: 0,
    avgMatchDuration: 0
  });

  useEffect(() => {
    let check = true;
    const callMatchesSummary = async () => {
      const res = await UserMatchesSummary(userId);
      if (check) {
        let updatedMatchesSummary = {
          ...matchesSummary,
          callMatchesSummary: false,
        } as MatchesSummary;
        if (res) {
          updatedMatchesSummary = {
            ...updatedMatchesSummary,
            ...res
          } as MatchesSummary;
        }
        setMatchesSummary(updatedMatchesSummary);
      }
    }
    if (matchesSummary.callMatchesSummary) {
      callMatchesSummary();
    }
    return () => {
      check = false;
    }
  }, []);

  const themeColor = appTheme === 'dark' ? {
    mainContainerBackgroundColor: COLOR_CODE.BLACK,
    headerText: COLOR_CODE.OFF_WHITE,
    activityHeaderText: COLOR_CODE.OFF_WHITE,
  } : {
    mainContainerBackgroundColor: COLOR_CODE.OFF_WHITE,
    headerText: COLOR_CODE.BLACK,
    activityHeaderText: COLOR_CODE.BLACK,
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: themeColor.mainContainerBackgroundColor }]}>
      <TopBar />
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: themeColor.headerText }]}>
          My Activity
        </Text>
      </View>
      <View style={styles.activityMainContainer}>
        <View style={styles.activityBox}>
          <View style={styles.activityHeader}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.activityHeaderText, { color: themeColor.activityHeaderText }]}>
              Total Matches
            </Text>
          </View>
          <View style={styles.activityValueContainer}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.totalMatchesText}>
              {matchesSummary.totalMatches} 🧲
            </Text>
          </View>
        </View>
        <View style={styles.activityBox}>
          <View style={styles.activityHeader}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.activityHeaderText, { color: themeColor.activityHeaderText }]}>
              Current Matches
            </Text>
          </View>
          <View style={styles.activityValueContainer}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.currentMatchesText}>
              {matchesSummary.currentMatches} / {maxMatches} ⚡
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.activityMainContainer}>
        <View style={styles.activityBox}>
          <View style={styles.activityHeader}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.activityHeaderText, { color: themeColor.activityHeaderText }]}>
              Conmecto Streak
            </Text>
          </View>
          <View style={styles.activityValueContainer}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.conmectoStreakText}>
              {matchesSummary.conmectoScore} 🚀
            </Text>
          </View>
        </View>
        <View style={styles.activityBox}>
          <View style={styles.activityHeader}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.activityHeaderText, { color: themeColor.activityHeaderText }]}>
              Highest Match Streak
            </Text>
          </View>
          <View style={styles.activityValueContainer}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.highestMatchStreakText}>
              {matchesSummary.highestMatchStreak} 🔥
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.activityMainContainer}>
        <View style={styles.activityBox}>
          <View style={styles.activityHeader}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.activityHeaderText, { color: themeColor.activityHeaderText }]}>
              Avg. Match Duration (Days)
            </Text>
          </View>
          <View style={styles.activityValueContainer}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.avgMatchDurationText}>
              {matchesSummary.avgMatchDuration} 👏
            </Text>
          </View>
        </View>
        <View style={styles.activityBox}>
          <View style={styles.activityHeader}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.activityHeaderText, { color: themeColor.activityHeaderText }]}>
              Avg. Match Streak
            </Text>
          </View>
          <View style={styles.activityValueContainer}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.avgMatchStreakText}>
              {matchesSummary.avgMatchStreak} 🔥
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  headerContainer: { height: height * 0.1, paddingLeft: width * 0.07, justifyContent: 'center' },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  activityHeaderText: { fontSize: 20, fontWeight: 'bold' },
  activityMainContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  activityBox: { height: '80%', width: '40%', borderRadius: 20 },
  activityHeader: { flex: 1, justifyContent: 'center', paddingLeft: 5 },
  activityValueContainer: { flex: 1, justifyContent: 'center', paddingLeft: 10 },
  totalMatchesText: { fontSize: 25, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_BLUE },
  conmectoStreakText: { fontSize: 25, fontWeight: 'bold', color: colors[16] },
  currentMatchesText: { fontSize: 25, fontWeight: 'bold', color: colors[9] },
  highestMatchStreakText: { fontSize: 25, fontWeight: 'bold', color: COLOR_CODE.RED },
  avgMatchDurationText: { fontSize: 20, fontWeight: 'bold', color: COLOR_CODE.FIRE_GREEN },
  avgMatchStreakText: { fontSize: 25, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_BLUE }
});

export default MatchSummaryScreen;
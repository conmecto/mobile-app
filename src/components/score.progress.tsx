import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLOR_CODE } from '../utils/enums';
import { getNextMaxScore, fireColorScoreBased } from '../utils/helpers';

MaterialCommunityIcons.loadFont();

type props = { 
  totalMatchScore: number 
}

const ScoreProgressBar = ({ totalMatchScore }: props) => {
  const maxScore = getNextMaxScore(totalMatchScore);
  const progressBarValue = () => {
    return Number((totalMatchScore / maxScore).toFixed(2));
  }
  
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.scoreFireContainer}>
        <View style={styles.leftScoreFireContainer}>
          <MaterialCommunityIcons name='fire' color={fireColorScoreBased(totalMatchScore)} size={50}/> 
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.scoreText}>{totalMatchScore}</Text>
        </View>
        <View style={styles.rightScoreFireContainer}>
          <MaterialCommunityIcons name='fire' color={fireColorScoreBased(maxScore)} size={50}/> 
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.scoreText}>{maxScore}</Text>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 20, paddingRight: 20 }}>
        <ProgressBar animatedValue={progressBarValue() || 0.05} color={COLOR_CODE.GREEN} style={styles.barStyle}/>
      </View>
    </View>
  );
}

export default ScoreProgressBar;

const styles = StyleSheet.create({
  scoreText: { 
    paddingLeft: 10, 
    paddingRight: 10,
    fontSize: 20, 
    fontWeight: 'bold'
  },
  scoreFireContainer: { 
    flex: 2, 
    //borderWidth: 1, 
    flexDirection: 'row'
  },
  leftScoreFireContainer: { 
    flex: 1, 
    //borderWidth: 1, 
    justifyContent: 'center',
    paddingLeft: 10
  },
  rightScoreFireContainer: { 
    flex: 1, 
    //borderWidth: 1, 
    justifyContent: 'center', 
    alignItems: 'flex-end',
    paddingRight: 10
  },
  barStyle: { 
    height: '60%',
    borderRadius: 30, 
    borderWidth: 2, 
    backgroundColor: COLOR_CODE.OFF_WHITE 
  }
});
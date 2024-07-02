import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import { Button, Chip } from 'react-native-paper'; 
import { COLOR_CODE } from '../utils/enums';
import { polaroidTags, colors } from '../utils/constants';

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};

const PolaroidTagsKeyMap = polaroidTags.reduce((prev: any, current: any) => {
    prev[current] = randomColor();
    return prev;
}, {});

type CapturedPhoto = {
    path: string,
    height: number,
    width: number
}
  
type polaroidDetail = {
    caption: string,
    tags?: string,
    match: boolean
}

const TagsScreen = ({ navigation, route }: any) => {  
  const [tagsCheck, setTagsCheck] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  const onPressTag = (polaroid: string) => {
    let tempError = '';
    const updatedSet = new Set(tagsCheck);
    if (updatedSet.has(polaroid)) {
      updatedSet.delete(polaroid);
    } else {
      if (updatedSet.size === 5) {
        tempError = '5 tags selected already';
      }
      else {
        updatedSet.add(polaroid);
      }
    }
    setError(tempError);
    setTagsCheck(updatedSet);
  }

  const onPressDone = () => {
    const capturedPhoto: CapturedPhoto = route?.params?.capturedPhoto;
    const polaroidDetail: polaroidDetail = route?.params?.polaroidDetail;
    if (tagsCheck.size) {
        polaroidDetail.tags = [...tagsCheck].join(',');
    }
    navigation.navigate('UploadFileScreen', { capturedPhoto, polaroidDetail });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
                Select upto 5 Tags (Optional)
            </Text>
            <Button onPress={() => onPressDone()} buttonColor={COLOR_CODE.BRIGHT_BLUE} textColor={COLOR_CODE.OFF_WHITE}>
                Done
            </Button>
        </View>
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
                {error}
            </Text>
        </View>
        <ScrollView style={{ flex: 1}}>
            <View style={styles.tagsContainer}>
                {
                  polaroidTags.map((polaroid, index) => {
                    const backgroundColor = PolaroidTagsKeyMap[polaroid];
                    return (
                      <Chip selected={tagsCheck.has(polaroid)} selectedColor={COLOR_CODE.BLACK} 
                        onPress={() => onPressTag(polaroid)} mode='flat' key={index} 
                        style={{ backgroundColor, margin: 4 }} textStyle={{ color: COLOR_CODE.OFF_WHITE }}>
                        {polaroid}
                      </Chip>
                    );
                  })
                }
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    headerContainer: { flex: 0, alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row' },
    headerText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.GREY },
    errorContainer: { flex: 0, alignItems: 'center', justifyContent: 'center' },
    errorText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_RED },
    tagsContainer: { 
        flex: 1, flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', padding: 10 
    },
});

export default TagsScreen;
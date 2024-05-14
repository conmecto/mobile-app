import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet } from 'react-native';
import { Button, Switch } from 'react-native-paper';
import { unlink } from 'react-native-fs';
import { COLOR_CODE } from '../utils/enums';
import environments from '../utils/environments';

type polaroidDetail = {
  caption: string,
  link?: string,
  match: boolean
}

const CapturedCameraScreen = ({ route, navigation }: any) => { 
  const capturedPhoto = route.params.capturedPhoto;
  const [polaroidDetail, setPolaroidDetail] = useState<polaroidDetail>({
    caption: '',
    match: true
  });
  const [error, setError] = useState('');
  
  const onPressRetake = () => {
    unlink(capturedPhoto.path)
    .then()
    .catch((err) => {
      if (environments.appEnv !== 'prod') {
        console.log('file delete error');
      }
    });
    navigation.goBack();
  }

  const onChangeText = (key: string, value: string) => {
    if (key === 'caption') {
      if (value.length > 30) {
        setError('Caption character limit is 30');
      } else {
        setError('');
        setPolaroidDetail({ ...polaroidDetail, caption: value });
      }
    } else {
      setError('');
      setPolaroidDetail({ ...polaroidDetail, link: value });
    }
  }

  const onToggleChange = () => setPolaroidDetail({ ...polaroidDetail, match: !polaroidDetail.match });

  const onPressShare = () => {
    if (!polaroidDetail.caption) {
      setError('Caption is required');
    } else {
      navigation.navigate('UploadFileScreen', { capturedPhoto, polaroidDetail });
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: capturedPhoto.path }} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
        <View style={{ flex: 0, alignItems: 'center' }}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.errorText}>
            {error}
          </Text>
        </View>
        <View style={{ flex: 2, flexDirection: 'row' }}>
          <View style={{ flex: 3 }}>
          <View style={styles.commonContainer}>
            <TextInput
              placeholder='Caption'
              value={polaroidDetail.caption}
              onChangeText={text => onChangeText('caption', text)}
              style={styles.captionInput}
            />
          </View>
          <View style={styles.commonContainer}>
            <TextInput
              placeholder='Reference (Optional)'
              value={polaroidDetail.link}
              onChangeText={text => onChangeText('link', text)}
              style={styles.linkInput}
            />
          </View>
          </View>
          <View style={styles.considerContainer}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={{ fontSize: 12, fontWeight: 'bold' }}>
              Consider For a Match
            </Text>
            <Switch value={polaroidDetail.match} onValueChange={onToggleChange} color={COLOR_CODE.BRIGHT_BLUE} />
          </View>
        </View>
        <View style={styles.actionContainer}>
          <Button mode='contained' buttonColor={COLOR_CODE.RED} onPress={() => onPressRetake()}>
            Retake
          </Button>
          <Button mode='contained' buttonColor={COLOR_CODE.BLACK} onPress={() => onPressShare()}>
            Share Polaroid
          </Button>
        </View>
      </View>
    </View>
  );
}

export default CapturedCameraScreen;

const styles = StyleSheet.create({
  imageContainer: { flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR_CODE.BLACK },
  image: { height: '95%', width: '95%', borderRadius: 30, borderWidth: 10, borderColor: COLOR_CODE.OFF_WHITE },
  mainContainer: { flex: 1, backgroundColor: COLOR_CODE.BLACK },
  captionInput: { 
    fontWeight: 'bold',
    fontSize: 15,
    color: COLOR_CODE.BRIGHT_BLUE    
  },
  linkInput: { 
    fontWeight: 'bold',
    fontSize: 15,
    color: COLOR_CODE.BLACK    
  },
  detailsContainer: { flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: COLOR_CODE.OFF_WHITE },
  errorText: { color: COLOR_CODE.BRIGHT_RED, fontSize: 10, fontWeight: 'bold' },
  commonContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  considerContainer: { flex: 1, justifyContent: 'space-evenly', alignItems: 'center' },
  actionContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }
});
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { Button, ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLOR_CODE } from '../utils/enums';
import environments from '../utils/environments';
import { profilePictureOptions, maxImageSizeBytes, allowedImageTypes } from '../utils/constants';
import { NO_MATCH_GIF } from '../files';
import Loading from '../components/loading';
import updatePinnedPost from '../api/update.pinned.post';
import { getNextMaxScore, fireColorScoreBased } from '../utils/helpers';

FontAwesome.loadFont();
MaterialCommunityIcons.loadFont();

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
  pinnedPostId?: number
}

const NoMatchScreen = ({ route }: any) => {  
  const setting: UserMatchRes = route?.params?.userMatchRes;
  const [uploadImageError, setUploadImageError] = useState('');
  const [pinnedPost, setPinnedPost] = useState<Asset>();
  const [isLoading, setIsLoading] = useState(false);
  const [settingObj, setSettingObj] = useState<UserMatchRes>(setting);
      
  useEffect(() => {
    let check = true;
    const callUpdatePinnedImage = async () => {
      const res = await updatePinnedPost(settingObj.userId, pinnedPost as Asset);
      if (check) {
        setIsLoading(false);
        setPinnedPost(undefined);
        if (res && res.postId) {
          settingObj.pinnedPostId = res.postId;
          setSettingObj(settingObj);
        }
      }
    }
    if (pinnedPost && !isLoading) {
      setIsLoading(true);
      callUpdatePinnedImage();
    }
    return () => {
      check = false;
    }
  }, [pinnedPost])

  const handleFileImport = () => {
    launchImageLibrary(profilePictureOptions as ImageLibraryOptions, res => {
      if (res.errorMessage) {
        setUploadImageError(res.errorMessage);
      } else if (res.assets?.length) {
        const asset = res.assets[0];
        if (!asset.fileSize || !asset.type) {
          setUploadImageError('Corrupt file');    
        } else if (asset.fileSize > maxImageSizeBytes) {
          setUploadImageError('File size exceed 10mb');    
        } else if (!allowedImageTypes.includes(asset.type)) {
          setUploadImageError('File type not supported');    
        } else {
          setUploadImageError('');
          setPinnedPost(asset);
        }
      }
    });
  }

  const onUploadImageHandler = () => {
    check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
      switch(result) {
        case RESULTS.UNAVAILABLE:
          break;
        case RESULTS.DENIED:
          request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
            if (environments.appEnv !== 'prod') {
              console.log('request result', result)
            }
          }).catch(error => {
            if (environments.appEnv !== 'prod') {
              console.log('request error', error)
            }
          });
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
          handleFileImport();
          break;
        case RESULTS.BLOCKED:
          setUploadImageError('Please allow photos access from the settings');
          break;
        default: 
          break;
      }
    }).catch(error => { 
      if (environments.appEnv !== 'prod') {
        console.log('upload image error', error)
      }
    });
  }
  
  const maxScore = getNextMaxScore(settingObj.totalMatchScore);
  const progressBarValue = () => {
    return Number((settingObj.totalMatchScore / maxScore).toFixed(2));
  }
  
  return (
      isLoading ?
      (<Loading />) :
      (
        <View style={styles.mainContainer}>
          <View style={styles.noMatchInfoContainer}>
            <FontAwesome name='info-circle' color='red' size={20} />
            <Text numberOfLines={2} adjustsFontSizeToFit style={styles.noMatchText}>
              We will notify you as soon as Conmecto Bot find a Match for you
            </Text>
          </View>
          <View style={styles.uploadOrSearchingContainer}>
            { 
              settingObj?.pinnedPostId ? 
              <Image source={NO_MATCH_GIF} style={styles.searchImage}/> : 
              ( 
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={styles.uploadErrorText}>{uploadImageError}</Text>
                  <Text>{'\n'}</Text>
                  <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} onPress={onUploadImageHandler} style={styles.uploadButton} labelStyle={styles.uploadButtonText}>
                    Upload
                  </Button>
                  <Text>{'\n'}</Text>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={styles.uploadText}>Help Conmecto Bot find a connection for you.</Text>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={styles.uploadText}>Share a beautiful breathtaking shot! 📸</Text>
                </View>
              )
            }
          </View>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreFireContainer}>
              <View style={styles.leftScoreFireContainer}>
                <MaterialCommunityIcons name='fire' color={fireColorScoreBased(settingObj.totalMatchScore)} size={50}/> 
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.scoreText}>{settingObj.totalMatchScore}</Text>
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
        </View>
      )
  );
}

export default NoMatchScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    //borderWidth: 1,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
  noMatchInfoContainer: {
    flex: 1,
    //borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  uploadOrSearchingContainer: {
    flex: 3,
    //borderWidth: 1
  },
  scoreContainer: {
    flex: 2,
    //borderWidth: 1
  },
  searchImage: {
    //borderWidth: 1,
    height: '100%',
    width: '75%',
    alignSelf: 'center'
  },
  uploadText: { 
    color: COLOR_CODE.GREY, 
    fontSize: 15, 
    alignSelf: 'center', 
    fontWeight: 'bold' 
  },
  uploadButton: {
    height: 60,
    width: 150,
    borderRadius: 30,
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 20
  },
  uploadErrorText: {
    color: COLOR_CODE.BRIGHT_RED, 
    fontSize: 15, 
    alignSelf: 'center', 
    fontWeight: 'bold' 
  },
  gradient: {
    height: '50%',
    width: '90%',
    borderRadius: 30,
    backgroundColor: COLOR_CODE.BRIGHT_BLUE,
    padding: 10,
    justifyContent: 'space-evenly'
  },
  noMatchText: {
    color: COLOR_CODE.BRIGHT_BLUE,
    paddingLeft: 10,
    fontSize: 12,
    fontWeight: 'bold'
  },
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
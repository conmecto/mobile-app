import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-paper';
import { pick } from 'lodash';
import updateProfile from '../api/update.profile';
import updateProfilePicture from '../api/update.profile.picture';
import requestSignedUrl from '../api/request.signed.url';
import TopBar from '../components/top.bar';
import Loading from '../components/loading';
import { COLOR_CODE } from '../utils/enums';
import { profilePictureOptions, allowedImageTypes, maxImageSizeBytes } from '../utils/constants';
import { formatText } from '../utils/helpers';
import { getUserId } from '../utils/user.id';
import Environments from '../utils/environments';

type UpdateProfileObj = {
  description?: string,
  city?: string,
  name: string,
  work?: string,
  university?: string
}

type UpdateProfileKeys = {
  description?: boolean,
  city?: boolean,
  name?: boolean,
  work?: boolean,
  university?: boolean
}

type UserProfileRes = {
  id: number,
  userName?: string,
  description: string,
  city: string,
  country?: string,
  school?: string,
  work?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  university?: string
}

FontAwesome.loadFont();
const { width, height } = Dimensions.get('window');

const EditProfileScreen = (props: any) => {
  const params = props?.route?.params;
  const userId = getUserId() as number;
  const profileObj: UserProfileRes = params?.profileDetails;
  const defaultUpdateObj: UpdateProfileObj = {
    description: profileObj.description || '',
    city: formatText(profileObj.city) || '',
    work: formatText(profileObj.work) || '',
    university: formatText(profileObj.university) || '',
    name: formatText(profileObj.name)
  };
  const [error, setError] = useState('');
  const [updateImage, setUpdateImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState<Asset>();
  const [updateDetails, setUpdateDetails] = useState(false);
  const [updateObj, setUpdateObj] = useState<UpdateProfileObj>(defaultUpdateObj);
  const [updateKeys, setUpdateKeys] = useState<UpdateProfileKeys>({});

  useEffect(() => {
    let check = true;
    const callUpdateData = async () => {
      const res = await updateProfile(userId, pick(updateObj, Object.keys(updateKeys)));
      if (check) {
        if (res?.errorCode) {
          setUpdateObj(defaultUpdateObj);
        }
        setUpdateKeys({});
        setUpdateDetails(false);
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,              
            routes: [
              {
                name: 'ProfileScreen'
              }
            ]
          })
        );
      } 
    }
    if (updateDetails && !updateImage && !error) {
      callUpdateData();
    }
    return () => {
      check = false;
    }
  }, [updateDetails]);

  useEffect(() => {
    let check = true;
    const callUpdateImage = async () => {
      const path = profilePicture?.uri;
      const fileName = profilePicture?.fileName as string;
      const fileType = profilePicture?.type as string;
      const res = await requestSignedUrl({ userId, fileName, contentType: fileType, uploadType: 'profilePicture' });
      if (res?.url && path) {
        const result = await fetch(path);
        const file = await result.blob();
        try {
          const url = res.url as string;
          const key = url.split('?')?.shift() as string; 
          const uploadRes = await fetch(url,  {
            method: 'PUT',
            headers: {
              'Content-Type': fileType,
            },
            body: file
          });
          if (uploadRes.status === 200)  {
            const data = {
              key,
              name: fileName,
              mimetype: fileType,
              size: file.size, 
              height: profilePicture.height as number,
              width: profilePicture.width as number
            }
            await updateProfilePicture(userId, data);
          }
        } catch(error) {
          if (Environments.appEnv !== 'prod') {
            console.log('Profile Picture upload error', error);
          }
        }
      }
      if (check) {
        setProfilePicture(undefined);
        setUpdateImage(false);
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,              
            routes: [
              {
                name: 'ProfileScreen'
              }
            ]
          })
        );
      }
    }
    if (updateImage && !updateDetails && !error) {
      callUpdateImage();
    }
    return () => {
      check = false;
    }
  }, [updateImage]);

  const onCancelPressHandler = () => {
    setUpdateObj(defaultUpdateObj);
    props.navigation.navigate('ProfileScreen');
  }

  const checkAllSame = () => {
    if (updateObj.city?.toLowerCase() !== defaultUpdateObj.city?.toLowerCase()) {
      updateKeys.city = true;
    }
    if (updateObj.name?.toLowerCase() !== defaultUpdateObj.name?.toLowerCase()) {
      updateKeys.name = true;
    }
    if (updateObj.description?.toLowerCase() !== defaultUpdateObj.description?.toLowerCase()) {
      updateKeys.description = true;
    }
    if (updateObj.university?.toLowerCase() !== defaultUpdateObj.university?.toLowerCase()) {
      updateKeys.university = true;
    }
    if (updateObj.work?.toLowerCase() !== defaultUpdateObj.work?.toLowerCase()) {
      updateKeys.work = true;
    }
    setUpdateKeys(updateKeys);
  }

  const onUpdatePressHandler = () => {
    let error = '';
    if (!updateObj.name.length) {
      error = 'Name cannot be empty';
    }
    if (error) {
      setError(error);
      return;
    }
    checkAllSame();
    if (!Object.keys(updateKeys).length) {
      setUpdateObj(defaultUpdateObj);
      props.navigation.navigate('ProfileScreen');
    } else {
      setError('');
      setUpdateDetails(true);
    }
  }

  const onHandleChangeText = (text: string, key: string) => {
    if (key === 'description') {
      text = text.substring(0, 250);
    } else {
      text = text.substring(0, 100);
    }
    setUpdateObj({ ...updateObj, [key]: text });
  }

  const handleFileImport = () => {
    launchImageLibrary(profilePictureOptions as ImageLibraryOptions, res => {
      if (res.errorMessage) {
        setError('Something went wrong');
      } else if (res.assets?.length) {
        const asset = res.assets[0];
        if (!asset.fileSize || !asset.type) {
          setError('Corrupt file');    
        } else if (asset.fileSize > maxImageSizeBytes) {
          setError('File size exceed 10mb'); 
        } else if (!allowedImageTypes.includes(asset.type)) {
          setError('File type not supported'); 
        } else {
          setError('');
          setProfilePicture(asset);
          setUpdateImage(true);
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
            if (Environments.appEnv !== 'prod') {
              console.log('request result', result)
            }
          }).catch(error => {
            if (Environments.appEnv !== 'prod') {
              console.log('request error', error)
            }
          });
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
          handleFileImport();
          break;
        case RESULTS.BLOCKED:
          setError('Please update your settings to allow photos access');
          break;
        default: 
          break;
      }
    }).catch(error => { 
      if (Environments.appEnv !== 'prod') {
        console.log('upload image error', error)
      }
    });
  }
 
  return (
    <View style={styles.container}>
      <TopBar />
      <SafeAreaView style={styles.mainContainer}>
        {
          (updateDetails || updateImage) ?
          (<Loading />) :
          (
            <View style={styles.editContainer}>
              <View style={styles.editImageContainer}>
                <TouchableOpacity style={styles.updateImageIconPressable} onPress={onUploadImageHandler}>
                  <FontAwesome name='upload' color={COLOR_CODE.BRIGHT_BLUE} size={40} />
                </TouchableOpacity> 
                <Text style={styles.uploadText}>
                  Upload Profile Picture
                </Text>
              </View>

              <View style={styles.horizontalLine}></View>
              
              <View style={styles.textFieldsContainer}>
                
                <Text style={styles.uploadText}>
                  Name
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.name} onChangeText={text => onHandleChangeText(text, 'name')} />
                <Text></Text>
                
                <Text style={styles.uploadText}>
                  About (Max 250 characters)
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.description} onChangeText={text => onHandleChangeText(text, 'description')} />
                <Text></Text>
                
                <Text style={styles.uploadText}>
                  City
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.city} onChangeText={text => onHandleChangeText(text, 'city')} />
                <Text></Text>
                
                <Text style={styles.uploadText}>
                  Work
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.work} onChangeText={text => onHandleChangeText(text, 'work')} />
                <Text></Text>
                
                <Text style={styles.uploadText}>
                  University
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.university} onChangeText={text => onHandleChangeText(text, 'university')} />
                <Text></Text>
                <Text style={{ color: COLOR_CODE.BRIGHT_RED, fontSize: 15, fontWeight: 'bold' }}>{error}</Text>

              </View>

              <View style={styles.cancelOrUpdateContainer}>
                <View style={styles.cancelContainer}>
                  <TouchableOpacity style={styles.cancelIconPressable} onPress={onCancelPressHandler}>
                    <FontAwesome name='times-circle-o' color={COLOR_CODE.BRIGHT_RED} size={40} />
                  </TouchableOpacity>  
                </View>
                <View style={styles.updateContainer}>
                  <TouchableOpacity style={styles.updateIconPressable} onPress={onUpdatePressHandler}>
                    <FontAwesome name='check-circle-o' color={COLOR_CODE.BRIGHT_BLUE} size={40} />
                  </TouchableOpacity>  
                </View>         
              </View>
            </View>
          )
        }
      </SafeAreaView>
    </View>
  );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  editContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: COLOR_CODE.OFF_WHITE,
  },

  editImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  updateImageIconPressable: {
    height: width * 0.15,
    width: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLOR_CODE.GREY
  },

  textFieldsContainer: {
    flex: 5,
    padding: 20,
  },
  commonInput: {
    backgroundColor: COLOR_CODE.OFF_WHITE
  },

  cancelOrUpdateContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  cancelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelIconPressable: {
    width: width * 0.2,
    height: width * 0.2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  updateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  updateIconPressable: {
    width: width * 0.2,
    height: width * 0.2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  horizontalLine: {
    height: 5,  
    backgroundColor: COLOR_CODE.LIGHT_GREY
  },

  errorText: {
    fontSize: height * 0.02,
    fontWeight: '600',
    color: COLOR_CODE.BRIGHT_RED
  }
});
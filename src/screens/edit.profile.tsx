import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TextInput, Button } from 'react-native-paper';
import { pick } from 'lodash';
import updateProfile from '../api/update.profile';
import updateProfilePicture from '../api/update.profile.picture';
import requestSignedUrl from '../api/request.signed.url';
import TopBar from '../components/top.bar';
import Loading from '../components/loading';
import EditProfileSelect from '../components/edit.profile.select';
import { COLOR_CODE } from '../utils/enums';
import { profilePictureOptions, allowedImageTypes, maxImageSizeBytes } from '../utils/constants';
import { formatText } from '../utils/helpers';
import { getUserId } from '../utils/user.id';
import Environments from '../utils/environments';
import { ThemeContext } from '../contexts/theme.context';

type UpdateProfileObj = {
  description?: string,
  city?: string,
  name: string,
  work?: string,
  university?: string,
  lookingFor?: string,
  traits?: string,
  preferences?: string
}

type UpdateProfileKeys = {
  description?: boolean,
  city?: boolean,
  name?: boolean,
  work?: boolean,
  university?: boolean,
  lookingFor?: boolean,
  traits?: boolean,
  preferences?: boolean
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
  university?: string,
  lookingFor?: string,
  traits?: string,
  preferences?: string
}

FontAwesome.loadFont();
const { width, height } = Dimensions.get('window');

const EditProfileScreen = (props: any) => {
  const { appTheme } = useContext(ThemeContext);
  const params = props?.route?.params;
  const userId = getUserId() as number;
  const profileObj: UserProfileRes = params?.profileDetails;
  const defaultUpdateObj: UpdateProfileObj = {
    city: formatText(profileObj.city) || '',
    work: formatText(profileObj.work) || '',
    university: formatText(profileObj.university) || '',
    name: formatText(profileObj.name),
    lookingFor: profileObj.lookingFor,
    preferences: profileObj.preferences,
    traits: profileObj.traits,
    description: profileObj.description || ''
  };
  const [error, setError] = useState('');
  const [updateImage, setUpdateImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState<Asset>();
  const [updateDetails, setUpdateDetails] = useState(false);
  const [updateObj, setUpdateObj] = useState<UpdateProfileObj>(defaultUpdateObj);
  const [updateKeys, setUpdateKeys] = useState<UpdateProfileKeys>({});
  const [selectOption, setSelectOption] = useState('');
  
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

  const themeColor = appTheme === 'dark' ? {
    mainContainer: COLOR_CODE.BLACK,
    uploadText: COLOR_CODE.OFF_WHITE
  } : {
    mainContainer: COLOR_CODE.OFF_WHITE,
    uploadText: COLOR_CODE.GREY
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
    if (updateObj.lookingFor?.toLowerCase() !== defaultUpdateObj.lookingFor?.toLowerCase()) {
      updateKeys.lookingFor = true;
    }
    if (updateObj.traits?.toLowerCase() !== defaultUpdateObj.traits?.toLowerCase()) {
      updateKeys.traits = true;
    }
    if (updateObj.preferences?.toLowerCase() !== defaultUpdateObj.preferences?.toLowerCase()) {
      updateKeys.preferences = true;
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

  const onPressModal = (modal: string) => {
    setSelectOption(modal);
  }
  
  return (
    <View style={styles.container}>
      <TopBar />
      <SafeAreaView style={[styles.mainContainer, { backgroundColor: themeColor.mainContainer }]}>
        {
          (updateDetails || updateImage) && (<Loading />)
        }
        {
          selectOption && (<EditProfileSelect updateKey={selectOption} setUpdateObj={setUpdateObj} updateObj={updateObj} setOpenSelect={setSelectOption} />)
        }
        {
          (!updateDetails && !updateImage && !selectOption) && (
            <ScrollView style={styles.editContainer}>
              <View style={styles.editImageContainer}>
                <TouchableOpacity style={styles.updateImageIconPressable} onPress={onUploadImageHandler}>
                  <Text style={[styles.uploadText, { color: COLOR_CODE.OFF_WHITE }]}>
                    Upload Profile Picture
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.horizontalLine}></View>
              
              <View style={styles.textFieldsContainer}>    
                <Text style={{ color: COLOR_CODE.BRIGHT_RED, fontSize: 15, fontWeight: 'bold' }}>{error}</Text>
                
                <Text style={[styles.uploadText, { color: themeColor.uploadText }]}>
                  Name
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.name} onChangeText={text => onHandleChangeText(text, 'name')} />
                <Text></Text>
                
                <Text style={[styles.uploadText, { color: themeColor.uploadText }]}>
                  About (Max 300 characters)
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.description} onChangeText={text => onHandleChangeText(text, 'description')} />
                <Text></Text>
                
                <Text style={[styles.uploadText, { color: themeColor.uploadText }]}>
                  City
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.city} onChangeText={text => onHandleChangeText(text, 'city')} />
                <Text></Text>
                
                <Text style={[styles.uploadText, { color: themeColor.uploadText }]}>
                  Work
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.work} onChangeText={text => onHandleChangeText(text, 'work')} />
                <Text></Text>
                
                <Text style={[styles.uploadText, { color: themeColor.uploadText }]}>
                  University
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.university} onChangeText={text => onHandleChangeText(text, 'university')} />
                <Text></Text>
              </View>

              <View style={styles.lookingForContainer}>
                <TouchableOpacity style={styles.lookingForTouchable} onPress={() => onPressModal('lookingFor')}>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.uploadText, { color: themeColor.uploadText }]}>
                    Select What You Are Looking For 😍
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.lookingForTouchable} onPress={() => onPressModal('traits')}>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.uploadText, { color: themeColor.uploadText }]}>
                    Select Your Core Values 💯
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.lookingForTouchable} onPress={() => onPressModal('preferences')}>
                  <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.uploadText, { color: themeColor.uploadText }]}>
                    Select What Defines You 😉
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.cancelOrUpdateContainer}>
                <View style={styles.cancelContainer}>
                  <Button mode='contained' buttonColor={COLOR_CODE.CHARCOAL_GREY} style={{ borderRadius: 10 }} onPress={onCancelPressHandler}>
                    Cancel
                  </Button>  
                </View>
                <View style={styles.updateContainer}>
                  <Button mode='contained' buttonColor={COLOR_CODE.BRIGHT_BLUE} style={{ borderRadius: 10 }} onPress={onUpdatePressHandler}>
                    Update
                  </Button>  
                </View>         
              </View>
            
              
            </ScrollView>
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
    flex: 1
  },

  editContainer: {
    flex: 1,
  },

  editImageContainer: {
    height: height * 0.1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  updateImageIconPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_CODE.BRIGHT_BLUE,
    borderRadius: 10,
    padding: 10
  },
  uploadText: {
    fontSize: 15,
    fontWeight: 'bold'
  },

  textFieldsContainer: {
    height: height * 0.6,
    padding: 20,
  },
  commonInput: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },

  cancelOrUpdateContainer: {
    height: height * 0.1,
    flexDirection: 'row',
  },

  cancelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  updateContainer: {
    flex: 1,
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
  },

  lookingForContainer: {
    height: height * 0.3,
    paddingHorizontal: 20,
    justifyContent: 'space-around'
  },
  lookingForTouchable: { 
    height: '15%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLOR_CODE.LIGHT_GREY, 
    borderRadius: 10
  },

  modalContainer: { 
    position: 'absolute',
    height: height * 0.6, 
    width: width * 0.9, 
    borderRadius: 20,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },
});
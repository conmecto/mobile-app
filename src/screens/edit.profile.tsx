import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { omit } from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TopBar from '../components/top.bar';
import updateProfile from '../api/update.profile';
import updateProfilePicture from '../api/update.profile.picture';
import { COLOR_CODE } from '../utils/enums';
import { TextInput } from 'react-native-paper';
import Loading from '../components/loading';
import { profilePictureOptions, allowedImageTypes, maxImageSizeBytes } from '../utils/constants';
import { formatText } from '../utils/helpers';
import { getUserId } from '../utils/user.id';
import Environments from '../utils/environments';

type UpdateProfileObj = {
  profilePicture?: Asset, 
  userName?: string,
  description?: string,
  city?: string,
  school?: string,
  work?: string,
  igId?: string,
  snapId?: string,
  interests?: string,
  name?: string
}

type ErrorFields = {
  profilePicture?: string,
  userName?: string,
  name?: string,
  city?: string,
  description?: string,
  interests?: string,
}

FontAwesome.loadFont();
const { width, height } = Dimensions.get('window');

const EditProfileScreen = (props: any) => {
  const params = props?.route?.params;
  const userId = getUserId() as number;
  const profileObj = params?.profileDetails;
  const [updateObj, setUpdateObj] = useState<UpdateProfileObj>({});
  const [selectedUpdate, setSelectedUpdate] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ErrorFields>({});

  useEffect(() => {
    let check = true;
    if (selectedUpdate) {
      setIsLoading(true);
      const updateData = async () => {
        const res = await updateProfile(userId, updateObj)
        if (check) {
          setIsLoading(false);
          setSelectedUpdate(undefined);
          setUpdateObj({});
          if (res && res.error) {
            setFieldErrors({ ...fieldErrors, userName: 'This username is not available'});
          } else if (res) {
            setFieldErrors({});
            props.navigation.navigate('ProfileScreen');
          }
        }        
      }
      const updateImage = async () => {
        const res = await updateProfilePicture(userId, updateObj.profilePicture as Asset);
        if (check) {
          setIsLoading(false);
          setSelectedUpdate(undefined);
          setFieldErrors({});
          setUpdateObj({});
          if (res) {
            props.navigation.navigate('ProfileScreen');
          }
        }
      }
      if (updateObj.profilePicture) {
        updateImage();
      } else {
        updateData();
      }
    }
    return () => {
      check = false;
    }
  }, [selectedUpdate]);

  const handleFileImport = () => {
    launchImageLibrary(profilePictureOptions as ImageLibraryOptions, res => {
      if (res.errorMessage) {
        setFieldErrors({ ...fieldErrors, profilePicture: res.errorMessage });
      } else if (res.assets?.length) {
        const asset = res.assets[0];
        if (!asset.fileSize || !asset.type) {
          setFieldErrors({ ...fieldErrors, profilePicture: 'Corrupt file' });    
        } else if (asset.fileSize > maxImageSizeBytes) {
          setFieldErrors({ ...fieldErrors, profilePicture: 'File size exceed 10mb' });    
        } else if (!allowedImageTypes.includes(asset.type)) {
          setFieldErrors({ ...fieldErrors, profilePicture: 'File type not supported' });    
        } else {
          setUpdateObj({ profilePicture: asset });          
          setSelectedUpdate('image');
        }
      }
    });
  }

  const onCancelPressHandler = () => {
    setUpdateObj({});
    setFieldErrors({});
    props.navigation.navigate('ProfileScreen');
  }

  const onUpdatePressHandler = () => {
    if (Object.keys(updateObj).length && !Object.keys(omit(fieldErrors, ['profilePicture'])).length) {
      setSelectedUpdate('text');
    }
  }

  const onHandleChangeText = (text: string, key: string) => {
    if (text.length === 0) {
      setFieldErrors(omit({ ...fieldErrors, [key]: 'Cannot be empty' }, ['profilePicture']));
      return;
    }
    setFieldErrors(omit(fieldErrors, [key, 'profilePicture']));
    setUpdateObj({ ...updateObj, [key]: text});
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
          setFieldErrors({ ...fieldErrors, profilePicture: 'Please update your settings to allow photos access'});
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
          isLoading ?
          (<Loading />) :
          (
            <View style={styles.editContainer}>
              <View style={styles.editImageContainer}>
                <TouchableOpacity style={styles.updateImageIconPressable} onPress={onUploadImageHandler}>
                  <FontAwesome name='upload' color={COLOR_CODE.BRIGHT_BLUE} size={40} />
                </TouchableOpacity> 
                <Text style={styles.uploadText}>
                  { fieldErrors?.profilePicture ? (<Text style={styles.errorText}>{fieldErrors.profilePicture}</Text>) : 'Upload Profile Picture' }
                </Text>
              </View>

              <View style={styles.horizontalLine}></View>
              
              <View style={styles.textFieldsContainer}>
                
                <Text style={styles.uploadText}>
                  Name { fieldErrors?.name ? (<Text style={styles.errorText}>{fieldErrors.name}</Text>) : '' }
                </Text>
                <TextInput style={styles.commonInput} placeholder={formatText(profileObj.name)} defaultValue={formatText(profileObj.name)} onChangeText={text => onHandleChangeText(text, 'name')} />
                <Text></Text>
                
                {/* <Text style={styles.uploadText}>
                  Username { fieldErrors?.userName ? (<Text style={styles.errorText}>{fieldErrors.userName}</Text>) : '' }
                </Text>
                <TextInput style={styles.commonInput} placeholder={formatText(profileObj.userName)} defaultValue={formatText(profileObj.userName)} onChangeText={text => onHandleChangeText(text, 'userName')} />
                <Text></Text> */}
                
                <Text style={styles.uploadText}>
                  About { fieldErrors?.description ? (<Text style={styles.errorText}>{fieldErrors.description}</Text>) : '' }
                </Text>
                <TextInput style={styles.commonInput} placeholder={profileObj.description} defaultValue={profileObj.description} onChangeText={text => onHandleChangeText(text, 'description')} />
                <Text></Text>
                
                {/* <Text style={styles.uploadText}>
                  Interests { fieldErrors?.interests ? (<Text style={styles.errorText}>{fieldErrors.interests}</Text>) : '' }
                </Text>
                <TextInput style={styles.commonInput} placeholder={profileObj.interests} defaultValue={profileObj.interests} onChangeText={text => onHandleChangeText(text, 'interests')} />
                <Text></Text> */}
                
                <Text style={styles.uploadText}>
                  City { fieldErrors?.city ? (<Text style={styles.errorText}>{fieldErrors.city}</Text>) : '' }
                </Text>
                <TextInput style={styles.commonInput} placeholder={formatText(profileObj.city)} defaultValue={formatText(profileObj.city)} onChangeText={text => onHandleChangeText(text, 'city')} />
                <Text></Text>

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
    height: '95%',
    width: '95%',
    borderRadius: 30,
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
    fontSize: height * 0.02,
    fontWeight: '600',
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
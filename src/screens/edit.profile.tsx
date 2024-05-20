import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { pick } from 'lodash';
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
  description: string,
  city: string,
  name: string,
  error: string,
  updateImage: boolean,
  updateDetails: boolean,
  isLoading: boolean
}

type UserProfileRes = {
  id: number,
  userName?: string,
  description: string,
  city: string,
  country?: string,
  school?: string,
  work?: string,
  igId?: string,
  snapId?: string,
  interests?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  age?: number
}

FontAwesome.loadFont();
const { width, height } = Dimensions.get('window');

const EditProfileScreen = (props: any) => {
  const params = props?.route?.params;
  const userId = getUserId() as number;
  const profileObj: UserProfileRes = params?.profileDetails;
  const defaultUpdateObj: UpdateProfileObj = {
    description: profileObj.description,
    city: formatText(profileObj.city),
    name: formatText(profileObj.name),
    error: '',
    updateImage: false,
    updateDetails: false,
    isLoading: false
  };
  const [updateObj, setUpdateObj] = useState<UpdateProfileObj>(defaultUpdateObj);

  useEffect(() => {
    let check = true;
    const callUpdateData = async () => {
      const res = await updateProfile(userId, pick(updateObj, ['name', 'city', 'description']));
      setUpdateObj(defaultUpdateObj);
      if (check) {
        if (res) {
          props.navigation.replace('ProfileScreen');
        }
      } 
    }
    if (updateObj.updateDetails && updateObj.isLoading && !updateObj.updateImage && !updateObj.error) {
      callUpdateData();
    }
    return () => {
      check = false;
    }
  }, [updateObj.updateDetails]);

  useEffect(() => {
    let check = true;
    const callUpdateImage = async () => {
      const res = await updateProfilePicture(userId, updateObj.profilePicture as Asset);
      setUpdateObj(defaultUpdateObj);
      if (check) {
        if (res) {
          props.navigation.replace('ProfileScreen');
        }
      }
    }
    if (updateObj.updateImage && updateObj.isLoading && !updateObj.updateDetails && !updateObj.error) {
      callUpdateImage();
    }
    return () => {
      check = false;
    }
  }, [updateObj.updateImage]);

  const onCancelPressHandler = () => {
    setUpdateObj(defaultUpdateObj);
    props.navigation.navigate('ProfileScreen');
  }
  const checkAllSame = () => {
    if (
      updateObj.city?.toLowerCase() === profileObj.city?.toLowerCase() && 
      updateObj.name?.toLowerCase() === profileObj.name?.toLowerCase() && 
      updateObj.description?.toLowerCase() === profileObj.description?.toLowerCase()
    ) {
      return true;
    }
    return false
  }

  const onUpdatePressHandler = () => {
    let error = '';
     if (!updateObj.city.length) {
      error = 'City cannot be empty';
    }
    if (!updateObj.description.length) {
      error = 'About cannot be empty';
    }
    if (!updateObj.name.length) {
      error = 'Name cannot be empty';
    }
    if (checkAllSame()) {
      setUpdateObj(defaultUpdateObj);
      props.navigation.navigate('ProfileScreen');
    } else if (error) {
      setUpdateObj({ ...updateObj, error });
    } else {
      setUpdateObj({ ...updateObj, error: '', updateImage: false, updateDetails: true, isLoading: true });
    }
  }

  const onHandleChangeText = (text: string, key: string) => {
    setUpdateObj({ ...updateObj, [key]: text});
  }

  const handleFileImport = () => {
    launchImageLibrary(profilePictureOptions as ImageLibraryOptions, res => {
      if (res.errorMessage) {
        setUpdateObj({ ...updateObj, error: 'Something went wrong', updateDetails: false, updateImage: false, isLoading: false });
      } else if (res.assets?.length) {
        const asset = res.assets[0];
        if (!asset.fileSize || !asset.type) {
          setUpdateObj({ ...updateObj, error: 'Corrupt file', updateDetails: false, updateImage: false, isLoading: false });    
        } else if (asset.fileSize > maxImageSizeBytes) {
          setUpdateObj({ ...updateObj, error: 'File size exceed 10mb', updateDetails: false, updateImage: false, isLoading: false });    
        } else if (!allowedImageTypes.includes(asset.type)) {
          setUpdateObj({ ...updateObj, error: 'File type not supported', updateDetails: false, updateImage: false, isLoading: false });    
        } else {
          setUpdateObj({ ...updateObj, profilePicture: asset, updateDetails: false, updateImage: true, isLoading: true });
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
          setUpdateObj({ ...updateObj, error: 'Please update your settings to allow photos access'});
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
          updateObj.isLoading ?
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
                  About
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.description} onChangeText={text => onHandleChangeText(text, 'description')} />
                <Text></Text>
                
                <Text style={styles.uploadText}>
                  City
                </Text>
                <TextInput style={styles.commonInput} defaultValue={updateObj.city} onChangeText={text => onHandleChangeText(text, 'city')} />
                <Text></Text>
                <Text style={{ color: COLOR_CODE.BRIGHT_RED, fontSize: 20, fontWeight: 'bold' }}>{updateObj.error}</Text>

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
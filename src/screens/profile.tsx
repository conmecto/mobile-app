import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import TopBar from '../components/top.bar';
import ProfileDetails from '../components/profile.details';
import Posts from '../components/posts';
import getUserProfile from '../api/user.profile';
import Loading from '../components/loading';
import { getUserId } from '../utils/user.id';
import { COLOR_CODE } from '../utils/enums';
import { ThemeContext } from '../contexts/theme.context';

type UserProfileRes = {
  id: number,
  description?: string,
  city?: string,
  country?: string,
  university?: string,
  work?: string,
  profilePicture?: string,
  userId: number,
  name: string,
  age?: number,
  preferences?: string,
	traits?: string,
	lookingFor?: string
}

type ProfileObj = {
  profile?: UserProfileRes,
  isLoading: boolean,
  error: string
}

const ProfileScreen = ({ navigation, route }: any) => {
  const { appTheme } = useContext(ThemeContext);
  const { commonScreen, matchedUserId }: { commonScreen: boolean, matchedUserId: number } = route?.params;
  let userId = getUserId() as number;
  if (commonScreen) {
    userId = matchedUserId;
  }
  const [profileObj, setProfileObj] = useState<ProfileObj>({
    error: '',
    isLoading: true
  });
  
  useEffect(() => {
    let check = true;
    const fetchProfile = async () => {
      const res = await getUserProfile(userId);
      const profileObjUpdate = {
        profile: profileObj.profile,
        isLoading: false,
        error: ''
      }
      if (check && res) {
        profileObjUpdate.profile = res;
      } else if (check && !res) {
        profileObjUpdate.error = 'Something went wrong! 😭';
      }
      setProfileObj(profileObjUpdate);
    }
    if (profileObj.isLoading) {
      fetchProfile();
    }
    return () => {
      check = false;
    }
  }, []);

  const themeColor = appTheme === 'dark' ? {
    mainContainerBackgroundColor: COLOR_CODE.BLACK
  } : {
    mainContainerBackgroundColor: COLOR_CODE.OFF_WHITE
  }
  
  return (
    <View style={styles.container}>
      <TopBar />
      <SafeAreaView style={[styles.mainContainer, { backgroundColor: themeColor.mainContainerBackgroundColor }]}>
        {
          profileObj.isLoading ?
          (<Loading flex={3} />) :
          (
            profileObj.error ?
            (
              <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, color: COLOR_CODE.BRIGHT_RED, fontWeight: 'bold' }}>
                  {profileObj.error}
                </Text>
              </View>
            ) : 
            (
              <ProfileDetails profileDetails={profileObj.profile as UserProfileRes} navigate={navigation.navigate} commonScreen={!!commonScreen} />
            )
          )
        }
        <Posts navigate={navigation.navigate} userId={userId} />
      </SafeAreaView>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLOR_CODE.OFF_WHITE
  }
});
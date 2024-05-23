import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import TopBar from '../components/top.bar';
import ProfileDetails from '../components/profile.details';
import Posts from '../components/posts';
import getUserProfile from '../api/user.profile';
import getUserPosts from '../api/user.posts';
import Loading from '../components/loading';
import { getUserId } from '../utils/user.id';
import { COLOR_CODE } from '../utils/enums';

type UserProfileRes = {
  id: number,
  userName?: string,
  description?: string,
  city?: string,
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

type ProfileObj = {
  profile?: UserProfileRes,
  isLoading: boolean,
  error: string
}

type UserPost = {
  id: number,
  userId: number,
  location: string,
  type: string,
  fileMetadataId: number,
  createdAt: Date,
  updatedAt: Date,
  deletedAt?: Date | null
}

type PostObj = {
  posts: UserPost[],
  isLoading: boolean,
  page: number,
  hasMore: boolean,
  isRefreshing: boolean
}

const ProfileScreen = (props: any) => {
  const userId = getUserId() as number;
  const perPage = 10;
  const [profileObj, setProfileObj] = useState<ProfileObj>({
    error: '',
    isLoading: true
  });
  const [postObj, setPostObj] = useState<PostObj>({
    posts: [],
    isLoading: true,
    isRefreshing: false,
    page: 1,
    hasMore: true
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
  
  useEffect(() => {
    let check = true;
    const fetchPosts = async () => {
      const res = await getUserPosts(userId, { page: postObj.page, perPage });
      const postObjUpdated = {
        ...postObj,
        isLoading: false,
        isRefreshing: false
      }
      if (check) {
        if (res?.posts) {
          postObjUpdated.posts.push(...res.posts);
          postObjUpdated.hasMore = res.hasMore;
        }
      }
      setPostObj(postObjUpdated);
    }
    if (postObj.isRefreshing && postObj.hasMore && postObj.isLoading) {
      fetchPosts();
    }
    return () => {
      check = false;
    }
  }, [postObj.isRefreshing]);
  
  useEffect(() => {
    let check = true;
    const fetchPosts = async () => {
      const res = await getUserPosts(userId, { page: postObj.page, perPage });
      const postObjUpdated = {
        ...postObj,
        isLoading: false,
        isRefreshing: false
      }
      if (check) {
        if (res?.posts) {
          postObjUpdated.posts.push(...res.posts);
          postObjUpdated.hasMore = res.hasMore;
        }
      }
      setPostObj(postObjUpdated);
    }
    if (postObj.hasMore && postObj.isLoading && !postObj.isRefreshing) {
      fetchPosts();
    }
    return () => {
      check = false;
    }
  }, [postObj.page]);

  return (
    <View style={styles.container}>
      <TopBar />
      <SafeAreaView style={styles.mainContainer}>
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
              <ProfileDetails profileDetails={profileObj.profile as UserProfileRes} navigation={props.navigation} />
            )
          )
        }
        {
          postObj.isLoading ?
          (<Loading flex={4} />) :
          (
            <Posts 
              postObj={postObj} navigation={props.navigation} setPostObj={setPostObj} 
            />
          )
        }
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
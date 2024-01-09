import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import TopBar from '../components/top.bar';
import ProfileDetails from '../components/profile.details';
import Posts from '../components/posts';
import getUserProfile from '../api/user.profile';
import getUserPosts from '../api/user.posts';
import Loading from '../components/loading';
import { getUserId } from '../utils/user.id';

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

const ProfileScreen = (props: any) => {
  const userId = getUserId() as number;
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [postPagination, setPostPagination] = useState({
    isPostFetchComplete: false,
    isPostScrollAtEnd: true,
    page: 1
  });
  const [profileDetails, setProfileDetails] = useState<UserProfileRes>();
  const [posts, setPosts] = useState<[UserPost[]]>([[]]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setIsProfileLoading(true);
      setIsPostLoading(true);
      setPostPagination({
        isPostFetchComplete: false,
        isPostScrollAtEnd: true,
        page: 1
      });
      setPosts([[]]);
    });
    return unsubscribe;
  }, [props.navigation]);
 
  useEffect(() => {
    let check = true;
    const fetchProfile = async () => {
      const res = await getUserProfile(userId);
      if (check && res) {
        setProfileDetails(res);
      }
      setIsProfileLoading(false);
    }
    if (isProfileLoading) {
      fetchProfile();
    }
    return () => {
      check = false;
    }
  }, [isProfileLoading]);

  useEffect(() => {
    let check = true;
    const fetchPosts = async () => {
      const res = await getUserPosts(userId, { page: postPagination.page, perPage: 10 });
      let isPostFetchComplete = false;
      if (check && res) {
        if (res?.length) {
          const formatted: [UserPost[]] = [...posts];
          let k = posts[posts.length-1].length === 2 ? posts.length : posts.length-1;
          for(let i = 0; i < res.length; i++) {
            if (!formatted[k]?.length) {
              formatted[k] = [];
              formatted[k].push(res[i]);
            } else {
              formatted[k].push(res[i]);
              k += 1;
            }
          }
          setPosts(formatted);
        } else {
          isPostFetchComplete = true;
        }
      }
      setIsPostLoading(false);
      setPostPagination({
        isPostFetchComplete,
        isPostScrollAtEnd: false,
        page: postPagination.page + (isPostFetchComplete ? 0 : 1)
      });
    }
    if (postPagination.isPostScrollAtEnd && !postPagination.isPostFetchComplete && isPostLoading) {
      fetchPosts();
    }
    return () => {
      check = false;
    }
  }, [postPagination.isPostScrollAtEnd]);

  return (
    <View style={styles.container}>
      <TopBar />
      <SafeAreaView style={styles.mainContainer}>
        {
          isProfileLoading ?
          (<Loading flex={3} />) :
          (<ProfileDetails profileDetails={profileDetails} navigation={props.navigation} />)
        }
        {
          isPostLoading ?
          (<Loading flex={4} />) :
          (
            <Posts 
              posts={posts} navigation={props.navigation} userId={userId} setPostPagination={setPostPagination} 
              setIsPostLoading={setIsPostLoading} setPosts={setPosts} postPagination={postPagination}
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
    flex: 1
  }
});
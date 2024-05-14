import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from '../components/top.bar';
import CommonProfileDetails from '../components/common.profile.details';
import CommonPosts from '../components/common.post';
import getUserProfile from '../api/user.profile';
import getUserPosts from '../api/user.posts';
import Loading from '../components/loading';

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

const CommonProfileScreen = (props: any) => {
  const routedUserId = props?.route?.params?.routedUserId;
  const showTopBar = props?.route?.params?.showTopBar;
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileDetails, setProfileDetails] = useState<UserProfileRes>();
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [postPagination, setPostPagination] = useState({
    isPostFetchComplete: false,
    isPostScrollAtEnd: true,
    page: 1
  });
  const [posts, setPosts] = useState<[UserPost[]]>([[]]);
  
  useEffect(() => {
    let check = true;
    const fetchData = async () => {
      const res = await getUserProfile(routedUserId);
      if (check && res) {
        setProfileDetails(res);
      }
      setIsLoadingProfile(false);
    }
    fetchData();
    return () => {
      check = false;
    }
  }, []);

  useEffect(() => {
    let check = true;
    const fetchPosts = async () => {
      const res = await getUserPosts(routedUserId, { page: postPagination.page, perPage: 10 });
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
    if (postPagination.isPostScrollAtEnd && !postPagination.isPostFetchComplete) {
      fetchPosts();
    }
    return () => {
      check = false;
    }
  }, [postPagination.isPostScrollAtEnd]);

  return (
    <View style={styles.container}>
      { showTopBar ? (<TopBar />) : (<></>) }
      {
        isLoadingProfile ?
        (<Loading />) :
        ( <CommonProfileDetails profileDetails={profileDetails as UserProfileRes} />)
      }
      {
          isPostLoading ?
          (<Loading flex={4} />) :
          (
            <CommonPosts 
              posts={posts} navigation={props.navigation} setPostPagination={setPostPagination} 
              setIsPostLoading={setIsPostLoading} postPagination={postPagination}
            />
          )
      }
    </View>
  );
}

export default CommonProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1
  }
});
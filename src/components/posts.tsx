import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import getUserPosts from '../api/user.posts';

type UserPost = {
  id: number,
  userId: number,
  location: string,
  type: string,
  createdAt: string,
  caption: string,
  match: boolean,
  reported?: boolean,
  reportedBy?: number,
  reactCount: number,
  tags: string
}

type PostObj = {
  isLoading: boolean,
  page: number,
  hasMore: boolean,
  isRefreshing: boolean
}

type params = { 
  navigate: any,
  userId: number 
}

FontAwesome.loadFont();
Entypo.loadFont();

const { height } = Dimensions.get('window');
const polaroidHeight = height * 0.25;

const Polaroid =  React.memo(({ item, navigate }: { item: UserPost, navigate: any }) => {
  const onPressPolaroid = (post: UserPost) => {
    navigate('ViewPostScreen', { post });
  }
  return (
    <View style={styles.polaroidContainer}>
      <TouchableOpacity style={styles.polaroidTouchable} onPress={() => onPressPolaroid(item)}>
        <Image source={{ uri: item.location }} style={styles.polaroidImage}/>
      </TouchableOpacity>
    </View>
  );
});
  
const Posts = ({ navigate, userId }: params) => {
  const perPage = 4;
  const [postData, setPostData] = useState<UserPost[]>([]);
  const [postObj, setPostObj] = useState<PostObj>({
    isLoading: true,
    isRefreshing: false,
    page: 1,
    hasMore: true
  });

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
          setPostData(prevData => { 
            prevData.push(...res.posts); 
            return prevData;
          });
          postObjUpdated.hasMore = res.hasMore;
        }
        setPostObj(postObjUpdated);
      }
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
          setPostData(prevData => { 
            prevData.push(...res.posts); 
            return prevData;
          });
          postObjUpdated.hasMore = res.hasMore;
        }
        setPostObj(postObjUpdated);
      }
    }
    if (postObj.hasMore && postObj.isLoading && !postObj.isRefreshing) {
      fetchPosts();
    }
    return () => {
      check = false;
    }
  }, [postObj.page]);

  const onRefreshPosts = () => {
    setPostData([]);
    setPostObj({ page: 1, isLoading: true, isRefreshing: true, hasMore: true });
  }

  const onLoadMorePost = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
    if (postObj.hasMore) {
      setPostObj({ ...postObj, isLoading: true, page: postObj.page + 1 });
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Polaroids</Text> 
      </View>
      <View style={{ flex: 1 }}>
        <FlatList 
          data={postData}
          renderItem={({ item }) => <Polaroid item={item} navigate={navigate} />}
          keyExtractor={(item: any, index: number) => item.id?.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          onEndReached={onLoadMorePost}
          onEndReachedThreshold={0}
          refreshing={postObj.isRefreshing}
          onRefresh={onRefreshPosts}
        />
      </View>
    </View>
  );
}

export default Posts;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 4,
    // borderWidth: 1
  },

  headerContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'SavoyeLetPlain'
  },

  polaroidContainer: { flex: 0.5, height: polaroidHeight, alignItems: 'center', justifyContent: 'center' },
  polaroidTouchable: { height: '90%', width: '90%', alignItems: 'center', justifyContent: 'center' },
  polaroidImage: { height: '100%', width: '100%', borderRadius: 30 }
});
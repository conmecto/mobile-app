import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import getUserPosts from '../api/user.posts';
import { COLOR_CODE } from '../utils/enums';
import { ThemeContext } from '../contexts/theme.context';

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
  const { appTheme } = useContext(ThemeContext);
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

  const themeColor = appTheme === 'dark' ? {
    headerTextColor: COLOR_CODE.OFF_WHITE
  } : {
    headerTextColor: COLOR_CODE.BLACK
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: themeColor.headerTextColor }]}>Polaroids</Text> 
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
          refreshControl={
            <RefreshControl
              refreshing={postObj.isRefreshing}
              onRefresh={onRefreshPosts}
              // colors={['#yourColor']} // Android 
              tintColor={COLOR_CODE.BRIGHT_BLUE}  // iOS
            />
          }
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
    paddingTop: 10,
    alignItems: 'center', 
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR_CODE.LIGHT_GREY,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  headerText: {
    fontSize: 30,
    fontWeight: '900',
    fontFamily: 'SavoyeLetPlain'
  },

  polaroidContainer: { flex: 0.5, height: polaroidHeight, alignItems: 'center', justifyContent: 'center' },
  polaroidTouchable: { height: '90%', width: '90%', alignItems: 'center', justifyContent: 'center' },
  polaroidImage: { height: '100%', width: '100%', borderRadius: 30 }
});
import React, { useEffect, useState } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLOR_CODE } from '../utils/enums';
import { getUserId } from '../utils/user.id';
import { setBulkPost } from '../utils/post';
import getFeed from '../api/get.feed';
import PolaroidItem from '../components/feed.polaroid';

type PostObj = {
    isLoading: boolean,
    page: number,
    hasMore: boolean,
    isRefreshing: boolean
}
 
Entypo.loadFont();
MaterialIcons.loadFont();

const { height } = Dimensions.get('window');
const polaroidHeight = Math.floor(height * 0.9);

const FeedScreen = ({ navigation }: any) => {  
    const userId = getUserId() as number;
    const perPage = 2;
    const [data, setData] = useState<number[]>([]);
    const [postObj, setPostObj] = useState<PostObj>({
        isLoading: true,
        isRefreshing: false,
        page: 1,
        hasMore: true
    }); 

    useEffect(() => {
        let check = true;
        const callFetchFeed = async () => {
            const res = await getFeed(userId, { page: postObj.page, perPage });
            let hasMore = false;
            if (check) {
                if (res?.feed?.length) {
                    hasMore = res.hasMore;
                    const postIds = res.feed.map(feed => feed.id);
                    setBulkPost(res.feed);
                    setData(prevData => [...prevData, ...postIds]);
                } 
                setPostObj(prevState => ({ 
                    ...prevState, 
                    isLoading: false,
                    isRefreshing: false,
                    hasMore 
                }));
            }
        }
        if (postObj.hasMore && postObj.isLoading) {
            callFetchFeed();
        }
        return () => {
            check = false;
        }
    }, [postObj.page]);  

    const onLoadMorePost = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
        if (postObj.hasMore) {
          setPostObj(prevState => ({ ...prevState, isLoading: true, page: postObj.page + 1 }));
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLOR_CODE.BLACK }}>
            <FlatList 
                data={data}
                renderItem={({ item, index }) => 
                    <PolaroidItem postId={item} navigate={navigation.navigate} setPostObj={setPostObj} setData={setData} />
                }
                keyExtractor={(item: any, index: number) => index?.toString()}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onEndReached={onLoadMorePost}
                onEndReachedThreshold={0}
                getItemLayout={(data, index) => ({
                    length: polaroidHeight, index, offset: polaroidHeight * index
                })}
            />
        </View>
    );
}

export default FeedScreen;

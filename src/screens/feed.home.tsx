import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLOR_CODE } from '../utils/enums';
import { getUserId } from '../utils/user.id';
import getFeed from '../api/get.feed';
import Loading from '../components/loading';
import PolaroidItem from '../components/feed.polaroid';

type UserPost = {
    id: number,
    userId: number,
    location: string,
    type: string,
    createdAt: string,
    profilePicture?: string,
    name: string,
    caption: string,
    match: boolean,
    reported?: boolean
}
 
Entypo.loadFont();
MaterialIcons.loadFont();

const FeedScreen = ({ navigation }: any) => {  
    const userId = getUserId() as number;
    const perPage = 10;
    const [data, setData] = useState<UserPost[]>([]);
    const [page, setPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        let check = true;
        const callFetchFeed = async () => {
            const res = await getFeed(userId, { page, perPage });
            if (check) {
                if (res?.feed?.length) {
                    setData((prevData) => page === 1 ? res.feed : [...prevData, ...res.feed])
                } 
            }
            setIsLoading(false);
        }
        if (hasMore && isLoading) {
            callFetchFeed();
        }
        return () => {
            check = false;
        }
    }, [page]);

    const onPressViewProfile = (userId: number) => {
        navigation.navigate('ProfileScreen', { commonScreen: true, matchedUserId: userId });
    }
    
    return (
        isLoading ? 
        (
            <Loading />
        ) :
        (   
            <View style={{ flex: 1, backgroundColor: COLOR_CODE.BLACK }}>
                <FlatList 
                    data={data}
                    renderItem={({ item, index }) => 
                        <PolaroidItem item={item} onPressViewProfile={onPressViewProfile} userId={userId} />
                    }
                    keyExtractor={(item: any, index: number) => item?.id?.toString()}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    );
}

export default FeedScreen;

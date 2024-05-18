import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { COLOR_CODE } from '../utils/enums';
import { getUserId } from '../utils/user.id';
import getFeed from '../api/get.feed';
import Loading from '../components/loading';
import { DEFAULT_PROFILE_PIC } from '../files';

type UserPost = {
    id: number,
    userId: number,
    location: string,
    type: string,
    fileMetadataId: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null,
    profilePic?: string,
    name: string,
    caption: string,
    refLink?: string
  }

const { width, height } = Dimensions.get('window');
Entypo.loadFont();

const FeedScreen = () => {  
    const userId = getUserId() as number;
    const perPage = 10;
    const [data, setData] = useState<UserPost[]>([]);
    const [page, setPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const polaroidHeight = Math.floor(height * 0.9);
    let i = 0;
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
    const Polaroid = ({ item }: { item: UserPost }) => {
        return (
            <View style={{ height: polaroidHeight, justifyContent: 'center' }}>
                <View style={{ height: '80%', backgroundColor: COLOR_CODE.OFF_WHITE, borderRadius: 30 }}>
                    <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={{ uri: item.location }} style={{ height: '95%', width: '95%', borderRadius: 30 }}/>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text numberOfLines={2} adjustsFontSizeToFit style={{ fontSize: 30, fontWeight: '900', fontFamily: 'SavoyeLetPlain' }}>{item.caption}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ width: 120, height: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Image source={item.profilePic ? { uri: item.profilePic } : DEFAULT_PROFILE_PIC} style={{ height: 30, width: 30, borderWidth: 1, borderRadius: 50, borderColor: COLOR_CODE.GREY }}/>
                                <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 15, fontWeight: '900', fontFamily: 'SavoyeLetPlain' }}>{item.name}</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={{ height: 50, width: 50, position: 'absolute', alignSelf: 'flex-end', bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <Entypo name='dots-three-horizontal' color={COLOR_CODE.GREY} size={30} />
                </TouchableOpacity>
            </View>
        )
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
                    renderItem={({ item}) => <Polaroid item={item} />}
                    keyExtractor={(item: any, index: number) => item?.id?.toString()}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    );
}

export default FeedScreen;
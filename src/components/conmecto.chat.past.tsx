import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import getPastGenMessages from '../api/get.past.gen.messages';
import { getUserId } from '../utils/user.id';
import { COLOR_CODE } from '../utils/enums';
import { ThemeContext } from '../contexts/theme.context';

Ionicons.loadFont();
const { height } = Dimensions.get('window');

type PastGenMessage = {
    id: number,
    context: string, 
    response: string,
    hasMore: boolean,
    copied?: boolean
}

type PaginationObj = {
    page: number,
    isLoading: boolean,
    hasMoreMessages: boolean
}

type Params = {
    setViewPast: any
}

const GenMessageView = React.memo(({ genMessage }: { genMessage: PastGenMessage }) => {
    const [copied, setCopied] = useState(false);

    const copyText = () => {
        Clipboard.setString(genMessage.response);
        setCopied(true);
    }
    
    return (
        <View style={styles.messageMainContainer}>
            <View style={styles.contextMainContainer}>
                <View style={styles.contextContainer}>
                    <Text numberOfLines={5} adjustsFontSizeToFit style={styles.contextText}>
                        {genMessage.context}
                    </Text>
                </View>
            </View>
            <View style={styles.responseMainContainer}>
                <View style={styles.responseContainer}> 
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={10} adjustsFontSizeToFit style={styles.responseText}>
                            {genMessage.response.substring(0, 500)}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={copyText} style={styles.copyTouchable}>
                        <Text style={styles.copyText}>
                            { copied ? 'Copied' : 'Copy' }
                        </Text>
                    </TouchableOpacity>
                </View> 
            </View>
        </View>
    )
});

const ConmectoChatPast = ({ setViewPast }: Params) => {  
    const { appTheme } = useContext(ThemeContext);
    const userId = getUserId() as number;
    const [pastGenMessages, setPastGenMessages] = useState<PastGenMessage[]>([]);
    const [paginationObj, setPaginationObj] = useState<PaginationObj>({
        page: 1,
        isLoading: true,
        hasMoreMessages: true
    });

    useEffect(() => {
        let check = true;
        const callGetData = async () => {
          const res = await getPastGenMessages(userId, paginationObj.page);
          const paginationOptions = {
            page: paginationObj.page,
            isLoading: false,
            hasMoreMessages: false
          }
          if (check) {
            if (res?.length) {
                paginationOptions.hasMoreMessages = res[0].hasMore;
                setPastGenMessages(prevData => [...prevData, ...res]);
            }
            setPaginationObj(paginationOptions);
          }
        }
        if (paginationObj.isLoading && paginationObj.hasMoreMessages) {
          callGetData();
        }
        return () => {
          check = false;
        }
    }, [paginationObj.page]);

    const handleLoadMore = ({ distanceFromEnd }: { distanceFromEnd: number }) => {
        if (paginationObj.hasMoreMessages) {
          setPaginationObj({ hasMoreMessages: true, page: paginationObj.page + 1, isLoading: true });
        }
    }

    const onPressClose = () => {
        setViewPast(false);
    }

    const themeColor = appTheme === 'dark' ? {
        mainContainerBackgroundColor: COLOR_CODE.BLACK,
        headerText: COLOR_CODE.DIM_GREY
    } : {
        mainContainerBackgroundColor: COLOR_CODE.OFF_WHITE,
        headerText: COLOR_CODE.BLACK
    }
    
    return (
        <View style={[styles.mainContainer, { backgroundColor: themeColor.mainContainerBackgroundColor }]}>
            <View style={styles.closeContainer}>
                <TouchableOpacity onPress={() => onPressClose()}>
                    <Ionicons size={35} name='close-circle' color='#86A8E7' />
                </TouchableOpacity>
            </View>
            <View style={styles.headerContainer}>
                <Text style={[styles.headerText, { color: themeColor.headerText }]}>
                    Generated Messages: 
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList 
                    data={pastGenMessages}
                    renderItem={({ item }) => <GenMessageView genMessage={item} />}
                    keyExtractor={(item: PastGenMessage, index) => index?.toString()}
                    scrollEnabled={true}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 4 },
    closeContainer: { flex: 0, alignItems: 'flex-end', paddingRight: 10 },
    headerContainer: { flex: 0, alignItems: 'flex-start', paddingLeft: 10 },
    headerText: { fontSize: 15, fontWeight: 'bold' },
    messageMainContainer: { height: height * 0.4 },
    contextMainContainer: { flex: 1, justifyContent: 'center', paddingLeft: 10 },
    contextContainer: { height: '90%', width: '80%', backgroundColor: COLOR_CODE.LOGO_BLUE, borderRadius: 25, padding: 10 },
    contextText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE },
    responseMainContainer: { flex: 3, justifyContent: 'center', paddingRight: 10 },
    responseContainer: { height: '90%', width: '80%', backgroundColor: COLOR_CODE.LOGO_COLOR, borderRadius: 25, alignSelf: 'flex-end', padding: 10 },
    responseText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE },
    copyTouchable: { flex: 0, alignSelf: 'center', padding: 5, borderWidth: 2, borderRadius: 10, borderColor: COLOR_CODE.OFF_WHITE },
    copyText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE }
});

export default ConmectoChatPast;
import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Modal, Portal, Provider } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import reportUserPost from '../api/report.post';
import reactUserPost from '../api/react.post';
import blockProfile from '../api/block.profile';
import { getPolaroidDate, getFormatedView, formatText } from '../utils/helpers';
import { COLOR_CODE } from '../utils/enums';
import { getUserId } from '../utils/user.id';
import { getPost, setPost } from '../utils/post';
import { colors } from '../utils/constants';
import TagItem from '../components/tag';
import { DEFAULT_PROFILE_PIC } from '../files';

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};

type PostOptions = {
    openOptionsModal: boolean,
    openReportModal: boolean,
    openBlockModal: boolean,
    reportPost: boolean,
    reactToPost: boolean,
    blockUser: boolean
}

type PolaroidItemParameters = {
    postId: number,
    navigate: any,
    setPostObj: any,
    setData: any
}

const { width, height } = Dimensions.get('window');
const polaroidHeight = Math.floor(height * 0.9);
    
Entypo.loadFont();
MaterialIcons.loadFont();

const PolaroidItem = React.memo(({ postId, navigate, setPostObj, setData }: PolaroidItemParameters) => {
    const userId = getUserId() as number;
    const item = getPost(postId);
    const [postOptions, setPostOptions] = useState<PostOptions>({
        openBlockModal: false,
        openOptionsModal: false,
        openReportModal: false,
        reportPost: false,
        reactToPost: false,
        blockUser: false
    });
    const polaroidDate = getPolaroidDate(item?.createdAt);
    const [views, symbol] = getFormatedView(item.reactCount);
    const onPressViewProfile = () => {
        navigate('ProfileScreen', { commonScreen: true, matchedUserId: item.userId });
    }

    useEffect(() => {
        let check = true;
        const callReportPostApi = async () => {
            const res = await reportUserPost(item.id, userId);
            if (check) {
                setPostOptions(prevState => ({
                    ...prevState,
                    reportPost: false
                }));
                if (res?.message) {
                    setPostObj((prevState: any) => ({
                        ...prevState,
                        isLoading: true,
                        isRefreshing: false,
                        page: 1,
                        hasMore: true
                    }));
                    setData([]);
                }
            }
        }
        if (postOptions.reportPost && !item.reported) { 
            callReportPostApi();
        }
        return () => {
          check = false;
        }
    }, [postOptions.reportPost]);

    useEffect(() => {
        let check = true;
        const callBlockProfile = async () => {
            const res = await blockProfile(userId, item.userId);
            if (check) {
                setPostOptions(prevState => ({
                    ...prevState,
                    blockUser: false
                }));
                if (res?.message) {
                    setPostObj((prevState: any) => ({
                        ...prevState,
                        isLoading: true,
                        isRefreshing: false,
                        page: 1,
                        hasMore: true
                    }));
                    setData([]);
                }
            }
        }
        if (postOptions.blockUser) { 
            callBlockProfile();
        }
        return () => {
          check = false;
        }
    }, [postOptions.blockUser]);

    useEffect(() => {
        let check = true;
        const callReactPostApi = async () => {
            await reactUserPost(item.id, userId);
            if (check) {
                setPostOptions(prevState => ({
                    ...prevState,
                    reactToPost: false
                }));
            }
        }
        if (postOptions.reactToPost && !item.reacted) { 
            item.reacted = true;
            item.reactCount += 1;
            setPost(postId, item);
            callReactPostApi();
        }
        return () => {
          check = false;
        }
    }, [postOptions.reactToPost]);

    const onPressPostOptions = () => {
        if (!postOptions.openOptionsModal) {
            setPostOptions(prevState => ({ ...prevState, openOptionsModal: true }));
        }
    }

    const onDismissOptionsModal = () => {
        if (postOptions.openOptionsModal) {
            setPostOptions(prevState => ({ ...prevState, openOptionsModal: false }));
        }
    }

    const onDismissReportModal = () => {
        if (postOptions.openReportModal) {
            setPostOptions(prevState => ({ ...prevState, openReportModal: false }));
        }
    }

    const onDismissBlockModal = () => {
        if (postOptions.openBlockModal) {
            setPostOptions(prevState => ({ ...prevState, openBlockModal: false }));
        }
    }

    const onPressReportButton = () => {
        setPostOptions(prevState => ({ 
            ...prevState, 
            openOptionsModal: false, 
            openReportModal: true 
        }));
    }

    const onPressBlockButton = () => {
        setPostOptions(prevState => ({ 
            ...prevState, 
            openOptionsModal: false, 
            openBlockModal: true 
        }));
    }

    const onPressReport = () => {
        setPostOptions(prevState => ({ 
            ...prevState, 
            openReportModal: false,
            reportPost: true 
        }));
    }

    const onPressBlock = () => {
        setPostOptions(prevState => ({ 
            ...prevState, 
            openBlockModal: false,
            blockUser: true 
        }));
    }

    const onPressReact = () => {
        if (!item.reacted) {
            setPostOptions(prevState => ({
                ...prevState,
                reactToPost: true
            }));
        }
    }

    return (
        <View style={styles.polaroidMainContainer}>
            <Provider>
                <Portal>
                    <Modal visible={postOptions.openOptionsModal} 
                        onDismiss={onDismissOptionsModal} 
                        contentContainerStyle={styles.optionsModalStyle}
                    >
                        <View style={{ flex: 1 }}>
                            {
                                item.reacted ? 
                                (
                                    <View style={styles.reactContainer}>
                                        <Text style={styles.reactText}>
                                            Starred <MaterialIcons name='reviews' color={COLOR_CODE.GOLDEN} size={20} />
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={onPressReact} style={styles.reactTouchable}>
                                        <Text style={styles.reactText}>
                                            Give a Star <MaterialIcons name='reviews' color={COLOR_CODE.GOLDEN} size={20} />
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                            <TouchableOpacity onPress={onPressReportButton} style={styles.reportTouchable}>
                                <Text style={styles.reportText}>
                                    Report Polaroid
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={(onPressBlockButton)} style={styles.blockTouchable}>
                                <Text style={styles.reportText}>
                                    Block User Profile
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={postOptions.openReportModal} 
                        onDismiss={onDismissReportModal} contentContainerStyle={styles.modalStyle}
                    >
                        <View style={styles.modalContainer}>
                            <Text numberOfLines={2} adjustsFontSizeToFit style={styles.reportTitle}>
                                Report if you find this content to be
                            </Text>
                            <Text style={styles.reportTitleOptions}>
                                Hateful or Violent or Abusive or Sexual or Explicit or Harmful or Dangerous or 
                                Spam or Misleading or Child abuse
                            </Text>
                            <Button onPress={onPressReport} buttonColor={COLOR_CODE.BRIGHT_RED} 
                                textColor={COLOR_CODE.OFF_WHITE} labelStyle={{ fontSize: 12 }}
                            >
                                Confirm
                            </Button>
                        </View>
                    </Modal>
                    <Modal visible={postOptions.openBlockModal} 
                        onDismiss={onDismissBlockModal} contentContainerStyle={styles.modalStyle}
                    >
                        <View style={styles.modalContainer}>
                            <Text numberOfLines={2} adjustsFontSizeToFit style={styles.reportTitle}>
                                Are you sure you want to Block this User Profile?
                            </Text>
                            <Button onPress={onPressBlock} buttonColor={COLOR_CODE.BRIGHT_RED} 
                                textColor={COLOR_CODE.OFF_WHITE} labelStyle={{ fontSize: 12 }}
                            >
                                Confirm
                            </Button>
                        </View>
                    </Modal>
                </Portal>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.polaroidContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.location }} style={styles.image}/>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 3 }}>
                                <View style={styles.captionContainer}>
                                    <Text numberOfLines={2} adjustsFontSizeToFit style={styles.captionText}>
                                        {item.caption}
                                    </Text>
                                </View>
                                <View style={styles.dateContainer}>
                                    <Text numberOfLines={1} style={styles.dateText}>
                                        {polaroidDate}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={styles.profileContainer}>
                                    <TouchableOpacity style={styles.profileTouchable} 
                                        onPress={() => onPressViewProfile()}
                                    >
                                        <Image 
                                            source={item.profilePicture ? { uri: item.profilePicture } : DEFAULT_PROFILE_PIC} 
                                            style={styles.profilePicture}
                                        />
                                        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.nameText}>
                                            {formatText(item.name)}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: '200' }}>
                                        {views} {symbol} <MaterialIcons name='reviews' color={COLOR_CODE.GOLDEN} size={20} />
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                {
                    item.tags &&
                    (   
                        <View style={styles.tagsMainContainer}>
                            <View style={styles.tagsContainer}>
                                {
                                    item.tagsArray?.map((tag, index) => {
                                        if (item.tagsColor) {
                                            return (<TagItem tag={tag} key={index} tagColor={item.tagsColor[index]}/>)
                                        }
                                    })
                                }
                            </View>
                        </View>
                    )
                }
                <TouchableOpacity style={styles.optionTouchable} onPress={onPressPostOptions}>
                    <Entypo name='dots-three-horizontal' color={COLOR_CODE.GREY} size={35} />
                </TouchableOpacity>
            </Provider>
        </View>
    );
})

const styles = StyleSheet.create({
    polaroidMainContainer: { height: polaroidHeight },
    polaroidContainer: { height: '80%', backgroundColor: COLOR_CODE.OFF_WHITE, borderRadius: 30 },
    imageContainer: { flex: 4, alignItems: 'center', justifyContent: 'center' },
    image: { height: '95%', width: '95%', borderRadius: 30 },
    captionContainer: { flex: 2, alignItems: 'center', justifyContent: 'center' },
    captionText: { fontSize: 30, fontWeight: '900', fontFamily: 'SavoyeLetPlain' },
    profilePicture: { height: 30, width: 30, borderWidth: 1, borderRadius: 50, borderColor: COLOR_CODE.GREY },
    dateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    dateText: { fontSize: 25, fontWeight: '900', fontFamily: 'SavoyeLetPlain' },
    nameText: { fontSize: 15, fontWeight: '900', fontFamily: 'SavoyeLetPlain' },
    profileTouchable: { flex: 1, alignItems: 'center', justifyContent: 'space-evenly' },
    profileContainer: { flex: 2 },
    optionTouchable: { 
        height: width * 0.15, width: width * 0.15, position: 'absolute', alignSelf: 'flex-end', bottom: 0, 
        alignItems: 'center', justifyContent: 'center'
    },
    optionsModalStyle: { 
        bottom: 0,
        right: 10,
        position: 'absolute', 
        borderRadius: 10, 
        height: height * 0.15, 
        width: width * 0.4, 
        backgroundColor: COLOR_CODE.OFF_WHITE
    },
    modalStyle: { alignSelf: 'center', borderRadius: 30, height: height * 0.2, width: width * 0.6, backgroundColor: COLOR_CODE.OFF_WHITE},
    modalContainer: { flex: 1, padding: 5, alignItems: 'center', justifyContent: 'space-evenly' },
    reportedModalContainer: { flex: 1, padding: 5, alignItems: 'center', justifyContent: 'center' },
    reportTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    reportTitleOptions: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLOR_CODE.GREY
    },
    reactContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: COLOR_CODE.LIGHT_GREY },
    reactTouchable: { flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 0.5, borderBottomColor: COLOR_CODE.LIGHT_GREY },
    reactText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_BLUE },
    reportText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_RED },
    reportTouchable: { flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 0.5, borderBottomColor: COLOR_CODE.LIGHT_GREY },
    blockTouchable: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    reportContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    tagsMainContainer: {  height: width * 0.15, width: width * 0.7, position: 'absolute', bottom: 0 },
    tagsContainer: { flex: 1, paddingLeft: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }
});

export default PolaroidItem;

import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Modal, Portal, Provider } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLOR_CODE } from '../utils/enums';
import { DEFAULT_PROFILE_PIC } from '../files';
import { getPolaroidDate, getFormatedView, formatText } from '../utils/helpers';
import reportUserPost from '../api/report.post';

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

type PostOptions = {
    openOptionsModal: boolean,
    openReportModal: boolean,
    reportPost: boolean,
}

type PolaroidItemParameters = {
    item: UserPost,
    userId: number,
    onPressViewProfile: (userId: number) => void
}

const { width, height } = Dimensions.get('window');
const polaroidHeight = Math.floor(height * 0.9);
    
Entypo.loadFont();
MaterialIcons.loadFont();

const PolaroidItem = ({ item, onPressViewProfile, userId }: PolaroidItemParameters) => {
    const [postOptions, setPostOptions] = useState<PostOptions>({
        openOptionsModal: false,
        openReportModal: false,
        reportPost: false
    });
    const polaroidDate = getPolaroidDate(item?.createdAt);
    const [views, symbol] = getFormatedView(100000);

    useEffect(() => {
        let check = true;
        const callReportPostApi = async () => {
            const res = await reportUserPost(item.id, userId);
            if (check) {
                setPostOptions(prevState => ({
                    ...prevState,
                    reportPost: false
                }));
            }
        }
        if (postOptions.reportPost && !item.reported) { 
            item.reported = true;
            callReportPostApi();
        }
        return () => {
          check = false;
        }
    }, [postOptions.reportPost]);

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

    const onPressReportButton = () => {
        setPostOptions(prevState => ({ 
            ...prevState, 
            openOptionsModal: false, 
            openReportModal: true 
        }));
    }

    const onPressReport = () => {
        setPostOptions(prevState => ({ 
            ...prevState, 
            openReportModal: false,
            reportPost: true 
        }));
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
                            <TouchableOpacity 
                                onPress={onPressReportButton}
                                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_RED }}>
                                    Report Polaroid
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal visible={postOptions.openReportModal} 
                        onDismiss={onDismissReportModal} contentContainerStyle={styles.modalStyle}
                    >
                        {
                            item.reported ? 
                            (
                                <View style={styles.reportedModalContainer}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_RED }}>
                                        Reported ✅
                                    </Text>
                                </View>
                            ) :
                            (
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
                            )
                        }
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
                                    <TouchableOpacity style={styles.profileTouchable} onPress={() => onPressViewProfile(item.userId)}>
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
                <TouchableOpacity style={styles.optionTouchable} onPress={onPressPostOptions}>
                    <Entypo name='dots-three-horizontal' color={COLOR_CODE.GREY} size={30} />
                </TouchableOpacity>
            </Provider>
        </View>
    )
}

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
        height: 50, width: 50, position: 'absolute', alignSelf: 'flex-end', bottom: 0, 
        alignItems: 'center', justifyContent: 'center' 
    },
    optionsModalStyle: { 
        bottom: 0,
        right: 10,
        position: 'absolute', 
        borderRadius: 10, 
        height: height * 0.05, 
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
});

export default PolaroidItem;

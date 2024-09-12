import React, { useState , useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getTextGenSetting from '../api/get.text.gen.setting';
import TopBar from '../components/top.bar'; 
import ConmectoChatResponse from '../components/conmecto.chat.response';
import ConmectoChatPrompts from '../components/conmecto.chat.prompts';
import ConmectoChatPast from '../components/conmecto.chat.past';
import { COLOR_CODE } from '../utils/enums';
import { getUserId } from '../utils/user.id';
import { ThemeContext } from '../contexts/theme.context';
import { IMAGE_LOGO_CROPPED } from '../files';

Ionicons.loadFont();
const { height } = Dimensions.get('window');

type TextGenSetting = {
    current: number,
    max: number,
    lastResetAt: Date,
    isWaitingPeriod: boolean
}

const ConmectoChat = ({ navigation }: any) => {
    const { appTheme } = useContext(ThemeContext);
    const userId = getUserId() as number;
    const [context, setContext] = useState('');
    const [generateText, setGenerateText] = useState(false);
    const [textGenSetting, setTextGenSetting] = useState<TextGenSetting>();
    const [viewPast, setViewPast] = useState(false);

    useEffect(() => {
        let check = true;
        const callFetchSetting = async () => {
            const res = await getTextGenSetting(userId);
            if (check) {
                if (res) {
                    setTextGenSetting(res);
                }
            }
        }
        if (!textGenSetting) {
            callFetchSetting();
        }
        return () => {
            check = false;
        }
    }, []); 

    const onCloseConmectoChat = () => {
        navigation.goBack();
    }

    const themeColor = appTheme === 'dark' ? {
        mainContainerBackgroundColor: COLOR_CODE.BLACK,
        headerText: COLOR_CODE.DIM_GREY
    } : {
        mainContainerBackgroundColor: COLOR_CODE.OFF_WHITE,
        headerText: COLOR_CODE.GREY
    }

    return (
        <View style={{ flex: 1 }}>
            <TopBar />
            <View style={{ flex: 1, backgroundColor: themeColor.mainContainerBackgroundColor }}>
                <View style={styles.headerImageContainer}>
                    <Image source={IMAGE_LOGO_CROPPED} style={styles.headerImage}/>                
                </View>
                <View style={styles.headerTextContainer}>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.headerText, { color: themeColor.headerText }]}>
                        Hi there! Ready to assist 😊 
                    </Text>
                </View>
            </View>
            {
                (!generateText && !viewPast) && (
                    <ConmectoChatPrompts context={context} setGenerateText={setGenerateText}
                        textGenSetting={textGenSetting} setContext={setContext} onCloseConmectoChat={onCloseConmectoChat}
                        setViewPast={setViewPast}
                    />
                )
            }
            {
                (generateText && !viewPast) && (
                    <ConmectoChatResponse context={context} generateText={generateText}
                        setGenerateText={setGenerateText} setContext={setContext}
                    />
                )
            }
            {
                (viewPast && !generateText) && (
                    <ConmectoChatPast setViewPast={setViewPast} />
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    headerImageContainer: { flex: 0, justifyContent: 'center', alignItems: 'center' },
    headerImage: { height: height * 0.07, width: height * 0.07, borderRadius: 100 },
    headerTextContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerText: { fontSize: 20, fontWeight: 'bold' }
});

export default ConmectoChat;
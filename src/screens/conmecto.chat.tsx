import React, { useState , useEffect} from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopBar from '../components/top.bar'; 
import ConmectoChatResponse from '../components/conmecto.chat.response';
import ConmectoChatPrompts from '../components/conmecto.chat.prompts';
import ConmectoChatPast from '../components/conmecto.chat.past';
import getTextGenSetting from '../api/get.text.gen.setting';
import { COLOR_CODE } from '../utils/enums';
import { getUserId } from '../utils/user.id';
import { IMAGE_LOGO_CROPPED } from '../files';

Ionicons.loadFont();
const { height } = Dimensions.get('window');

type TextGenSetting = {
    current: number,
    max: number,
    lastResetAt: Date,
    isWaitingPeriod: boolean
}

const ConmectoChat = ({ route, navigation }: any) => {
    const currentMatches: number = route.params?.currentMatches;
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

    return (
        <View style={{ flex: 1 }}>
            <TopBar />
            <View style={{ flex: 1, backgroundColor: COLOR_CODE.OFF_WHITE }}>
                <View style={styles.headerImageContainer}>
                    <Image source={IMAGE_LOGO_CROPPED} style={styles.headerImage}/>                
                </View>
                <View style={styles.headerTextContainer}>
                    <Text numberOfLines={2} adjustsFontSizeToFit style={styles.headerText}>
                        Hi there! Ready to assist 😊 
                    </Text>
                </View>
            </View>
            {
                (!generateText && !viewPast) && (
                    <ConmectoChatPrompts context={context} currentMatches={currentMatches} setGenerateText={setGenerateText}
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
    headerText: { fontSize: 20, fontWeight: 'bold', color: COLOR_CODE.GREY }
});

export default ConmectoChat;
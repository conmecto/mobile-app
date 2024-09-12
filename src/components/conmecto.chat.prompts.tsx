import React, { useState, useContext } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-paper';
import { COLOR_CODE } from '../utils/enums';
import { ThemeContext } from '../contexts/theme.context';

Ionicons.loadFont();
const { width } = Dimensions.get('window');

type TextGenSetting = {
    current: number,
    max: number,
    lastResetAt: Date,
    isWaitingPeriod: boolean
}

type Params = {
    context: string,
    textGenSetting?: TextGenSetting,
    setGenerateText: any,
    setContext: any,
    onCloseConmectoChat: any,
    setViewPast: any
}

const ConmectoChatPrompts = ({ 
    context, textGenSetting, setContext, setGenerateText,
    onCloseConmectoChat, setViewPast
}: Params) => {
    const { appTheme } = useContext(ThemeContext);
    const [keyboardEnabled, setKeyboardEnabled] = useState(false);

    const onEnterContext = (text: string) => {
        setContext(text.substring(0, 50));
    }

    const onPressGenerate = () => {
        if (context) {
            setGenerateText(true);
        }
    }
    
    const cannotGenerateMessage = textGenSetting?.isWaitingPeriod ? 'Reset in 24 hours ⏳' : '';

    const themeColor = appTheme === 'dark' ? {
        mainContainerBackgroundColor: COLOR_CODE.BLACK
    } : {
        mainContainerBackgroundColor: COLOR_CODE.OFF_WHITE
    }

    return (
        <KeyboardAvoidingView behavior='padding' enabled={keyboardEnabled} style={[styles.mainContainer, { backgroundColor: themeColor.mainContainerBackgroundColor }]}> 
            <View style={styles.closeContainer}>
                <TouchableOpacity onPress={() => onCloseConmectoChat()}>
                    <Ionicons size={35} name='close-circle' color='#86A8E7' />
                </TouchableOpacity>
            </View>
            <View style={styles.genMessageMainContainer}>
                <LinearGradient start={{x: 0, y: 0}}  colors={['#86A8E7', '#7F7FD5']} style={styles.gradient}>
                    <View style={styles.headerContainer}>
                        <Text numberOfLines={3} adjustsFontSizeToFit style={styles.headerText}>
                            Generate Impressive Messages for Your Matches
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.contextTitleText}>
                            Context: "The User {context}"
                        </Text>
                    </View>
                    <View style={styles.contextInputContainer}>
                        <TextInput 
                            onChangeText={text => onEnterContext(text)} 
                            value={context} 
                            placeholder='The User ...... (50 characters limit)' 
                            style={styles.contextInput} 
                            onFocus={() => setKeyboardEnabled(true)}
                            onSubmitEditing={() => setKeyboardEnabled(false)}
                        />
                    </View>                    
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingText}>
                            {textGenSetting?.current || 0} / {textGenSetting?.max || 3} Used
                        </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        {
                            cannotGenerateMessage ? (
                                <Text style={styles.errorText}>
                                    {cannotGenerateMessage}
                                </Text>
                            ) : (
                                <Button buttonColor='#86A8E7' mode='contained' onPress={onPressGenerate}>
                                    Generate
                                </Button>
                            )
                        }
                    </View>
                </LinearGradient>
            </View>
            {   
                !keyboardEnabled && (
                    <View style={styles.pastContainer}>
                        <Button mode='contained' buttonColor='#7F7FD5' onPress={() => setViewPast(true)}>
                            View Past Messages
                        </Button>
                    </View>
                )
            }
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 4 },
    closeContainer: { flex: 0, alignItems: 'flex-end', paddingRight: width * 0.05 },
    genMessageMainContainer: { flex: 4, alignItems: 'center', justifyContent: 'center' },
    gradient: { height: '90%', width: '90%', borderRadius: 30 },
    headerContainer: { flex: 2, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: COLOR_CODE.OFF_WHITE },
    headerText: { color: COLOR_CODE.WHITE, fontSize: 25, fontWeight: 'bold' },
    contextTitleText: { fontSize: 20, color: COLOR_CODE.WHITE, fontWeight: 'bold', paddingLeft: 10 },
    contextInputContainer: { flex: 1, justifyContent: 'center',  alignItems: 'center' },
    contextInput: { height: '60%', width: '95%', backgroundColor: COLOR_CODE.WHITE, borderRadius: 10, color: COLOR_CODE.GREY, padding: 2 },
    settingContainer: { flex: 0.5, justifyContent: 'center' , alignItems: 'flex-end', paddingRight: 10 },
    settingText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.WHITE },
    buttonContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    errorText: { fontSize: 15, fontWeight: 'bold' },
    pastContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: width * 0.05 },
});

export default ConmectoChatPrompts;
import React, { useState } from 'react';
import { StyleSheet, View, Image, Dimensions, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLOR_CODE } from '../utils/enums';
import { IMAGE_LOGO_CROPPED } from '../files';
import TopBar from '../components/top.bar'; 
import { ASK_CONMECTO_PROMPTS, colors } from '../utils/constants';
import FixedPromptResponse from '../components/fixed.prompt.response';

const randomColor = () => {
    const size = colors.length;
    return colors[Math.floor(Math.random() * size)];
};

Ionicons.loadFont();
const { height } = Dimensions.get('window');

type SelectedPrompt = {
    prompt: string,
    promptType: string
}

const ConmectoChat = () => {
    const [selectedPrompt, setSelectedPrompt] = useState<SelectedPrompt>({
        prompt: '',
        promptType: ''
    });

    const onSelectPrompt = (prompt: string, promptType: string) => {
        setSelectedPrompt({
            prompt,
            promptType
        })
    }

    const onClearSelectedPrompt = () => {
        setSelectedPrompt({
            prompt: '',
            promptType: ''
        });
    }

    return (
        <View style={{ flex: 1 }}>
            <TopBar />
            <View style={styles.mainContainer}>
                <View style={{ flex: 1 }}>
                    <View style={styles.headerImageContainer}>
                        <Image source={IMAGE_LOGO_CROPPED} style={styles.headerImage}/>                
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.headerText}>
                            Hey, What can I help you with?
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 4 }}>
                {
                    selectedPrompt.prompt ?
                    (
                        <View style={{ flex: 1 }}>
                            <View style={styles.closeIconContainer}>
                                <TouchableOpacity onPress={() => onClearSelectedPrompt()}>
                                    <Ionicons size={35} name='close-circle' />
                                </TouchableOpacity>
                            </View>
                            {
                                selectedPrompt.promptType === 'fixed' ? (
                                    <FixedPromptResponse prompt={selectedPrompt.prompt} />
                                ) : (
                                    <View>
                            
                                    </View>
                                )
                            }
                        </View>
                    ) : (
                        <View style={styles.promptMainContainer}>
                            {
                                ASK_CONMECTO_PROMPTS.fixed.map((prompt, index) => {
                                    const fontColor = prompt === 'Find a Match' ? COLOR_CODE.BLACK : randomColor();
                                    return (
                                        <TouchableOpacity 
                                            key={index} 
                                            onPress={() => onSelectPrompt(prompt, 'fixed')} 
                                            style={styles.promptTouchable}
                                        >
                                            <Text style={[styles.promptText, { color: fontColor }]}>
                                                {prompt}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View>
                    )
                }    
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: COLOR_CODE.OFF_WHITE },
    headerImageContainer: { flex: 0, justifyContent: 'center', alignItems: 'center' },
    headerImage: { height: height * 0.07, width: height * 0.07, borderRadius: 100 },
    headerTextContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerText: { fontSize: 20, fontWeight: 'bold', color: COLOR_CODE.GREY },
    closeIconContainer: { flex: 0, justifyContent: 'center', alignItems: 'flex-end', padding: 10 },
    promptMainContainer: {
        flex: 1, flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', padding: 10 
    },
    promptTouchable: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 0.5,
        backgroundColor: 'white',
        borderColor: COLOR_CODE.LIGHT_GREY,
        borderRadius: 10,
        padding: 10,
        margin: 4,
    },
    promptText: { fontSize: 15, fontWeight: 'bold' }
});

export default ConmectoChat;
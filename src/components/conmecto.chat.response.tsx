import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import createTextGenJob from '../api/create.text.gen.job';
import getTextGenJob from '../api/get.text.gen.job';
import { getUserId } from '../utils/user.id';
import { COLOR_CODE } from '../utils/enums';
import { ThemeContext } from '../contexts/theme.context';
import { THREE_DOT_LOADER_GIF } from '../files';

Ionicons.loadFont();

type Params = {
    context: string,
    generateText: boolean,
    setGenerateText: any,
    setContext: any
}

const ConmectoChatResponse = ({ 
    context, setGenerateText, setContext, generateText
}: Params) => {  
    const { appTheme } = useContext(ThemeContext);
    const userId = getUserId() as number;
    const [loading, setLoading] = useState(false);
    const [jobId, setJobId] = useState<number>();
    const [error, setError] = useState('');
    const [jobResponse, setJobResponse] = useState('');
    const [copied, setCopied] = useState(false);

    const onClearSelectedPrompt = () => {
        setContext('');
        setGenerateText(false);
    }
    
    const copyText = () => {
        Clipboard.setString(jobResponse);
        setCopied(true);
    }

    useEffect(() => {
        let check = true;
        let timerId: NodeJS.Timeout | null = null;
        const callGenerateText = async () => {
            const res = await createTextGenJob(userId, context);
            if (check) {
                if (res) {
                    timerId = setTimeout(() => {
                        setJobId(res.jobId);
                    }, 15000);
                    setLoading(true);
                } else {
                    setError('Oops! Something went wrong. Please try again 😫');
                }
            }
        }
        if (context && generateText && !loading) {
            callGenerateText();
        }
        return () => {
            check = false;
            if (timerId) {
                clearTimeout(timerId)
            }
        }
    }, [generateText]);

    useEffect(() => {
        let check = true;
        const callGetData = async () => {
            const res = await getTextGenJob(userId, jobId as number);
            if (check) {
                if (res) {
                    setJobResponse(res.response);
                } else {
                    setError('Oops! Something went wrong. Please try again 😫')
                }
                setLoading(false);
                setJobId(undefined);
            }
        }
        if (jobId && loading) {
            callGetData();
        }
        return () => {
            check = false;
        }
    }, [jobId]);

    const themeColor = appTheme === 'dark' ? {
        mainContainerBackgroundColor: COLOR_CODE.BLACK
    } : {
        mainContainerBackgroundColor: COLOR_CODE.OFF_WHITE
    }

    return (
        <View style={[styles.mainContainer, { backgroundColor: themeColor.mainContainerBackgroundColor }]}>
            <View style={styles.closeContainer}>
                <TouchableOpacity onPress={() => onClearSelectedPrompt()}>
                    <Ionicons size={35} name='close-circle' color='#86A8E7' />
                </TouchableOpacity>
            </View>
            <View style={styles.contextMainContainer}>
                <View style={styles.contextContainer}>
                    <Text numberOfLines={5} adjustsFontSizeToFit style={styles.contextText}>
                        The User {context}
                    </Text>
                </View>
            </View>
            <View style={styles.responseMainContainer}>
                {
                    (error && !jobResponse && !loading) && (
                        <View style={styles.errorContainer}> 
                            <Text numberOfLines={2} adjustsFontSizeToFit style={styles.errorText}>
                                {error}
                            </Text>
                        </View> 
                    )
                }
                {
                    (loading && !error && !jobResponse) && (
                        <View style={styles.loaderContainer}> 
                            <Image source={THREE_DOT_LOADER_GIF} style={styles.loaderImage} />
                        </View> 
                    )
                }
                {
                    (jobResponse && !error && !loading) && (
                        <View style={styles.responseContainer}> 
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={10} adjustsFontSizeToFit style={styles.responseText}>
                                    {jobResponse.substring(0, 500)}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={copyText} style={styles.copyTouchable}>
                                <Text style={styles.copyText}>
                                    { copied ? 'Copied' : 'Copy' }
                                </Text>
                            </TouchableOpacity>
                        </View> 
                    )
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 4 },
    closeContainer: { flex: 0, alignItems: 'flex-end', paddingRight: 10 },
    contextMainContainer: { flex: 1, justifyContent: 'center', paddingLeft: 10 },
    contextContainer: { height: '90%', width: '80%', backgroundColor: '#86A8E7', borderRadius: 25, padding: 10 },
    contextText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE },
    responseMainContainer: { flex: 3, paddingTop: 10, paddingRight: 10 },
    responseContainer: { height: '60%', width: '80%', backgroundColor: '#7F7FD5', borderRadius: 25, alignSelf: 'flex-end', padding: 10 },
    responseText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE },
    copyTouchable: { flex: 0, alignSelf: 'center', padding: 5, borderWidth: 2, borderRadius: 10, borderColor: COLOR_CODE.OFF_WHITE },
    copyText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE },
    errorContainer: { height: '20%', width: '80%', backgroundColor: COLOR_CODE.BLACK, borderRadius: 25, alignSelf: 'flex-end', padding: 10 },
    errorText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.OFF_WHITE },
    loaderContainer: { height: '10%', width: '20%', alignSelf: 'flex-end' },
    loaderImage: { height: '100%', width: '100%' }
});

export default ConmectoChatResponse;
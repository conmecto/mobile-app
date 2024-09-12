import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { unlink } from 'react-native-fs';
import requestSignedUrl from '../api/request.signed.url';
import uploadPost from '../api/upload.post';
import { getUserId } from '../utils/user.id';
import { getFileType } from '../utils/helpers';
import { COLOR_CODE } from '../utils/enums';
import environments from '../utils/environments';
import { ThemeContext } from '../contexts/theme.context';

FontAwesome.loadFont();
MaterialCommunityIcons.loadFont();

type param = {
    capturedPhoto: {
        path: string,
        height: number,
        width: number
    },
    polaroidDetail: {
        caption: string,
        tags?: string,
        match: boolean
    }
}

const UploadFileScreen = ({ route, navigation }: any) => {  
    const { appTheme } = useContext(ThemeContext);
    const { capturedPhoto, polaroidDetail }: param = route.params;
    const userId = getUserId() as number;
    const [isLoading, setIsLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    const genericError = 'Something went wrong!';

    useEffect(() => {
        let check = true;
        let timerId: null | NodeJS.Timeout = null;
        const callAddPolaroid = async () => {
            const fileName = capturedPhoto.path.split('/').pop() as string;
            const fileType = getFileType(fileName.split('.').pop() as string) as string;
            const res = await requestSignedUrl({ userId, fileName, contentType: fileType, uploadType: 'post' });
            if (check && res?.url) {
                const result = await fetch(capturedPhoto.path);
                const file = await result.blob();
                try {
                    const url = res.url as string;
                    const key = url.split('?')?.shift() as string; 
                    const uploadRes = await fetch(url,  {
                        method: 'PUT',
                        headers: {
                            'Content-Type': fileType,
                        },
                        body: file
                    });
                    if (uploadRes.status === 200)  {
                        const data = {
                            key,
                            name: fileName,
                            mimetype: fileType,
                            size: file.size, 
                            height: capturedPhoto.height,
                            width: capturedPhoto.width,
                            match: polaroidDetail.match,
                            caption: polaroidDetail.caption,
                            ...(polaroidDetail.tags ? { tags: polaroidDetail.tags } : {})
                        }
                        const addPostRes = await uploadPost(userId, data);
                        if (addPostRes?.message) {
                            timerId = setTimeout(() => {
                                navigation.navigate('CameraScreen');
                            }, 2000);
                        } else {
                            setShowError(true);
                        }
                    } else {
                        setShowError(true);
                    }
                } catch(error) {
                    setShowError(true);
                    if (environments.appEnv !== 'prod') {
                        console.log('Polaroid upload error', error);
                    }
                }
            } else {
                setShowError(true);
            }
            unlink(capturedPhoto.path)
                .then()
                .catch((err) => {
                if (environments.appEnv !== 'prod') {
                    console.log('file delete error');
                }
                });
            setIsLoading(false);
        }
        if (isLoading) {
            callAddPolaroid();
        }
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
            check = false;
        }
    }, []);

    const themeColor = appTheme === 'dark' ? {
        mainBackgroundColor: COLOR_CODE.BLACK,
        addingText: COLOR_CODE.OFF_WHITE,
        addedText: COLOR_CODE.OFF_WHITE,
    } : {
        mainBackgroundColor: COLOR_CODE.OFF_WHITE,
        addingText: COLOR_CODE.BLACK,
        addedText: COLOR_CODE.BRIGHT_BLUE,
    }
    
    return (
        showError ? (
            <View style={[styles.mainContainer, { backgroundColor: themeColor.mainBackgroundColor }]}>
                <Text style={styles.error}>{genericError}</Text>
            </View>
        ) : (
            isLoading ?
            (
                <View style={{ flex: 1 }}>
                    <View style={[styles.mainContainer, { backgroundColor: themeColor.mainBackgroundColor }]}>
                        <Text style={[styles.addingText, { color: themeColor.addingText }]}>Adding Polaroid...{'\n'}</Text>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: COLOR_CODE.BLACK }}>⏳👀</Text>
                    </View>
                </View>
            ) :
            (
                <View style={[styles.mainContainer, { backgroundColor: themeColor.mainBackgroundColor }]}>
                    <Text style={[styles.addedText, { color: themeColor.addedText }]}>Polaroid Added 📸</Text>
                </View>
            )
        )
    );
}

export default UploadFileScreen;

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    error: { fontSize: 30, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_RED },
    addingText: { fontSize: 30, fontWeight: 'bold' },
    addedText: { fontSize: 30, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_BLUE }
});
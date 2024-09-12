import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopBar from '../components/top.bar';
import { COLOR_CODE } from '../utils/enums';
import { onUploadImageHandler } from '../utils/image.upload';
import { ThemeContext } from '../contexts/theme.context';

Ionicons.loadFont();

type CapturedPhoto = {
    path: string,
    height: number,
    width: number
}

const AddFileScreen = ({ navigation }: any) => {  
    const { appTheme } = useContext(ThemeContext);
    const [error, setError] = useState('');
    const [post, setPost] = useState<CapturedPhoto>();
    const [showUploadModal, setShowUploadModal] = useState(true);
    useEffect(() => {
        if (post?.path) {
            navigation.navigate('CapturedCameraScreen', { capturedPhoto: post });
        }
    }, [post?.path]);

    if (!error && !post?.path && showUploadModal) {
        setShowUploadModal(false);
        onUploadImageHandler(setError, setPost);
    }
    
    const onPressImage = () => {
        setError('');
        setPost(undefined);
        setShowUploadModal(true);
    }

    const themeColor = appTheme === 'dark' ? {
        mainBackgroundColor: COLOR_CODE.BLACK,
        uploadFileText: COLOR_CODE.OFF_WHITE
    } : {
        mainBackgroundColor: COLOR_CODE.OFF_WHITE,
        uploadFileText: COLOR_CODE.BLACK
    }
    
    return (
        <View style={{ flex: 1 }}>
            <TopBar />
            <View style={[styles.mainContainer, { backgroundColor: themeColor.mainBackgroundColor }]}>
                {
                    error && (
                        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.errorText}>
                            {error}
                        </Text>
                    )
                }
                <TouchableOpacity onPress={() => onPressImage()} style={styles.uploadFileContainer}>
                    <Ionicons name='images' color={COLOR_CODE.BRIGHT_BLUE} size={60} />
                    <Text style={[styles.uploadFileText, { color: themeColor.uploadFileText }]}>{'\n'} Upload File</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default AddFileScreen;

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadFileText: { fontSize: 20, fontWeight: 'bold', color: COLOR_CODE.BLACK },
    errorText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_RED, paddingBottom: 100 },
    uploadFileContainer: { alignItems: 'center', justifyContent: 'space-between' }
});
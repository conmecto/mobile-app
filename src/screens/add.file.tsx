import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLOR_CODE } from '../utils/enums';
import TopBar from '../components/top.bar';
import { onUploadImageHandler } from '../utils/image.upload';

Ionicons.loadFont();

type CapturedPhoto = {
    path: string,
    height: number,
    width: number
}

const AddFileScreen = ({ navigation }: any) => {  
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
    
    return (
        <View style={{ flex: 1 }}>
            <TopBar />
            <View style={styles.mainContainer}>
                <Text numberOfLines={2} adjustsFontSizeToFit style={styles.errorText}>
                    {error}
                </Text>
                <TouchableOpacity onPress={() => onPressImage()} style={styles.uploadFileContainer}>
                    <Ionicons name='images' color={COLOR_CODE.BRIGHT_BLUE} size={60} />
                    <Text style={styles.uploadFileText}>Upload File</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default AddFileScreen;

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1,
        backgroundColor: COLOR_CODE.OFF_WHITE,
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadFileText: { fontSize: 20, fontWeight: 'bold', color: COLOR_CODE.BLACK },
    errorText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.BRIGHT_RED, paddingBottom: 100 },
    uploadFileContainer: { alignItems: 'center', justifyContent: 'space-between' }
});
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { postOptions, allowedImageTypes, maxImageSizeBytes } from './constants';
import Environments from './environments'

const handleFileImport = (setError: any, setPost: any) => {
    launchImageLibrary(postOptions as ImageLibraryOptions, res => {
        if (res.errorMessage) {
            setError(res.errorMessage);
        } else if (res.assets?.length) {
            const asset = res.assets[0];
            if (!asset.fileSize || !asset.type) {
                setError('Corrupt file');    
            } else if (asset.fileSize > maxImageSizeBytes) {
                setError('File size exceed 10mb');    
            } else if (!allowedImageTypes.includes(asset.type)) {
                setError('File type not supported');    
            } else {
                setError('');
                setPost({
                    path: asset.uri,
                    height: asset.height,
                    width: asset.width
                });
            }
        }
    });
}
  
const onUploadImageHandler = (setError: any, setPost: any) => {
    check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
        switch(result) {
            case RESULTS.UNAVAILABLE:
                break;
            case RESULTS.DENIED:
                request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
                    if (Environments.appEnv !== 'prod') {
                        console.log('request result', result)
                    }
                }).catch(error => {
                    if (Environments.appEnv !== 'prod') {
                        console.log('request error', error)
                    }
                });
            case RESULTS.LIMITED:
            case RESULTS.GRANTED:
                handleFileImport(setError, setPost);
                break;
            case RESULTS.BLOCKED:
                setError('Please allow photos access from the settings');
                break;
            default: 
                break;
        }
    }).catch(error => { 
        if (Environments.appEnv !== 'prod') {
        console.log('upload image error', error)
        }
    });
}

export { 
    onUploadImageHandler, handleFileImport
}
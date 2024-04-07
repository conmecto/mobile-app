const SEARCH_FOR = ['women', 'men', 'everyone'];
const GENDER = ['woman', 'others', 'man'];

const Days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']

const postOptions = {
  mediaType: 'photo',	
  maxWidth: 675,	
  maxHeight: 1200,
  //quality: 0.8,
  //durationLimit: 60,
  includeBase64: false,
  includeExtra: false,
  selectionLimit: 1
}

const profilePictureOptions = {
  mediaType: 'photo',	
  maxWidth: 320,	
  maxHeight: 320,
  //quality: 1,
  // videoQuality
  //durationLimit
  //quality
  //cameraType
  includeBase64: false,
  includeExtra: false,
  selectionLimit: 1
}

const allowedFileTypes = [
  'image/avif', 'image/bmp', 'image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp', 'image/heic', 
  'image/heif', 'image/heic-sequence', 'image/apng' 
  // ,'video/x-msvideo', 'video/mp4', 'video/mpeg', 'video/quicktime',
  // 'video/3gpp', 'video/ogg', 'video/webm', 'video/hevc', 'video/avc'
]

const allowedImageTypes = [
  'image/avif', 'image/bmp', 'image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp', 'image/heic', 
  'image/heif', 'image/heic-sequence', 'image/apng'
]

//10mb 
const maxImageSizeBytes = 10485760;

//10mb
const maxFileSizeBytes = 10485760;

const initialLogoScreenTimeMilli = 2000;

export { 
  SEARCH_FOR, profilePictureOptions, postOptions, maxFileSizeBytes, allowedFileTypes, allowedImageTypes,
  maxImageSizeBytes, Days, initialLogoScreenTimeMilli, GENDER
};
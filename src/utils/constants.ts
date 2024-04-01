const SEARCH_FOR = ['men', 'women', 'everyone'];

const Days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']

const postOptions = {
  mediaType: 'photo',	
  //durationLimit: 60,
  includeBase64: false,
  includeExtra: false,
  selectionLimit: 1
}

const profilePictureOptions = {
  mediaType: 'photo',	
  // maxWidth: ''	
  // maxHeight	
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

export { 
  SEARCH_FOR, profilePictureOptions, postOptions, maxFileSizeBytes, allowedFileTypes, allowedImageTypes,
  maxImageSizeBytes, Days
};
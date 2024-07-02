const SEARCH_FOR = ['women', 'men', 'everyone'];
const GENDER = ['woman', 'others', 'man'];

const Days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']

const postOptions = {
  mediaType: 'photo',	
  maxWidth: 720,
  maxHeight: 1280,
  //quality: 0.8,
  //durationLimit: 60,
  includeBase64: false,
  includeExtra: false,
  selectionLimit: 1
}

const profilePictureOptions = {
  mediaType: 'photo',	
  maxWidth: 420,	
  maxHeight: 420,
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

const polaroidTags = [
  'Anime',       'Art',       'Astrology',   'Bars',
  'Beach',       'Bowling',   'Cafe',        'Camping',
  'Cat',         'Climbing',  'Coffee',      'Concerts',
  'Cooking',     'Cosplay',   'Cricket',     'Cycling',
  'Dancing',     'Desert',    'Dog',         'Drawing',
  'Family',      'Fashion',   'Festival',    'Football',
  'Friends',     'Gym',       'Happy',       'Hiking',
  'Instagram',   'Investing', 'K-Pop',       'Literature',
  'Love',        'Manga',     'Mountains',   'Music',
  'Netflix',     'Party',     'Photography', 'Picnic',
  'Politics',    'Reading',   'Road Trips',  'Running',
  'Science',     'Singing',   'Skin Care',   'Sky Diving',
  'Snapchat',    'Sneakers',  'Sports',      'Stand Up Comedy',
  'Street Food', 'Sunrise',   'Sunset',      'Sushi',
  'Swimming',    'Tattoos',   'Tea',         'Travel',
  'Walking',     'Waterfall', 'Wine',        'Workout',
  'Yoga'
];

const colors = [
  '#d14747', '#d16a47',   '#d18c47',
  '#d1af47', '#d1d147', '#afd147',
  '#8cd147', '#6ad147', '#47d147',
  '#47d16a', '#47d18c', '#47d1af',
  '#48d1cc', '#47d1d1', '#47afd1',
  '#478cd1', '#476ad1', '#4747d1',
  '#6a47d1', '#8c47d1', '#af47d1',
  '#d147d1', '#d147af', '#d1478c',
  '#d1476a', '#d14747'
];

export { 
  SEARCH_FOR, profilePictureOptions, postOptions, maxFileSizeBytes, allowedFileTypes, allowedImageTypes,
  maxImageSizeBytes, Days, initialLogoScreenTimeMilli, GENDER, polaroidTags, colors
};
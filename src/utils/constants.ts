const SEARCH_FOR = ['women', 'men', 'everyone'];
const GENDER = ['woman', 'nonbinary', 'man'];

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
  maxWidth: 720,
  maxHeight: 600,
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
  '#d1476a', '#d14747', '#FF7518',
  '#228C22'
];

const GEOLOCATION_TIMEOUT_MILLIS = 1000;
const GEOLOCATION_MAX_AGE_MILLIS = 86400000;

const Cities: any = {
  'in': [
    'ahmedabad',     'bengaluru',
    'bhopal',        'chandigarh',
    'chennai',       'coimbatore',
    'delhi',         'gurugram',
    'hyderabad',     'indore',
    'jaipur',        'kanpur',
    'kolkata',       'lucknow',
    'ludhiana',      'mumbai',
    'nagpur',        'noida ',
    'patna',         'pune',
    'surat',         'vadodara',
    'visakhapatnam', 'others'
  ],
  'us': [
    'atlanta',    'boston',
    'chicago',    'dallas',
    'houston',    'los angeles',
    'miami',      'minneapolis',
    'new york',   'philadelphia',
    'phoenix',    'san francisco',
    'san jose',   'seattle',
    'washington', 'worcester',
    'others'
  ]
}

const themeKey = 'conmecto:theme';

const preferencesList = [
  'vegan enthusiast',       'coffee lover',
  'beach bum',              'fitness fanatic',
  'fashionista',            'bookworm',
  'world traveler',         'yoga practitioner',
  'music junkie',           'adventure seeker',
  'foodie explorer',        'minimalist style',
  'pilates lover',          'hiking addict',
  'vintage fashion',        'animal lover',
  'wine aficionado',        'tech geek',
  'organic eater',          'mountain climber',
  'art collector',          'wellness guru',
  'street foodie',          'digital nomad',
  'urban explorer',         'craft beer lover',
  'sourdough baker',        'salsa dancer',
  'meditation enthusiast',  'retro gamer',
  'surfing fan',            'skincare addict',
  'crossfit trainer',       'streetwear collector',
  'jazz aficionado',        'marathon runner',
  'diy crafter',            'night owl',
  'history buff',           'cycling enthusiast',
  'tea connoisseur',        'sustainable shopper',
  'film buff',              'hot springs fan',
  'tennis player',          'scenic photographer',
  'backpacking adventurer', 'cocktail mixologist',
  'urban gardener',         'snowboarder'
]

const traits = [
  'Kind & Helpful: Compassionate, supportive, considerate',
  'Dog Lover: Animal enthusiast, loyal, affectionate',
  'Business-Minded: Strategic, entrepreneurial, goal-oriented',
  'Studious: Diligent, focused, intellectual',
  'Creative: Imaginative, artistic, innovative',
  'Adventurous: Risk-taking, exploratory, spontaneous',
  'Organized: Structured, efficient, detail-oriented',
  'Empathetic: Understanding, compassionate, sensitive',
  'Confident: Self-assured, assertive, decisive',
  'Patient: Calm, tolerant, understanding',
  'Outgoing: Sociable, extroverted, friendly',
  'Reliable: Trustworthy, dependable, consistent',
  'Health-Conscious: Fitness-oriented, mindful, nutritious',
  'Curious: Inquisitive, eager to learn',
  'Generous: Giving, charitable, unselfish',
  'Disciplined: Self-controlled, focused, methodical',
  'Humble: Modest, unpretentious, down-to-earth',
  'Funny: Humorous, entertaining, light-hearted',
  'Artistic: Creative, expressive, imaginative',
  'Analytical: Logical, detail-oriented, critical thinker'
]

const lookingFor = [
  'Long-Term Relationship: Committed, future-oriented partnership',
  'Short-Term Dating: Casual, temporary, fun',
  'Friendship: Platonic, supportive, social connection',
  'Casual Hookups: No-strings-attached, spontaneous encounters',
  'Marriage: Serious, lifelong commitment',
  'Travel Companion: Shared adventures, exploration',
  'Intellectual Connection: Stimulating, deep conversations',
  'Emotional Support: Understanding, empathetic relationship',
  'Family-Oriented: Desire for children, family life',
  'Mutual Growth: Personal development, shared goals',
  'Physical Attraction: Strong, mutual interest in appearance',
  'Cultural Exchange: Learning about different cultures',
  'Activity Partner: Shared hobbies and interests',
  'Romantic Connection: Love, affection, and romance',
  'Professional Networking: Career-related connections and opportunities',
  'Creative Collaboration: Working on projects together',
  'Supportive Partnership: Encouragement and mutual support',
  'Shared Values: Common beliefs and principles',
  'Spiritual Connection: Shared spiritual or religious practices',
  'Health and Fitness: Joint focus on wellness and exercise'
]

export { 
  SEARCH_FOR, profilePictureOptions, postOptions, maxFileSizeBytes, allowedFileTypes, allowedImageTypes,
  maxImageSizeBytes, Days, initialLogoScreenTimeMilli, GENDER, polaroidTags, colors, GEOLOCATION_TIMEOUT_MILLIS, 
  GEOLOCATION_MAX_AGE_MILLIS, Cities, themeKey, preferencesList, traits,
  lookingFor
};
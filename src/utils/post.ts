import { colors } from '../utils/constants';

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};

type UserPost = {
    id: number,
    userId: number,
    location: string,
    type: string,
    createdAt: string,
    profilePicture?: string,
    name: string,
    caption: string,
    match: boolean,
    reported?: boolean,
    reactCount: number,
    reacted: boolean,
    tags: string,
    tagsArray?: string[], 
    tagsColor?: string[]
}

type PostsType = {
    [id: number]: UserPost
}

let posts: PostsType = {};

const getPost = (postId: number) => {
  return posts[postId];
}

const setPost = (postId: number, post: UserPost) => {
    posts[postId] = post;
}

const setBulkPost = (bulkPosts: UserPost[]) => {
    for(const post of bulkPosts) {
        posts[post.id] = post;
        if (post.tags?.length) {
            const tags = post.tags?.split(',') || [];
            posts[post.id].tagsArray = tags;
            posts[post.id].tagsColor = tags.map(t => randomColor());
        } else {
            posts[post.id].tagsArray = [];
            posts[post.id].tagsColor = [];
        }
    }
}

const resetPosts = () => {
    posts = {};
}

export { getPost, setPost, setBulkPost, resetPosts }
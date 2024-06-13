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
    reacted: boolean
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
    }
}

export { getPost, setPost, setBulkPost }
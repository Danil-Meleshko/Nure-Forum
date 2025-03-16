import React, { useContext, useState } from "react";
import { Post, PostAddDto, PostEditDto } from "../Models/Posts/PostsInterfaces";
import {useAuthContext} from "./AuthProvider";
import {toast} from "react-toastify";

export interface PostProviderInterface {
    posts: Post[],
    post: Post,
    postsOfTheUser: Post[],
    setPost: React.Dispatch<React.SetStateAction<Post>>,
    setPostsOfTheUser: React.Dispatch<React.SetStateAction<Post[]>>,
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    allPostsOfTheUser: (filters?: Filters) => void,
    addPost: (post: PostAddDto) => void,
    editPost: (postId: string, post: PostEditDto) => void,
    deletePost: (postId: string) => void,
    getPost: (postId: string) => void,
    getPosts: (filters?: Filters) => void,
    toggleLike: (postId: string) => void,
    isLiked: (postId: string) => void,
    isPostLiked: boolean,
    setIsPostLiked: React.Dispatch<React.SetStateAction<boolean>>,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    totalPages: number,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>
}

interface Filters {
    title: string,
    authorEmail: string,
    createdAt: Date,
    authorRole: string
}

const PostsContext = React.createContext<PostProviderInterface | undefined>(undefined);

export function usePostContext(){
    const postContext =  useContext(PostsContext);

    if(postContext === undefined){
        throw new Error("usePostContext must be used with a PostsProvider");
    }

    return postContext;
}

export function PostsProvider({ children }: { children: React.ReactNode }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [post, setPost] = useState<Post>({
        id: "",
        title: "",
        text: "",
        createdAt: new Date(),
        authorId: "",
        authorEmail: "",
        authorImage: "",
        authorRole: "",
        likes: 0,
        amountOfComments: 0,
        isEdited: false,
        withComments: true,
        groupVisibility: []
    });
    const [postsOfTheUser, setPostsOfTheUser] = useState<Post[]>([]);
    const {axiosInstance} = useAuthContext();
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState<number>(1);
    const [isPostLiked, setIsPostLiked] = useState<boolean>(false);

    async function getPosts(filters?: Filters) {
        // Get posts from API
        try {
            filters = filters || {title: "", authorEmail: "", createdAt: new Date(), authorRole: ""};
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...(filters.title && {title: filters.title}),
                ...(filters.authorEmail && {authorEmail: filters.authorEmail}),
                ...(filters.createdAt && {dateOfCreation: filters.createdAt.toISOString()}),
                ...(filters.authorRole && {authorRole: filters.authorRole})
            });

            const response = await axiosInstance.get(`/Posts/GetAllPosts?${queryParams}`,
                // { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setPosts(response.data.posts);
            setTotalPages(response.data.totalPages);
        } catch (error: any) {
            console.error("Faild to get posts", error);
        }
    }

    async function getPost(postId: string) {
        // Get post from API
        try {
            const response = await axiosInstance.get(`/Posts/GetPost/${postId}`);

            setPost(response.data);
        } catch (error) {
            console.error("Faild to get post", error);
        }
    }

    async function addPost(post: PostAddDto) {
        // Add post to API
        try {
            const response = await axiosInstance.post(`/Posts/AddPost`, post);

            setPosts(prevPosts => [...prevPosts, response.data]);
            toast.success("Posts added successfully.");

        } catch (error) {
            toast.error("Fail to add post");
            console.error("Failed to add post", error);
        }
    }

    async function editPost(postId: string, updatedPost: PostEditDto) {
        // Edit post in API
        try {
            const response = await axiosInstance.put(`/Posts/EditPost/${postId}`, updatedPost);

            setPosts(posts.map(p => p.id === postId ? response.data : p));
            toast.success("Posts edited successfully.");

        } catch (error) {
            toast.error("Fail to edit post");
            console.error("Failed to edit post", error);
        }
    }

    async function deletePost(postId: string) {
        try {
            await axiosInstance.delete(`/Posts/DeletePost/${postId}`);

            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
            setPostsOfTheUser(prevPosts => prevPosts.filter(p => p.id !== postId));
            toast.success("Posts deleted successfully.");
        } catch (error) {
            toast.error("Fail to delete post");
            console.error("Failed to delete post", error);
        }
    }

    async function allPostsOfTheUser(filters?: Filters) {
        try {
            filters = filters || {title: "", authorEmail: "", createdAt: new Date(), authorRole: ""};
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...(filters.title && {title: filters.title}),
                ...(filters.createdAt && {dateOfCreation: filters.createdAt.toISOString()}),
            });

            const response = await axiosInstance.get(`/Posts/GetAllPostsOfTheUser?${queryParams}`);

            setPostsOfTheUser(response.data.posts);
            setTotalPages(response.data.totalPages);
        } catch (error: any) {
            console.error("Faild to get posts", error);
        }
    }

    async function toggleLike(postId: string) {
        try {
            const response = await axiosInstance.put(`/Posts/ToggleLike/${postId}/Like`, null);

            setPosts(prevPosts => prevPosts.map(p => p.id === postId ? response.data : p));
            setPost(response.data);
        } catch (error) {
            console.error("Failed to toggle post", error);
        }
    }

    async function isLiked(postId: string) {
        try {
            const response = await axiosInstance.get(`/Features/IsLiked/${postId}`);

            setIsPostLiked(response.data);
        } catch (error) {
            console.error("Failed to get like info", error);
        }
    }

    return (
        <PostsContext.Provider value={{
            addPost, editPost, deletePost, allPostsOfTheUser, isLiked, isPostLiked, setIsPostLiked,
            post, posts, toggleLike, getPost, getPosts, setPost, setPosts,
            postsOfTheUser, setPostsOfTheUser, page, setPage, totalPages, setTotalPages
        }}>
            {children}
        </PostsContext.Provider>
    )
}
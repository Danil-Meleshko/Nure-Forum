import React, {ReactNode, useContext, useState} from "react";
import {CommentAddDto, Comment} from "../Models/Comments/CommentsInterfaces";
import {useAuthContext} from "./AuthProvider";

interface ICommentContext {
    comments: Comment[],
    comment: Comment | null,
    setComment: React.Dispatch<React.SetStateAction<Comment | null>>,
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
    addComment: (comment: CommentAddDto, userId: string) => void,
    editComment: (commentId: string, comment: string) => void,
    deleteComment: (commentId: string) => void,
    getComment: (commentId: string) => void,
    getComments: (postId: string) => void,
    toggleLike: (commentId: string) => void
}

const CommentsContext = React.createContext<ICommentContext | undefined>(undefined);

export function useCommentsContext(){
    const commentsContext = useContext(CommentsContext);

    if(commentsContext === undefined) throw new Error("Need to use with CommentsProvider");

    return commentsContext;
}

export default function CommentsProvider({children}: { children: ReactNode }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [comment, setComment] = useState<Comment | null>(null);
    const { axiosInstance } = useAuthContext();

    async function getComments(postId: string) {
        try {
            let response = await axiosInstance.get(`/Comments/GetComments/${postId}`,
            );
            
            setComments(response.data);
        } catch (error) {
            console.error("Failed to get comments from Api", error);
        }
    }

    async function getComment(commentId: string) {
        try {
            let response = await axiosInstance.get(`/Comment/GetComments/${commentId}`);
            setComment(response.data);
        } catch (error) {
            console.error("Failed to get comments from Api", error);
        }
    }

    async function addComment(comment: CommentAddDto, postId: string) {
        try {
            let response = await axiosInstance.post(`/Comments/AddComment/${postId}`, comment);

            const newComment = response.data;

            setComments(prevComments => {
                if (newComment.replyTo) {
                    return prevComments.map(c =>
                        c.id === newComment.replyTo
                            ? { ...c, repliesToComment: [...c.repliesToComment, newComment] }
                            : c
                    );
                } else {
                    return [...prevComments, newComment];
                }
            });
        } catch (error) {
            console.error("Failed to add new comment", error);
        }
    }

    async function editComment(commentId: string, comment: string) {
        try{
            const text = {
                comment: comment,
            }
            
            let response = await axiosInstance.put(`/Comments/EditComment/${commentId}`, text);
            
            const editedComment = response.data;

            setComments(prevComments =>{
                if(editedComment.replyTo){
                    return prevComments.map(c =>
                        c.id === editedComment.replyTo
                            ? { ...c, repliesToComment: c.repliesToComment.map(r => 
                                    r.id === editedComment.id ? {...r, text: editedComment.text} : r) }
                            : c
                    );
                } else {
                    return prevComments.map(c => c.id === editedComment.id ? {...c, text: editedComment.text} : c);
                }
            });
        }
        catch (e) {
            console.error("Failed to edit post", e);
        }
    }

    async  function deleteComment (commentId: string){
        try {
            await axiosInstance.delete(`/Comments/DeleteComment/${commentId}`);

            setComments(comments.filter(c => c.id !== commentId));
        }
        catch (e) {
            console.error("Failed to delete comment", e);
        }
    }
    
    async function toggleLike(commentId: string){
        try {
            let response = await axiosInstance.put(`/Comments/ToggleLike/${commentId}/Like`, null);
            
            setComments(prev => prev.map(c => c.id === commentId ? {...c, likes: response.data.likes} : c));
        }
        catch (e) {
            console.error("Failed to toggle like", e);
        }
    }

    return (
        <CommentsContext.Provider value={ {addComment, editComment, deleteComment, comment, comments,
                                      getComment, toggleLike, getComments, setComment, setComments} } >
            {children}
        </CommentsContext.Provider>
    )
}
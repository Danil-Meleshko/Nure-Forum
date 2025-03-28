import React, {useEffect, useRef, useState} from "react";
import CommentBox from "./CommentBox";
import {useCommentsContext} from "../../lib/CommentsProvider";
import {CommentAddDto} from "../../Models/Comments/CommentsInterfaces";
import {v4 as uuid} from "uuid";
import {useCurrPostContext} from "../ForumPage/PostPageBody";
import {useAuthContext} from "../../lib/AuthProvider";


export default function PostCommentsContainer({postId}: {postId: string}) {
    const {getComments, comments, addComment} = useCommentsContext();
    const {user, role} = useAuthContext();
    const [newComment, setNewComment] = useState<string>("");
    const commentInputRef = useRef<any>();
    const commentOnFocusButtonsRef = useRef<any>();
    const {post, setPost} = useCurrPostContext();

    useEffect(() => {
        getComments(postId);
    }, []);
    
    const commentInputOnFocus = (e: any) => {
        setNewComment(e.target.value)
        commentInputRef.current.style.height = 'auto';
        commentInputRef.current.style.height = `${commentInputRef.current.scrollHeight}px`;
    }
    
    const addNewComment = (e: any) =>{
        e.preventDefault();
        if(e.key === "Enter" && !e.shiftKey) {
            if(newComment.trim() === '') return;
            
            const comment: CommentAddDto = {
                id: uuid(),
                text: newComment,
                authorId: user.id,
                postId: postId,
            }

            addComment(comment, postId);
            post.amountOfComments = post.amountOfComments + 1;
            setPost(post);
            
            setNewComment("");
            commentInputRef.current.style.maxHeight = '59px'
        }
    }
    
    return (
        <>
            <div style={{width: '100%', paddingRight: '24px', paddingLeft: '24px', paddingTop: '24px'}} className="AnnouncementsAndPosts-UpperBlock">
                <div style={{paddingTop: '0'}}></div>
                <h1 style={{fontSize: '18px', fontWeight: '600'}} className="AnnouncementsAndPosts-H1">Коментарі</h1>
                <div style={{paddingTop: '0'}}></div>
            </div>
            {(role === "Admin" || role === "Teacher" || role === "Student") && (
                <div className="CommentInputWrapper">
                <textarea value={newComment}
                          onKeyUp={(e) => addNewComment(e)}
                          onChange={e => commentInputOnFocus(e)}
                          ref={commentInputRef} className="AddCommentInput" rows={1}
                          placeholder='Enter text'
                          onFocus={() => {
                              commentOnFocusButtonsRef.current.style.display = 'flex';
                          }}></textarea>
                    <div ref={commentOnFocusButtonsRef} className="OnFocusCommentInputButtons"
                         style={{display: 'none'}}>
                        <button onClick={() => {
                            setNewComment("");
                            commentOnFocusButtonsRef.current.style.display = 'none';
                        }} className="CommentInputCancel">Відмінити
                        </button>
                        <button onClick={(e) => {
                            e.preventDefault();
                            if (newComment.trim() === '') return;
                            const comment: CommentAddDto = {
                                id: uuid(),
                                text: newComment,
                                authorId: user.id,
                                postId: postId,
                                replyTo: ""
                            }
                            addComment(comment, postId);
                            post.amountOfComments = post.amountOfComments + 1;
                            setPost(post);

                            setNewComment("");
                            commentInputRef.current.style.maxHeight = '59px'
                        }} className="CommentInputSubmit">Додати
                        </button>
                    </div>
                </div>
            )}

            <div className="CommentsBody" style={comments.length < 1 ? {display: 'none'} : {}}>
                {comments.map((comment) => (
                    comment.replyTo === null &&
                    (
                        <div style={{display: "flex", flexDirection: "column", gap: "12px"}} key={comment.id}>
                            <CommentBox postId={postId} comment={comment}/>
                        </div>
                    )
                ))}
            </div>
        </>
    )
}
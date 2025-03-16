import {Comment, CommentAddDto} from "../../Models/Comments/CommentsInterfaces";
import React, {useEffect, useRef, useState} from "react";
import {useCommentsContext} from "../../lib/CommentsProvider";
import {useCurrPostContext} from "../ForumPage/PostPageBody";
import {v4 as uuid} from "uuid";
import {useAuthContext} from "../../lib/AuthProvider";
import {dateFormat} from "../../Models/DateTimeFormat";
import ReplytoTheCommentBox from "./ReplytoTheCommentBox";

export default function CommentBox({postId, comment}: { postId: string, comment: Comment }) {
    const {deleteComment, editComment, toggleLike, addComment} = useCommentsContext();
    const {axiosInstance, token, user, role} = useAuthContext();
    const {setPost} = useCurrPostContext();

    const [editCommentText, setEditCommentText] = useState<string>(comment.text);
    const [editPressed, setEditPressed] = useState<boolean>(false);
    const [numberOfLikes, setNumberOfLikes] = useState<number>(comment.likes);
    const [isCommentLiked, setIsCommentLiked] = useState(false);
    const [replyText, setReplyText] = useState<string>("");
    const [isReplyPressed, setIsReplyPressed] = useState(false);
    const [repliesOpened, setRepliesOpened] = useState<boolean>(false);
    
    const commentInputRef = useRef<any>();
    const commentTextRef = useRef<any>();
    const replyInputRef = useRef<any>();

    useEffect(() => {
        isLiked(comment.id)
    }, []);

    async function isLiked(commentId: string) {
        try {
            const response = await axiosInstance.get(`/Features/IsLiked/${commentId}`,
                {headers: {'Authorization': `Bearer ${token}`}});

            setIsCommentLiked(response.data);
        } catch (error) {
            console.error("Failed to get like info", error);
        }
    }

    const handleDeleteComment = (e: any) => {
        e.preventDefault();
        
        const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
        if (isConfirmed) deleteComment(comment.id);
        
        setPost(prev => ({...prev!, amountOfComments: prev!.amountOfComments - 1}));
    }

    const handleInputResize = (inputRef: React.RefObject<HTMLTextAreaElement>) => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    };

    const handleEditComment = (e: any) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (editCommentText.trim() === '') return;

            const editedText = editCommentText.trimEnd();

            try {
                editComment(comment.id, editedText);
                setEditPressed(false);
            } catch (error) {
                console.error("Failed to edit comment", error);
            }
        }
    }

    const handleReplySubmit = (e: any) =>{
        if(e.key === "Enter") {
            if (replyText.trim() === '') return;
            
            const newReply: CommentAddDto = {
                id: uuid(),
                text: replyText,
                authorId: user.id,
                postId: postId,
                replyTo: comment.id
            }

            addComment(newReply, postId);
            setPost(prev => ({...prev!, amountOfComments: prev!.amountOfComments + 1}));
            setReplyText("");
            setIsReplyPressed(!isReplyPressed);
        }
    }

    const handleToggleEdit = () => {
        commentInputRef.current.focus();
        setEditPressed(prev => !prev);
    };

    const handleLike = () => {
        setIsCommentLiked(!isCommentLiked);
        toggleLike(comment.id);
        setNumberOfLikes(prev => isCommentLiked ? prev - 1 : prev + 1);
    };

    return (
        <>
            <div className="CommentBox-wrapper">
                <div className="AnnounHeader">
                    <div className="AnnounHeaderAuthor">
                        <div className="AnnounAuthorEmail">
                            <p>{comment.authorEmail}</p>
                        </div>
                        <div className="AnnounAuthorRole">
                            <p>{comment.authorRole}</p>
                        </div>
                    </div>
                    <div className="CommentBox-HeaderRightSide">
                        <div>{dateFormat.format(new Date(comment.createdAt))}</div>
                        {(role === "Admin" || role === "Teacher" || role === "Student") && (
                            <div>
                                <button className="OwnPostDeleteButton"
                                        onClick={() => setIsReplyPressed(!isReplyPressed)}>
                                    Відповісти
                                    <img src="/images/IconEdit.png" alt="Edit"/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="AnnounTextBody">
                    <div className="AnnounContent" style={{overflow: 'visible', maxHeight: 'none'}}>
                        <textarea
                            value={editCommentText}
                            rows={1}
                            onChange={(e) => {
                                setEditCommentText(e.target.value);
                                handleInputResize(commentInputRef);
                            }}
                            onKeyDown={handleEditComment}
                            onFocus={() => {
                                handleInputResize(commentInputRef);
                            }}
                            ref={commentInputRef}
                            placeholder='Edit your comment...'
                            className="AddCommentInput"
                            style={editPressed ? {border: 'none', padding: '5px', margin: '0'} : {display: "none"}}
                        />
                        <p ref={commentTextRef}
                           style={editPressed ? {display: "none"} : {whiteSpace: 'pre-line', margin: '0'}}>
                            {comment.text}
                        </p>
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {user.id === comment.authorId && (
                        <div className="OwnAnnounPostFooter">
                            <div className="OwnPostAnnounButtons">
                                <button className="OwnPostDeleteButton" onClick={handleToggleEdit}>
                                    {editPressed ? "Скасувати" : "Редагувати"}
                                    <img src="/images/IconEdit.png" alt="Edit"/>
                                </button>
                                <button className="OwnPostDeleteButton" onClick={handleDeleteComment}>
                                    Видалити
                                    <img src="/images/IconDelete.png" alt="Delete"/>
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="AnnounFooter" style={{justifySelf: 'flex-end', width: '100%'}}>
                        <span style={{display: 'flex', alignItems: 'end'}}>{numberOfLikes}</span>
                        <button className={`LikeButton ${isCommentLiked ? 'liked' : ''}`} onClick={handleLike}>
                            <img style={{scale: '1.1'}} src="/images/LikeIcon.png" alt=""
                                 className={isCommentLiked ? 'liked-image' : 'default-image'}/>
                        </button>
                    </div>
                </div>
            </div>
            
            {isReplyPressed && (
                <div className="CommentInputWrapper" style={{marginTop: '10px'}}>
                    <textarea
                        value={replyText}
                        onKeyDown={handleReplySubmit}
                        onChange={(e) => setReplyText(e.target.value)}
                        ref={replyInputRef}
                        className="AddCommentInput"
                        rows={1}
                        placeholder='Write a reply...'
                    />
                </div>
            )}

            <button className="RepliesButton" onClick={() => setRepliesOpened(prev => !prev)}>
                відповіді ({comment.repliesToComment.length})
            </button>

            {repliesOpened && comment.repliesToComment.length > 0 && (
                <div style={{display: "flex", gap: "20px", flexDirection: "column"}}>
                    {comment.repliesToComment.map((reply) => (
                        <div style={{width: "100%"}} key={reply.id}>
                            <ReplytoTheCommentBox comment={reply}/>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
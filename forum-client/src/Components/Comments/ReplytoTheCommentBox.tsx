import {Comment} from "../../Models/Comments/CommentsInterfaces";
import React, {useEffect, useRef, useState} from "react";
import {useCommentsContext} from "../../lib/CommentsProvider";
import {useCurrPostContext} from "../ForumPage/PostPageBody";
import {useAuthContext} from "../../lib/AuthProvider";
import {dateFormat} from "../../Models/DateTimeFormat";

export default function ReplytoTheCommentBox({comment}: { comment: Comment }) {
    const {deleteComment, editComment, toggleLike} = useCommentsContext();
    const {axiosInstance, token, user} = useAuthContext();
    const {setPost} = useCurrPostContext();

    const [editCommentText, setEditCommentText] = useState<string>(comment.text);
    const [editPressed, setEditPressed] = useState<boolean>(false);
    const [numberOfLikes, setNumberOfLikes] = useState<number>(comment.likes);
    const [isCommentLiked, setIsCommentLiked] = useState(false);
    
    const commentInputRef = useRef<any>();
    const commentTextRef = useRef<any>();

    useEffect(() => {
        isLiked(comment.id)
    }, [])

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
        if(isConfirmed) deleteComment(comment.id);
        
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

    const handleLike = () => {
        setIsCommentLiked(!isCommentLiked);
        toggleLike(comment.id);
        setNumberOfLikes(prev => isCommentLiked ? prev - 1 : prev + 1);
    };

    const handleToggleEdit = () => {
        commentInputRef.current.focus();
        setEditPressed(prev => !prev);
    };

    return (
        <>
            <div className="ReplyBox-wrapper">
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
                                <button className="OwnPostDeleteButton AnnounAndPostBox-LinkAnimation"
                                        onClick={() => handleToggleEdit()}
                                >
                                    Редагувати
                                    <img src="/images/IconEdit.png" alt="Edit"/>
                                </button>
                                <button className="OwnPostDeleteButton AnnounAndPostBox-LinkAnimation"
                                        onClick={event => {
                                            handleDeleteComment(event)
                                        }}>Видалити
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
        </>
    )
}
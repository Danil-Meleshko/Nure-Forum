import React from "react";
import {usePostContext} from "../../lib/PostsProvider";
import {useCurrPostContext} from "./PostPageBody";
import {dateFormat} from "../../Models/DateTimeFormat";


export default function PostPageSectionContext() {
    const {toggleLike, isPostLiked, setIsPostLiked} = usePostContext();
    const {post, setPost} = useCurrPostContext();
    
    const handleLike = () => {
        setIsPostLiked(isPostLiked);
        toggleLike(post.id);
        
        setPost(prev => ({...prev, likes: isPostLiked ? post.likes - 1 : post.likes + 1}));
    };
    
    return (
        <div className="AnnounBody">
            <div className="AnnounHeader">
                <div className="AnnounHeaderAuthor">
                    <div className="AnnounAuthorEmail">
                        <p>{post.authorEmail}</p>
                    </div>
                    <div className="AnnounAuthorRole">
                        <p id="AnnounAuthorRole">{post.authorRole}</p>
                    </div>
                </div>
                <div className="AnnounHeaderCommLikes">
                    <div>{dateFormat.format(new Date(post.createdAt))}</div>
                    <div>
                        <div><img alt="" src="/images/LikeIcon.png"/>{post.likes}</div>
                        <div><img alt="" src="/images/CommentIcon.png"/>{post.amountOfComments}</div>
                    </div>
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="2" viewBox="0 0 1000 2" fill="none">
                <path d="M0 1H1000" stroke="#1DD6F3" strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="6 6"/>
            </svg>
            <div className="AnnounTextBody">
                <div style={{overflow: 'visible', maxHeight: 'none'}} className="AnnounContent">
                    <p style={{margin: '0'}}>{post.text}</p>
                </div>
            </div>
            <div className="AnnounFooter">
                <button className={`LikeButton ${isPostLiked ? 'liked' : ''}`} onClick={handleLike}>
                    <img style={{scale: '1.3'}} src="/images/LikeIcon.png" alt="" className={isPostLiked ? 'liked-image' : 'default-image'}/>
                </button>
            </div>
        </div>
    )
}
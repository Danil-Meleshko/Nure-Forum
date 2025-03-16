import {Link} from "react-router-dom";
import React from "react";
import {usePostContext} from "../../lib/PostsProvider";
import {Post} from "../../Models/Posts/PostsInterfaces";
import {dateFormat} from "../../Models/DateTimeFormat";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PostBoxEdit({post}: {post: Post}) {
    const {deletePost} = usePostContext();

    function HandleDelete(postId: string){
        try {
            const isConfirmed = window.confirm("Are you sure you want to delete this post?");
            if (isConfirmed) deletePost(postId);
        }
        catch(err){
            console.error("Failed to delete your post", err);
        }
    }
    
    return(
        <>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="860" height="2" viewBox="0 0 860 2"
                     fill="none">
                    <path d="M0 1H860" stroke="#1DD6F3" strokeLinecap="round" strokeLinejoin="round"
                          strokeDasharray="6 6"/>
                </svg>
                <div className="AnnounTextBody">
                    <h4>{post.title}</h4>
                    <div className="AnnounContent">
                        <p>{post.text}</p>
                    </div>
                </div>
                <div className="OwnAnnounPostFooter">
                    <div className="OwnPostAnnounButtons">
                        <Link className="OwnPostEditLink AnnounAndPostBox-LinkAnimation"
                            to={`/OwnPosts/EditPost/${post.id}`} 
                              state={{post: post}}>Редагувати
                            <img src="/images/IconEdit.png" alt="Edit"/>
                        </Link>
                        <button className="OwnPostDeleteButton AnnounAndPostBox-LinkAnimation"
                                onClick={() => {
                                    HandleDelete(post.id)
                                }}>Видалити
                            <img src="/images/IconDelete.png" alt="Delete"/>
                        </button>
                    </div>
                    <Link className="AnnounAndPostBox-LinkAnimation" to={`/Forum/Post/${post.id}`}
                        state={{post: post}}>Детальніше...</Link>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}
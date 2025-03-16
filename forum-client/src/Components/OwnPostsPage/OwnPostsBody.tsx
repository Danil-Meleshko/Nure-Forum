import React, {useEffect} from "react";
import {usePostContext} from "../../lib/PostsProvider";
import PostsFilters from "../ForumPage/PostsFilters";
import {Link} from "react-router-dom";
import PostBoxEdit from "./PostBoxEdit";


export default function OwnPostsBody(){
    const {allPostsOfTheUser, postsOfTheUser, page, setPage, totalPages} = usePostContext();
    
    useEffect(() => {
        allPostsOfTheUser();
    }, [page]);
    
    return (
        <React.Fragment>
            <div className="AnnouncementsAndPostsBody">
                <div className="AnnouncementsAndPosts-UpperBlock">
                    <div></div>
                    <h1 className="AnnouncementsAndPosts-H1">Власні пости</h1>
                    <div></div>
                </div>
                <div className="AnnouncementsAndPosts-Container">
                    <div className="AnnounsAndPosts">
                        {postsOfTheUser.map(post => (
                            <div key={post.id}>
                                <PostBoxEdit post={post}/>
                            </div>
                        ))}
                        <div className="PagesButtonsWrapper">
                            <button className="NextAndBackPage-Button BigButtonHoverAnimation" onClick={() => {
                                if (page !== 1) setPage(prev => prev - 1)
                            }}>Back
                            </button>
                            <span>{page} з {totalPages}</span>
                            <button className="NextAndBackPage-Button BigButtonHoverAnimation" onClick={() => {
                                if (page !== totalPages) setPage(prev => prev + 1)
                            }}>Next
                            </button>
                        </div>
                    </div>
                    <div className="AnnounsAndPostsFilterZone">
                        <div className="AnnounsAndPosts-Filters">
                            <PostsFilters ownPostsFilter={true}/>
                        </div>
                        <div className="AddPostOrAnnounButtonBox">
                            <h2 className="AddPostOrAnnounButtonH2">Додати новий пост</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" width="420" height="2" viewBox="0 0 420 2"
                                 fill="none">
                                <path d="M0 1H420" stroke="#1DD6F3" strokeLinecap="round" strokeLinejoin="round"
                                      strokeDasharray="6 6"/>
                            </svg>
                            <Link to="/AddPost" className="AddPostOrAnnounButton BigButtonHoverAnimation">Зробити пост
                                <img src="/images/AddPostIcon.png" alt=""/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
import React from "react";
import {useCurrAnnounContext} from "./AnnouncementPageBody";
import {dateFormat} from "../../Models/DateTimeFormat";
import {useAnnouncementContext} from "../../lib/AnnouncementsProvider";


export default function AnnouncementPageSectionContext() {
    const {toggleLike, isAnnouncementLiked, setIsAnnouncementLiked} = useAnnouncementContext();
    const {announcement, setAnnouncement} = useCurrAnnounContext();
    
    const handleLike = () => {
        setIsAnnouncementLiked(!isAnnouncementLiked);
        toggleLike(announcement.id);

        setAnnouncement(prev => ({...prev!, likes: isAnnouncementLiked ? announcement.likes - 1 : announcement.likes + 1}));
    };

    return (
        <div className="AnnounBody">
            <div className="AnnounHeader">
                <div className="AnnounHeaderAuthor">
                    <div className="AnnounAuthorEmail">
                        <p>{announcement.authorEmail}</p>
                    </div>
                    <div className="AnnounAuthorRole">
                        <p id="AnnounAuthorRole">{announcement.authorRole}</p>
                    </div>
                </div>
                <div className="AnnounHeaderCommLikes">
                    <div>{dateFormat.format(new Date(announcement.createdAt))}</div>
                    <div>
                        <div><img alt="" src="/images/LikeIcon.png"/>{announcement.likes}</div>
                        <div><img alt="" src="/images/CommentIcon.png"/>{announcement.amountOfComments}</div>
                    </div>
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="2" viewBox="0 0 1000 2" fill="none">
                <path d="M0 1H1000" stroke="#1DD6F3" strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="6 6"/>
            </svg>
            <div className="AnnounTextBody">
                <div style={{overflow: 'visible', maxHeight: 'none'}} className="AnnounContent">
                    <p style={{margin: '0'}}>{announcement.text}</p>
                </div>
            </div>
            <div className="AnnounFooter">
                <button className={`LikeButton ${isAnnouncementLiked ? 'liked' : ''}`} onClick={handleLike}>
                    <img style={{scale: '1.3'}} src="/images/LikeIcon.png" alt="" className={isAnnouncementLiked ? 'liked-image' : 'default-image'}/>
                </button>
            </div>
        </div>
    )
}
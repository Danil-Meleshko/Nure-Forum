import React from "react";
import {Link} from "react-router-dom";
import {Post} from "../../Models/Posts/PostsInterfaces";
import {Announcement} from "../../Models/Announcements/AnnouncementsInterfaces";
import {dateFormat} from "../../Models/DateTimeFormat";

export default function AnnouncemenPostBox({announcement, type}: {announcement: Post | Announcement, type: string}) {
    
    return(
        <>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="860" height="2" viewBox="0 0 860 2"
                     fill="none">
                <path d="M0 1H860" stroke="#1DD6F3" strokeLinecap="round" strokeLinejoin="round"
                          strokeDasharray="6 6"/>
                </svg>
                <div className="AnnounTextBody">
                    <h4>{announcement.title}</h4>
                    <div className="AnnounContent">
                        <p>{announcement.text}</p>
                    </div>
                </div>
                <div className="AnnounFooter">
                    <Link className="AnnounAndPostBox-LinkAnimation" to= {type === "Post" ? `/Forum/Post/${announcement.id}` : `/Announcement/${announcement.id}`}
                          state={{post: announcement}}>Детальніше...</Link>
                </div>
            </div>
        </>
    )
}
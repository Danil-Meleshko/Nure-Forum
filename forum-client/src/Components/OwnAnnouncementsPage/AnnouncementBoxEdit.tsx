import {Link} from "react-router-dom";
import React from "react";
import {useAnnouncementContext} from "../../lib/AnnouncementsProvider";
import {Announcement} from "../../Models/Announcements/AnnouncementsInterfaces";
import {dateFormat} from "../../Models/DateTimeFormat";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AnnouncementBoxEdit({announcement}: {announcement: Announcement}) {
    const {deleteAnnouncement} = useAnnouncementContext();

    function HandleDelete(announId: string){
        try {
            const isConfirmed= window.confirm("Are you sure you want to delete this post?");
            if(isConfirmed) deleteAnnouncement(announId);
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
                <div className="OwnAnnounPostFooter">
                    <div className="OwnPostAnnounButtons">
                        <Link className="OwnPostEditLink AnnounAndPostBox-LinkAnimation"
                              to={`/Announcements/EditAnnouncement/${announcement.id}`}
                              state={{announcement: announcement}}>Редагувати
                            <img src="/images/IconEdit.png" alt="Edit"/>
                        </Link>
                        <button className="OwnPostDeleteButton AnnounAndPostBox-LinkAnimation"
                                onClick={() => {
                                    HandleDelete(announcement.id)
                                }}>Видалити
                            <img src="/images/IconDelete.png" alt="Delete"/>
                        </button>
                    </div>
                    <Link className="AnnounAndPostBox-LinkAnimation" to={`/Announcement/${announcement.id}`} state={{post: announcement}}>Детальніше...</Link>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}
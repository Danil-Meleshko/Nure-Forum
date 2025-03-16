import React, {useEffect, useRef} from "react";
import {useAnnouncementContext} from "../../lib/AnnouncementsProvider";
import "../../Styles/AnnounsAndPosts.css";
import AnnouncementsFilters from "./AnnouncementsFilters";
import AnnouncemenPostBox from "./AnnouncemenPostBox";
import {Link} from "react-router-dom";
import {useAuthContext} from "../../lib/AuthProvider";
import ToggleButtonSquared_Announcements from "../Buttons/ToggleButtonSquared_Announcements";
import ChangeGroupButton from "../Buttons/ChangeGroupButton'";

export default function AnnouncementsBody() {
    const {getAnnouncements, announcements, setPage, page, totalPages} = useAnnouncementContext();
    const announAddRef = useRef<any>();
    const { role } = useAuthContext();

    useEffect(() => {
        if(role === "Teacher" || role === "Admin"){
            announAddRef.current.style.display = "flex";
        }
        getAnnouncements();
    }, [page]);
    
    return (
        <div className="AnnouncementsAndPostsBody">
            <div className="AnnouncementsAndPosts-UpperBlock">
                <div></div>
                <h1 className="AnnouncementsAndPosts-H1">Оголошення</h1>
                <div></div>
            </div>
            <div className="AnnouncementsAndPosts-Container">
                <div className="AnnounsAndPosts">
                    {announcements.map(announcement => (
                        <div key={announcement.id}>
                            <AnnouncemenPostBox announcement={announcement} type={"Announcement"} />
                        </div>
                    ))}
                    <div className="PagesButtonsWrapper">
                        <button className="NextAndBackPage-Button BigButtonHoverAnimation" onClick={() => {
                            if(page !== 1) setPage(prev => prev - 1)
                        }}>Back</button>
                        <span>{page} з {totalPages}</span>
                        <button className="NextAndBackPage-Button BigButtonHoverAnimation" onClick={() => {
                            if(page !== totalPages) setPage(prev => prev + 1)
                        }}>Next</button>
                    </div>
                </div>
                <div className="AnnounsAndPostsFilterZone">
                    <div className="AnnounsAndPosts-Filters">
                        <AnnouncementsFilters ownAnnouns={false}/>
                    </div>
                    <div ref={announAddRef} className="AddPostOrAnnounButtonBox" style={{display: "none"}}>
                        <h2 className="AddPostOrAnnounButtonH2">Додати нове Оголошення</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="420" height="2" viewBox="0 0 420 2"
                             fill="none">
                            <path d="M0 1H420" stroke="#1DD6F3" strokeLinecap="round" strokeLinejoin="round"
                                  strokeDasharray="6 6"/>
                        </svg>
                        <Link to="/AddAnnouncement" className="AddPostOrAnnounButton BigButtonHoverAnimation">Зробити оголошення
                            <img src="/images/AddPostIcon.png" alt=""/>
                        </Link>
                        <Link to="/OwnAnnouncements" className="AddPostOrAnnounButton BigButtonHoverAnimation">Власні оголошення</Link>
                    </div>
                    <div className="ToggleButtonSquared_Announcements_laptop">
                        <ToggleButtonSquared_Announcements />
                    </div>
                    <ChangeGroupButton />
                </div>
                <div className="ToggleButtonSquared_Announcements_computer">
                    <ToggleButtonSquared_Announcements/>
                </div>
            </div>
        </div>
    )
}
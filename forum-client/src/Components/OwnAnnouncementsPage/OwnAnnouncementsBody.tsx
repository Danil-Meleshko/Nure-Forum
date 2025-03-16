import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {useAnnouncementContext} from "../../lib/AnnouncementsProvider";
import AnnouncementsFilters from "../AnnouncementsPage/AnnouncementsFilters";
import AnnouncementBoxEdit from "./AnnouncementBoxEdit";
import ToggleButtonSquared_Announcements from "../Buttons/ToggleButtonSquared_Announcements";


export default function OwnAnnouncementsBody() {
    const {allAnnouncementsOfTheUser, announcementsOfTheUser, page, setPage, totalPages} = useAnnouncementContext();

    useEffect(() => {
        allAnnouncementsOfTheUser();
    }, [page]);

    return (
        <React.Fragment>
            <div className="AnnouncementsAndPostsBody">
                <div className="AnnouncementsAndPosts-UpperBlock">
                    <div></div>
                    <h1 className="AnnouncementsAndPosts-H1">Власні оголошення</h1>
                    <div></div>
                </div>
                <div className="AnnouncementsAndPosts-Container">
                    <div className="AnnounsAndPosts">
                        {announcementsOfTheUser.map(announcement => (
                            <div key={announcement.id}>
                                <AnnouncementBoxEdit announcement={announcement}/>
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
                            <AnnouncementsFilters ownAnnouns={true}/>
                        </div>
                        <div className="AddPostOrAnnounButtonBox">
                            <h2 className="AddPostOrAnnounButtonH2">Додати нове оголошення</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" width="420" height="2" viewBox="0 0 420 2"
                                 fill="none">
                                <path d="M0 1H420" stroke="#1DD6F3" strokeLinecap="round" strokeLinejoin="round"
                                      strokeDasharray="6 6"/>
                            </svg>
                            <Link to="/AddPost" className="AddPostOrAnnounButton BigButtonHoverAnimation">Зробити
                                оголошення
                                <img src="/images/AddPostIcon.png" alt=""/>
                            </Link>
                        </div>
                        <div className="ToggleButtonSquared_Announcements_laptop">
                            <ToggleButtonSquared_Announcements />
                        </div>
                    </div>
                    <div className="ToggleButtonSquared_Announcements_computer">
                        <ToggleButtonSquared_Announcements />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
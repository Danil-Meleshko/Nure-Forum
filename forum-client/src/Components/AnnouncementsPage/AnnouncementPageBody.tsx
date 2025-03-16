import React, {createContext, useContext, useEffect} from "react";
import {Announcement} from "../../Models/Announcements/AnnouncementsInterfaces";
import {useAnnouncementContext} from "../../lib/AnnouncementsProvider";
import AnnouncementPageSectionContext from "./AnnouncementPageSectionContext";
import AnnouncementCommentsContainer from "../Comments/AnnouncementCommentsContainer";


type AnnouncementProvider = {
    announcement: Announcement;
    setAnnouncement:  React.Dispatch<React.SetStateAction<Announcement>>
}

const CurrAnnounContext = createContext<AnnouncementProvider | undefined>(undefined);

export const useCurrAnnounContext = () =>{
    const context = useContext(CurrAnnounContext);
    if (!context) {
        throw new Error("useCurrPostContext must be used within the context");
    }

    return context;
}

export default function AnnouncementPageBody({announcementId}: {announcementId: string}) {
    const {getAnnouncement, announcement, setAnnouncement, isLiked} = useAnnouncementContext();

    useEffect(() => {
        getAnnouncement(announcementId);
        isLiked(announcementId);
    }, []);

    return(
        <>
            <div className="AnnouncementsAndPostsBody">
                <div className="AnnouncementsAndPosts-UpperBlock">
                    <div></div>
                    <h1 className="AnnouncementsAndPosts-H1">{announcement.title}</h1>
                    <div></div>
                </div>
                <div className="PostAndAnnouncementDetails-Container">
                    <CurrAnnounContext.Provider value={{announcement, setAnnouncement: setAnnouncement}}>
                        <AnnouncementPageSectionContext/>
                        {announcement.withComments && (<AnnouncementCommentsContainer announcementId={announcementId}/>)}
                    </CurrAnnounContext.Provider>
                </div>
            </div>
        </>
    )
}
import React from "react";
import Navbar from "../../Components/Navbar";
import {useParams} from "react-router-dom";
import Footer from "../../Components/Footer";
import CommentsProvider from "../../lib/CommentsProvider";
import {AnnouncementsProvider} from "../../lib/AnnouncementsProvider";
import AnnouncementPageBody from "../../Components/AnnouncementsPage/AnnouncementPageBody";

export default function Announcement() {
    const {announcementId} = useParams<{ announcementId: string }>();

    return (
        <React.Fragment>
            <Navbar/>
            <AnnouncementsProvider>
                <CommentsProvider>
                    <AnnouncementPageBody announcementId={announcementId || ""}/>
                </CommentsProvider>
            </AnnouncementsProvider>
            <Footer/>
        </React.Fragment>
    )
}
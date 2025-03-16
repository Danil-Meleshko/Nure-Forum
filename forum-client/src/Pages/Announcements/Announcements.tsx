import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import {AnnouncementsProvider} from "../../lib/AnnouncementsProvider";
import AnnouncementsBody from "../../Components/AnnouncementsPage/AnnouncementsBody";

export default function Announcements(){
    return (
        <div>
            <Navbar/>
            <AnnouncementsProvider>
                <AnnouncementsBody/>
            </AnnouncementsProvider>
            <Footer/>
        </div>
    )
}
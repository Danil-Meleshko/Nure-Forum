import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import {AnnouncementsProvider} from "../../lib/AnnouncementsProvider";
import OwnAnnouncementsBody from "../../Components/OwnAnnouncementsPage/OwnAnnouncementsBody";

export default function OwnAnnouncements() {
    
    return (
        <>
            <Navbar/>
            <AnnouncementsProvider>
                <OwnAnnouncementsBody/>
            </AnnouncementsProvider>
            <Footer/>
        </>
    )
}
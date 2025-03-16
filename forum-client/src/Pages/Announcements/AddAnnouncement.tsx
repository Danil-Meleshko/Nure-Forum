import Navbar from "../../Components/Navbar";
import {AnnouncementsProvider} from "../../lib/AnnouncementsProvider";
import Footer from "../../Components/Footer";
import AddAnnouncementBody from "../../Components/OwnAnnouncementsPage/AddAnnouncementBody";

export default function AddAnnouncement() {
    return(
        <>
            <Navbar/>
            <AnnouncementsProvider>
                <AddAnnouncementBody/>
            </AnnouncementsProvider>
            <Footer/>
        </>
    )
}
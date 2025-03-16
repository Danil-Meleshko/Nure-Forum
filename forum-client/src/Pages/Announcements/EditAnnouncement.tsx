import {useParams} from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import EditAnnouncementBody from "../../Components/OwnAnnouncementsPage/EditAnnouncementBody";
import {AnnouncementsProvider} from "../../lib/AnnouncementsProvider";

export default function EditAnnouncement() {
    const {announId} = useParams<{ announId: string }>();
    
    return (
        <>
            <Navbar/>
            <AnnouncementsProvider>
                <div>
                    <EditAnnouncementBody announId={announId || ""} />
                </div>
            </AnnouncementsProvider>
            <Footer/>
        </>
    )
}
import {useEffect} from "react";
import {useAnnouncementContext} from "../../lib/AnnouncementsProvider";


export default function ToggleButtonSquared_Announcements() {
    const {isNotificationsActive, toggleNotifications, isNotificationsEnabled} = useAnnouncementContext();

    useEffect(() => {
        isNotificationsEnabled();
    }, []);
    
    const toggleButton = () => {
        toggleNotifications();
    }
    
    return (
        <div className="toggle-button-notificatons-announcements" style={{display: "flex", flexDirection: "column", gap: "8px"}}>
            <span style={{fontSize: "18px"}}>Отримувати сповіщення</span>
            <button
                style={{
                    width: "64px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isNotificationsActive ? "end" : "start",
                    border: "2px solid",
                    borderRadius: "6px",
                    transition: "all 0.3s ease",
                    backgroundColor: isNotificationsActive ? "#3B82F6" : "#D1D5DB",
                    borderColor: isNotificationsActive ? "#3B82F6" : "#D1D5DB",
                }}
                onClick={() => toggleButton()}
            >
                <div style={{
                    width: "24px",
                    height: "16px",
                    backgroundColor: "white",
                }}></div>
            </button>
        </div>
    );
}
import React, { useContext, useState} from "react";
import {Announcement, AnnouncementAddDto, AnnouncementEditDto} from "../Models/Announcements/AnnouncementsInterfaces";
import {useAuthContext} from "./AuthProvider";
import {toast} from "react-toastify";

export interface AnnouncementProviderInterface {
    announcements: Announcement[],
    announcement: Announcement,
    announcementsOfTheUser: Announcement[],
    setAnnouncement: React.Dispatch<React.SetStateAction<Announcement>>,
    setAnnouncementsOfTheUser: React.Dispatch<React.SetStateAction<Announcement[]>>,
    setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>,
    allAnnouncementsOfTheUser: (filters?: Filters) => void,
    addAnnouncement: (announcement: AnnouncementAddDto) => void,
    editAnnouncement: (announcementId: string, announcement: AnnouncementEditDto) => void,
    deleteAnnouncement: (announcementId: string) => void,
    getAnnouncement: (announcementId: string) => void,
    getAnnouncements: (filters?: Filters) => void,
    toggleLike: (announId: string) => void
    isLiked: (announId: string) => void,
    isNotificationsEnabled: () => void,
    toggleNotifications: () => void,
    isNotificationsActive: boolean,
    setIsNotificationsActive: React.Dispatch<React.SetStateAction<boolean>>,
    isAnnouncementLiked: boolean,
    setIsAnnouncementLiked: React.Dispatch<React.SetStateAction<boolean>>,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    totalPages: number,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>
}

interface Filters {
    title: string,
    authorEmail: string,
    createdAt: Date,
    authorRole: string
}

const AnnouncementsContext = React.createContext<AnnouncementProviderInterface | undefined>(undefined);

export function useAnnouncementContext(){
    const announcementContext =  useContext(AnnouncementsContext);

    if(announcementContext === undefined){
        throw new Error("useAnnouncementContext must be used with a AnnouncementsProvider");
    }
    
    return announcementContext;
}

export function AnnouncementsProvider({ children }: { children: React.ReactNode }) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [announcement, setAnnouncement] = useState<Announcement>({
        id: "",
        title: "",
        text: "",
        createdAt: new Date(),
        authorId: "",
        authorEmail: "",
        authorImage: "",
        authorRole: "",
        likes: 0,
        amountOfComments: 0,
        isEdited: false,
        withComments: true,
        groupVisibility: []
    });
    const [announcementsOfTheUser, setAnnouncementsOfTheUser] = useState<Announcement[]>([]);
    const [isAnnouncementLiked, setIsAnnouncementLiked] = useState<boolean>(false);
    const [isNotificationsActive, setIsNotificationsActive] = useState<boolean>(true);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState<number>(1);
    const { axiosInstance, token } = useAuthContext();

    async function getAnnouncements(filters?: Filters) {
        // Get announcements from API
        try {
            filters = filters || {title: "", authorEmail: "", createdAt: new Date(), authorRole: ""};
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...(filters.title && { title: filters.title }),
                ...(filters.authorEmail && { authorEmail: filters.authorEmail }),
                ...(filters.createdAt && { dateOfCreation: filters.createdAt.toISOString() }),
                ...(filters.authorRole && { authorRole: filters.authorRole })
            });
            
            let response = await axiosInstance.get(`/Announcements/GetAllAnnouncements?${queryParams}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setAnnouncements(response.data.announcements);
            setTotalPages(response.data.totalPages);
        }
        catch(error) {
            console.error("Faild to get announcements", error);
        }
    }

    async function getAnnouncement(announcementId: string){
        // Get announcement from API
        try {
            let response = await axiosInstance.get(`/Announcements/GetAnnouncement/${announcementId}`
            );

            setAnnouncement(response.data);
        }
        catch (error) {
            console.error("Faild to get announcement", error);
        }
    }

    async function addAnnouncement(announcement: AnnouncementAddDto) {
        // Add announcement to API
        try {
            let response = await axiosInstance.post(`/Announcements/AddAnnouncement`, announcement,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setAnnouncements(prevAnnouncements => [...prevAnnouncements, response.data]);
            toast.success("Announcement added successfully.");
        }
        catch(error) {
            toast.error("Fail to add announcement");
            console.error("Failed to add announcement", error);
        }
    }

    async function editAnnouncement(announcementId: string, updatedAnnouncement: AnnouncementEditDto) {
        // Edit announcement in API
        try {
            let response = await axiosInstance.put(`/Announcements/EditAnnouncement/${announcementId}`, updatedAnnouncement,
            );

            setAnnouncements(announcements.map(p => p.id === announcementId ? response.data : p));
            toast.success("Announcement edited successfully.");
        } catch (error) {
            toast.error("Fail to edit announcement");
            console.error("Failed to edit announcement", error);
        }
    }

    async function deleteAnnouncement(announcementId: string) {
        // Delete announcement from API
        try {
            await axiosInstance.delete(`/Announcements/DeleteAnnouncement/${announcementId}`,
                
            );

            setAnnouncements(prevAnnouncements => prevAnnouncements.filter(p => p.id !== announcementId));
            setAnnouncementsOfTheUser(prev => prev.filter(p => p.id !== announcementId));
            toast.success("Announcement deleted successfully.");
        }
        catch (error) {
            toast.error("Fail to delete announcement");
            console.error("Failed to delete announcement", error);
        }
    }

    async function allAnnouncementsOfTheUser(filters?: Filters) {
        try {
            filters = filters || {title: "", authorEmail: "", createdAt: new Date(), authorRole: ""};
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...(filters.title && { title: filters.title }),
                ...(filters.createdAt && { dateOfCreation: filters.createdAt.toISOString() }),
            });
            
            let response = await axiosInstance.get(`/Announcements/GetAllAnnouncementsOfTheUser?${queryParams}`, {
               
            });

            setAnnouncementsOfTheUser(response.data.announcements);
            setTotalPages(response.data.totalPages);
        }
        catch (e) {
            console.error("Failed to get your announcements", e);
        }
    }
    
    async function toggleLike(announId: string) {
        try {
            let response = await axiosInstance.put(`/Announcements/ToggleLike/${announId}/Like`, null,)
            
            setAnnouncements(prev => prev.map(a => a.id === announId ? response.data : a));
            setAnnouncement(response.data);
        }
        catch(error) {
            console.error("Failed to toggle like", error);
        }
    }

    async function isLiked(announId: string){
        try {
            const response = await axiosInstance.get(`/Features/IsLiked/${announId}`);

            setIsAnnouncementLiked(response.data);
        }
        catch (error) {
            console.error("Failed to get like info", error);
        }
    }
    
    async function isNotificationsEnabled(){
        try {
            const response = await axiosInstance.get(`/Features/IsAnnouncementsNotificationsEnabled`);

            setIsNotificationsActive(response.data);
        }
        catch (e) {
            console.error("Failed to get notifications enabled", e);
        }
    }
    
    async function toggleNotifications(){
        try {
            await axiosInstance.put(`/Features/ToggleAnnouncementNotifications`, null);

            setIsNotificationsActive(prev => !prev);
        }
        catch (error) {
            console.error("Failed to toggle notifications", error);
        }
    }

    return (
        <AnnouncementsContext.Provider value={ {addAnnouncement, editAnnouncement, deleteAnnouncement, allAnnouncementsOfTheUser,
                                   announcement, announcements, toggleLike, getAnnouncement, getAnnouncements, isLiked, 
                                    setAnnouncement, setAnnouncements, announcementsOfTheUser, page, setPage, totalPages, setTotalPages, 
                                    setAnnouncementsOfTheUser, isAnnouncementLiked, setIsAnnouncementLiked,
                                    isNotificationsActive, setIsNotificationsActive, toggleNotifications, isNotificationsEnabled,} } >
            {children}
        </AnnouncementsContext.Provider>
    )
}
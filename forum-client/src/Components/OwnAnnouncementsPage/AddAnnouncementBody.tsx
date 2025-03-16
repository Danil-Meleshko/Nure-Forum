import React, {useState} from "react";
import {v4 as uuid} from "uuid";
import {GroupVisibilityArray} from "../../Models/Posts/GroupVisibilityArray";
import {useAnnouncementContext} from "../../lib/AnnouncementsProvider";
import {AnnouncementAddDto} from "../../Models/Announcements/AnnouncementsInterfaces";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useAuthContext} from "../../lib/AuthProvider";

export default function AddAnnouncementBody(){
    const announcementController = useAnnouncementContext();
    const {user} = useAuthContext();
    const [announcement, setAnnouncement] = useState<AnnouncementAddDto>({
        id: uuid(),
        title: "",
        text: "",
        authorId: user.id,
        withComments: true,
        groupVisibility: ["*", ...GroupVisibilityArray.map(g => g.group)]
    });


    const handleWithComments = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if(e.target.value === "З коментарями"){
            setAnnouncement((prevPost) => ({
                ...prevPost,
                withComments: true
            }));
        }
        else{
            setAnnouncement((prevPost) => ({
                ...prevPost,
                withComments: false
            }));
        }
    }

    const handleCheckboxChange = (group: string) => {
        setAnnouncement((prevPost) => {
            let newGroupVisibility = [...prevPost.groupVisibility];

            if (group === '*') {
                if (prevPost.groupVisibility.includes('*')) {
                    newGroupVisibility = ['None'];
                } else {
                    newGroupVisibility = ['*', ...GroupVisibilityArray.map((g) => g.group)];
                }
            } else {
                if (newGroupVisibility.includes(group)) {
                    newGroupVisibility = newGroupVisibility.filter((g) => g !== group);
                    newGroupVisibility = newGroupVisibility.filter((g) => g !== '*');
                } else {
                    newGroupVisibility.push(group);
                    // Add '*' if all groups are now selected
                    const allGroupsSelected = GroupVisibilityArray.every((g) =>
                        newGroupVisibility.includes(g.group)
                    );
                    if (allGroupsSelected) {
                        newGroupVisibility.push('*');
                    }
                }
            }

            return {
                ...prevPost,
                groupVisibility: newGroupVisibility,
            }
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        announcement.id = uuid();
        announcementController.addAnnouncement(announcement);
        setAnnouncement({
            id: uuid(),
            title: "",
            text: "",
            authorId: user.id,
            withComments: true,
            groupVisibility: ["*", ...GroupVisibilityArray.map(g => g.group)]
        });
    }

    return (
        <React.Fragment>
            <div className="AddPost-container">
                <div className="AnnouncementsAndPosts-UpperBlock">
                    <div></div>
                    <h1 className="AnnouncementsAndPosts-H1">Додати оголошення</h1>
                    <div></div>
                </div>
                <form className="AddPost-form" onSubmit={handleSubmit}>
                    <div className="AddPost-box">
                        <label className="AddPost-Label" htmlFor="title">Заголовок</label>
                        <input
                            className="AddPost-title"
                            id="title"
                            type="text"
                            placeholder="Ваш заголовок"
                            value={announcement.title}
                            onChange={(e) =>
                                setAnnouncement((prevPost) => ({...prevPost, title: e.target.value}))
                            }
                        />
                    </div>

                    <div className="AddPost-box">
                        <label className="AddPost-Label" htmlFor="text">Опис</label>
                        <textarea
                            className="AddPost-text"
                            id="text"
                            placeholder="Ваш заголовок"
                            value={announcement.text}
                            onChange={(e) =>
                                setAnnouncement((prev) => ({...prev, text: e.target.value}))
                            }
                        ></textarea>
                    </div>

                    <div className="AddPost-box">
                        <label className="AddPost-Label" htmlFor="withComments">Коментарі</label>
                        <select onChange={(e) => handleWithComments(e)} id="withComments"
                                className="AddPost-withComments">
                            <option value="З коментарями">З коментарями</option>
                            <option value="Без коментарів">Без коментарів</option>
                        </select>
                    </div>

                    <div className="AddPost-box">
                        <p className="AddPost-Label">Групи які будуть бачити пост</p>
                        <div className="AddPost-Check-box-all">
                            <input
                                className="AddPost-Check-box"
                                id="all-groups"
                                type="checkbox"
                                checked={announcement.groupVisibility.includes('*')}
                                onChange={() => handleCheckboxChange('*')}
                            />
                            <label htmlFor="all-groups">Всі</label>
                        </div>
                        <div className="Options">

                            {GroupVisibilityArray.map(group => (
                                <div key={uuid()}>
                                    <input
                                        className="AddPost-Check-box"
                                        id={group.id}
                                        type="checkbox"
                                        checked={announcement.groupVisibility.includes(group.group)}
                                        onChange={() => handleCheckboxChange(group.group)}
                                    />
                                    <label htmlFor={group.id}>{group.group}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="AddPost-Create-Button AnnounAndPostBox-LinkAnimation" type="submit">Створити
                        <img src="/images/IconSave.png" alt=""/></button>
                </form>
            </div>
            <ToastContainer />
        </React.Fragment>
    )
}
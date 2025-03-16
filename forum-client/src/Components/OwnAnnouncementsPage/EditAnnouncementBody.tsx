import React, {useEffect} from "react";
import {GroupVisibilityArray} from "../../Models/Posts/GroupVisibilityArray";
import {v4 as uuid} from "uuid";
import {useAnnouncementContext} from "../../lib/AnnouncementsProvider";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditAnnouncementBody(props: {announId: string}){
    const {editAnnouncement, getAnnouncement, announcement, setAnnouncement} = useAnnouncementContext();

    useEffect(() => {
        getAnnouncement(props.announId);
    }, []);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        editAnnouncement(props.announId, announcement);
    }

    const handleWithComments = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if(e.target.value === "З коментарями"){
            setAnnouncement(prev => {
                return {...prev, 
                    withComments: true
                };
            });
        }
        else{
            setAnnouncement(prev => {
                return {...prev,
                    withComments: false
                };
            });
        }
    }

    const handleCheckboxChange = (group: string) => {
        setAnnouncement((prev) => {
            let newGroupVisibility = [...prev.groupVisibility!];

            if (group === '*') {
                if (prev.groupVisibility?.includes('*')) {
                    newGroupVisibility = ['None'];
                } else {
                    newGroupVisibility = ['*', ...GroupVisibilityArray.map((g) => g.group)];
                }
            } else {
                if (newGroupVisibility.includes(group)) {
                    newGroupVisibility = newGroupVisibility.filter((g) => g !== group && g !== '*');
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
                ...prev,
                groupVisibility: newGroupVisibility,
            }
        });
    }

    return (
        <React.Fragment>
            <div className="AddPost-container">
                <div className="AnnouncementsAndPosts-UpperBlock">
                    <div></div>
                    <h1 className="AnnouncementsAndPosts-H1">Змінити оголошення</h1>
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
                                setAnnouncement((prev) => {
                                    if(!prev) return prev;
                                    return {...prev, title: e.target.value}
                                })
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
                                setAnnouncement((prev) => {
                                    if(!prev) return prev;
                                    return {...prev, text: e.target.value}
                                })
                            }
                        ></textarea>
                    </div>

                    <div className="AddPost-box">
                        <label className="AddPost-Label" htmlFor="withComments">Коментарі</label>
                        <select onChange={(e) => handleWithComments(e)} id="withComments"
                                className="AddPost-withComments">
                            {announcement.withComments &&
                                <>
                                    <option value="З коментарями">З коментарями</option>
                                    <option value="Без коментарів">Без коментарів</option>
                                </>
                            }
                            {!announcement.withComments &&
                                <>
                                    <option value="Без коментарів">Без коментарів</option>
                                    <option value="З коментарями">З коментарями</option>
                                </>
                            }
                        </select>
                    </div>

                    <div className="AddPost-box">
                        <p className="AddPost-Label">Групи які будуть бачити оголошення</p>
                        <div className="AddPost-Check-box-all">
                            <input
                                className="AddPost-Check-box"
                                id="all-groups"
                                type="checkbox"
                                checked={announcement.groupVisibility?.includes('*')}
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
                                        checked={announcement.groupVisibility?.includes(group.group)}
                                        onChange={() => handleCheckboxChange(group.group)}
                                    />
                                    <label htmlFor={group.id}>{group.group}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="AddPost-Create-Button AnnounAndPostBox-LinkAnimation" type="submit">Зберегти
                        <img src="/images/IconSave.png" alt=""/></button>
                </form>
            </div>
            <ToastContainer/>
        </React.Fragment>
    )
}
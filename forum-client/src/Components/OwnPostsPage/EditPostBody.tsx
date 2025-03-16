import React, {useEffect} from "react";
import {GroupVisibilityArray} from "../../Models/Posts/GroupVisibilityArray";
import {v4 as uuid} from "uuid";
import {usePostContext} from "../../lib/PostsProvider";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OwnPosts({postId}: {postId: string}) {
    const {editPost, post, getPost, setPost} = usePostContext();

    useEffect(() => {
        getPost(postId)
    }, []);
    
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        editPost(postId, post);
    }

    const handleWithComments = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if(e.target.value === "З коментарями"){
            setPost((prevPost) => ({
                ...prevPost,
                withComments: true
            }));
        }
        else{
            setPost((prevPost) => ({
                ...prevPost,
                withComments: false
            }));
        }
    }
    
    const handleCheckboxChange = (group: string) => {
        setPost((prevPost) => {
            let newGroupVisibility = [...prevPost.groupVisibility!];

            if (group === '*') {
                if (prevPost.groupVisibility?.includes('*')) {
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
                ...prevPost,
                groupVisibility: newGroupVisibility,
            }
        });
    }
    
    return (
        <React.Fragment>
            <div className="AddPost-container">
                <div className="AnnouncementsAndPosts-UpperBlock">
                    <div></div>
                    <h1 className="AnnouncementsAndPosts-H1">Змінити пост</h1>
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
                            value={post.title}
                            onChange={(e) =>
                                setPost((prevPost) => ({...prevPost, title: e.target.value}))
                            }
                        />
                    </div>

                    <div className="AddPost-box">
                        <label className="AddPost-Label" htmlFor="text">Опис</label>
                        <textarea
                            className="AddPost-text"
                            id="text"
                            placeholder="Ваш заголовок"
                            value={post.text}
                            onChange={(e) =>
                                setPost((prevPost) => ({...prevPost, text: e.target.value}))
                            }
                        ></textarea>
                    </div>

                    <div className="AddPost-box">
                        <label className="AddPost-Label" htmlFor="withComments">Коментарі</label>
                        <select onChange={(e) => handleWithComments(e)} id="withComments"
                                className="AddPost-withComments">
                            {post.withComments &&
                                <>
                                    <option value="З коментарями">З коментарями</option>
                                    <option value="Без коментарів">Без коментарів</option>
                                </>
                            }
                            {!post.withComments &&
                                <>
                                    <option value="Без коментарів">Без коментарів</option>
                                    <option value="З коментарями">З коментарями</option>
                                </>
                            }
                        </select>
                    </div>

                    <div className="AddPost-box">
                        <p className="AddPost-Label">Групи які будуть бачити пост</p>
                        <div className="AddPost-Check-box-all">
                            <input
                                className="AddPost-Check-box"
                                id="all-groups"
                                type="checkbox"
                                checked={post.groupVisibility?.includes('*')}
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
                                        checked={post.groupVisibility.includes(group.group)}
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
            <ToastContainer />
        </React.Fragment>
    )
}
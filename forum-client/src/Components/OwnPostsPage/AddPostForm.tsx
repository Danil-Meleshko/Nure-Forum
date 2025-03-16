import React, {useState} from "react";
import {usePostContext} from "../../lib/PostsProvider";
import {PostAddDto} from "../../Models/Posts/PostsInterfaces";
import {v4 as uuid} from "uuid";
import "../../Styles/AddPostPage.css"
import {GroupVisibilityArray} from "../../Models/Posts/GroupVisibilityArray";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useAuthContext} from "../../lib/AuthProvider";

export default function AddPostForm(){
    const postsController = usePostContext();
    const {user} = useAuthContext();
    const [post, setPost] = useState<PostAddDto>({
        id: uuid(),
        title: "",
        text: "",
        authorId: user.id,
        withComments: true,
        groupVisibility: ["*", ...GroupVisibilityArray.map(g => g.group)]
    });
    
    
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
        post.id = uuid();
        postsController.addPost(post);
        setPost({
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
                    <h1 className="AnnouncementsAndPosts-H1">Додати власний пост</h1>
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
                                checked={post.groupVisibility.includes('*')}
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

                    <button className="AddPost-Create-Button AnnounAndPostBox-LinkAnimation" type="submit">Створити
                        <img src="/images/IconSave.png" alt=""/></button>
                </form>
            </div>
            <ToastContainer />
        </React.Fragment>
    )
}
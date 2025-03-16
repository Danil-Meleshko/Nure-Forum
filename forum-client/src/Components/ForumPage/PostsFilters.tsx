import React, {useEffect, useRef} from "react";
import {usePostContext} from "../../lib/PostsProvider";

export default function PostsFilters({ownPostsFilter}: { ownPostsFilter: boolean }) {
    const [filters, setFilters] = React.useState({
        title: "",
        authorEmail: "",
        createdAt: new Date(),
        authorRole: ""
    });
    const {getPosts, allPostsOfTheUser} = usePostContext();
    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) {
            const timeOutId = setTimeout(() => {
                if(!ownPostsFilter){ getPosts(filters); }
                else allPostsOfTheUser(filters);
            }, 500);

            return () => clearTimeout(timeOutId);
        }
        
        didRun.current = true;
    }, [filters]);

    function SearchByTitle(event: React.ChangeEvent<HTMLInputElement>){
        event.preventDefault()
        setFilters(prev => ({...prev, title: event.target.value}));
    }

    function SearchByAuthor(event: React.ChangeEvent<HTMLInputElement>){
        event.preventDefault()
        setFilters(prev => ({...prev, authorEmail: event.target.value}));
    }

    function SearchByDate(date: string){
        let compDate = new Date();

        switch (date){
            case "Будь-коли":
                compDate = new Date();
                break;
            case "З Вчора":
                compDate.setDate(compDate.getDate() - 1);
                break;
            case "3 дні тому і більше":
                compDate.setDate(compDate.getDate() - 3);
                break;
            case "Тиждень тому і більше":
                compDate.setDate(compDate.getDate() - 7);
                break;
            case "Місяць тому і більше":
                compDate.setMonth(compDate.getMonth() - 1);
                break;
            case "Рік тому і більше":
                compDate.setFullYear(compDate.getFullYear() - 1);
                break;
            case "3 роки тому і більше":
                compDate.setFullYear(compDate.getFullYear() - 3);
                break;
            default:
                break;
        }

        setFilters((prev) => ({...prev, createdAt: compDate}));
    }

    function SearchByRole(role: string){
        if(role === "Будь-хто") setFilters((prev) => ({...prev, authorRole: ""}));
        else setFilters((prev) => ({...prev, authorRole: role}));
    }

    return (
        <>
            <div className="AnnounAndPostFilterBox">
                <div className="InputAndIconFilter">
                    <img alt="" className="InputIcon" src="/images/SearchIcon.png"/>
                    <input id="Заголовок" type="text" placeholder="Пошук" className="AnnounAndPostFilterInput"
                           onChange={(e) => SearchByTitle(e)}/>
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="420" height="2" viewBox="0 0 420 2" fill="none">
                <path d="M0 1H420" stroke="#1DD6F3" strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="6 6"/>
            </svg>
            {!ownPostsFilter && 
                <div className="AnnounAndPostFilterBox">
                    <label htmlFor="Автор">Автор</label>
                    <div className="InputAndIconFilter">
                        <img alt="" className="InputIcon" src="/images/SearchIcon.png"/>
                        <input id="Автор" type="text" placeholder="Викладач" className="AnnounAndPostFilterInput"
                               onChange={(e) => SearchByAuthor(e)}/>
                    </div>
                </div>
            }


            <div className="AnnounAndPostFilterBox">
                <label htmlFor="ДатаСтворення">Дата створення</label>
                <select id="ДатаСтворення" className="AnnounAndPostFilterInput"
                        onChange={(e) => SearchByDate(e.target.value)}>
                    <option value="Будь-коли">Будь-коли</option>
                    <option value="З Вчора">З Вчора</option>
                    <option value="3 дні тому і більше">3 дні тому і більше</option>
                    <option value="Тиждень тому і більше">Тиждень тому і більше</option>
                    <option value="Місяць тому і більше">Місяць тому і більше</option>
                    <option value="Рік тому і більше">Рік тому і більше</option>
                    <option value="3 роки тому і більше">3 роки тому і більше</option>
                </select>
            </div>
            {!ownPostsFilter &&
                <div className="AnnounAndPostFilterBox">
                    <label htmlFor="АвториПостів">Автори постів</label>
                    <select onChange={(e) => SearchByRole(e.target.value)} id="АвториПостів"
                            className="AnnounAndPostFilterInput">
                        <option value="Будь-хто">Будь-хто</option>
                        <option value="Вчитель">Вчитель</option>
                        <option value="Студент">Студент</option>
                    </select>
                </div>
            }
        </>
    )
}
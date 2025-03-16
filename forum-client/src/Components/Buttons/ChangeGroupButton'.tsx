import React, {useState} from "react";
import {GroupVisibilityArray} from "../../Models/Posts/GroupVisibilityArray";
import {useAuthContext} from "../../lib/AuthProvider";

export default function ChangeGroupButton() {
    const {user, axiosInstance, setUser} = useAuthContext()
    const [group, setGroup] = useState(user.group)
    const [containerOpened, setContainerOpened] = useState(false);
    const [error, setError] = useState({
        message: ""
    });
    
    const handleClick = async () => {
        try {
            const response = await axiosInstance.post(`/Features/ChangeGroup?newGroup=${group}`);

            if(response.status === 200) {
                setError({message: ""});
                setUser(prev => ({...prev, group: group}));
            }
        }
        catch (error:any) {
            if(error.status === 400) {
                setError({message: "Тиждень з минулої спроби ще не минув"});
            }
            if(error.status === 403) {
                setError({message: "Ви не можете обрати цей факультет"})
            }
            console.error("Failed to change group", error);
        }
    }
    
    return (
        <>
            <button className="GroupChangingButton AnnounAndPostBox-LinkAnimation" 
                    style={{maxWidth: "150px", alignSelf: "center"}}
                    onClick={() => {
                        setContainerOpened(prev => !prev)
                        setError({message: ""});
                        if(containerOpened) setGroup(user.group);
                }}>{
                containerOpened ? "Закрити" : "Змінити факультет/роль"
            }</button>
            {containerOpened && (
                <div className="AddPostOrAnnounButtonBox">
                    <h2 className="AddPostOrAnnounButtonH2">Змінити факультет/роль (раз на тиждень)</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="2" viewBox="0 0 420 2"
                         fill="none">
                        <path d="M0 1H420" stroke="#1DD6F3" strokeLinecap="round" strokeLinejoin="round"
                              strokeDasharray="6 6"/>
                    </svg>
                    {error.message && (
                        <span className="AuthErrorSpan" style={{maxWidth: "85%", alignSelf: "center"}}>{error.message}</span>
                    )}
                    <div style={{
                        width: "70%", display: "flex", justifyContent: "center",
                        alignItems: "center", flexDirection: "column", gap: "10px"
                    }}>
                        <select name="group" className="GroupChangeSelect"
                                value={group}
                                onChange={(e) => setGroup(e.target.value)}>
                            {GroupVisibilityArray.map(g => (
                                <option key={g.id} value={g.group}>
                                    {g.group}
                                </option>
                            ))}
                            <option value={"Teacher"}>Викладач</option>
                        </select>
                    </div>
                    <button className="AddPostOrAnnounButton BigButtonHoverAnimation" 
                            style={{width: "70%", alignSelf: "center"}}
                            onClick={() => handleClick()}
                    >Підтвердити</button>
                </div>
            )}
        </>
    )
}
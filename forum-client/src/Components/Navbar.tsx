import React from "react";
import {Link} from "react-router-dom";
import "../Styles/NavBar.css";
import {useAuthContext} from "../lib/AuthProvider";


export default function Navbar() {
    const {handleLogout, role} = useAuthContext();
    
    return (
        <>
            <header className="Header">
                <div className="Header-left">
                    <Link id="NureIconBottom" to="/"><img alt="" src="/images/LogoHeader.png"/></Link>
                </div>
                <div className="Header-center">
                    <Link to="/Announcements">Оголошення</Link>
                    <Link to="/Forum">Форум</Link>
                    {(role === "Admin" || role === "Teacher" || role === "Student") && (<Link to="/OwnPosts">Власні Пости</Link>)}
                </div>
                <div className="Header-right">
                    <Link id="LogInButton" onClick={handleLogout} to="/Login">Вийти</Link>
                    <Link id="RegisterButton" to="/Register">Реєстрація</Link>
                </div>
            </header>
        </>
    )
}
import React from "react";
import {Link} from "react-router-dom";
import "../Styles/Footer.css";
import {useAuthContext} from "../lib/AuthProvider";

export default function Footer() {
    const {role} = useAuthContext();

    return (
        <div className="Footer">
            <div className="FooterBody">
                <div className="FooterUp">
                    <div className="FooterLeft">
                        <Link id="NureIconBottom" to="/"><img alt="" src="/images/LogoFooter.png"/></Link>
                    </div>
                    <div className="FooterRightUp">
                        <Link to="/Announcements">Оголошення</Link>
                        <Link to="/Forum">Форум</Link>
                        {(role === "Admin" || role === "Teacher" || role === "Student") && <Link to="/OwnPosts">Власні Пости</Link>}
                    </div>
                </div>

                <div className="FooterDown">
                    <div className="FooterDownLeft">
                        <a className="Footer-animated-button" href="https://www.facebook.com/nureKharkiv/"><img alt="" src="/images/IconF.png"/></a>
                        <a className="Footer-animated-button" href="https://www.instagram.com/khnure_official/"><img alt="" src="/images/IconI.png"/></a>
                        <a className="Footer-animated-button" href="https://www.youtube.com/user/nuretv"><img alt="" src="/images/IconY.png"/></a>
                        <a className="Footer-animated-button" href="https://www.linkedin.com/school/kharkiv-national-university-of-radioelectronics/">
                            <img alt="" src="/images/IconL.png"/></a>
                        <a className="Footer-animated-button" href="https://twitter.com/PressNURE"><img alt="" src="/images/IconT.png"/></a>
                    </div>
                    <div className="FooterDownRight">
                        <div className="DivMonImgDown">
                            <a href="http://mon.gov.ua/"><img alt="" src="/images/LogoUAMON.png"/></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
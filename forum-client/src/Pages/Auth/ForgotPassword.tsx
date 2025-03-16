import axios from "axios";
import React, { useState } from "react";
import "../../Styles/Auth.css"
import {Link} from "react-router-dom";

interface ErrorMessage{
    message: string;
    isError: boolean;
}

export default function ForgotPassword() {
    const [email, setUserEmail] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
        message: "Не існує акаунту який використовує цю електнонну пошту",
        isError: false,
    });
    
    async function handleForgotPassword(event: React.FormEvent) {
        event.preventDefault();
        setErrorMessage(e => ( { ...e, isError: false }))
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_PATH}/Auth/ForgotPassword?email=${email}`);

            if(response.status === 200) {
                window.location.assign(`/LogIn`);
            }
        }
        catch (error) {
            setErrorMessage(e => ( { ...e, isError: true }))
            console.error(error);
        }
    }

    return (
        <>
            <div className="LogInPage">
                <div className="Logo">
                    <img src="/images/LogoPics1.png" alt="LogoPics1"/>
                </div>
                <div className="LogInForm">
                    <div id="ForgotPassword">
                        <form onSubmit={handleForgotPassword}>
                            <h1 className="Auth-h1">Вхід до форуму</h1>
                            {errorMessage.isError && <span className="AuthErrorSpan">{errorMessage.message}</span>}
                            <div>
                                <label>
                                    Ваша пошта
                                    <input
                                        className="AuthInput"
                                        type="text"
                                        name="username"
                                        placeholder='example@nure.ua'
                                        value={email}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                            <button className="AuthButton BigButtonHoverAnimation" type="submit">Змінити <img alt=""
                                                                                                              src="/images/ArrowIcon.png"
                                                                                                              className='arrow'/>
                            </button>
                            <Link className="AuthLink" to="/LogIn">LogIn</Link>
                            <Link className="AuthLink" to="/Register">Create new acccount</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
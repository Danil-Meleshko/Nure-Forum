import React, { useState } from "react";
import "../../Styles/Auth.css"
import {Link} from "react-router-dom";
import {useAuthContext} from "../../lib/AuthProvider";

interface ErrorMessage {
    message: string;
    isError: boolean;
}

export default function LogIn() {
    const [email, setUserEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const {setToken, axiosInstance} = useAuthContext();
    const [errorResult, setErrorResult] = useState<ErrorMessage>({
        message: "Неправильний пароль або пошта",
        isError: false,
    });
    const {setUser} = useAuthContext();
    
    async function handleLogin(event: React.FormEvent) {
        event.preventDefault(); 

        try {
            const credentials = {
                "email": email,
                "password": password
            };
            
            const response = await axiosInstance.post(`/Auth/LogIn`, credentials,
                {withCredentials: true});
            
            const userInfo = {
                id: response.data.id,
                email: response.data.email,
                group: response.data.group,
                image: response.data.image
            }
            
            if(response.status === 200) {
                setToken(response.data.token);
                setUser(userInfo);
                window.location.assign(`Announcements`);
            }
        } catch (err) {
            setErrorResult(e => ({
                ...e,
                isError: true,
            }))
            console.error("Login failed:", err);
        }
    }

    return (
        <>
            <div className="LogInPage">
                <div className="Logo">
                    <img src="/images/LogoPics1.png" alt="LogoPics1"/>
                </div>
                <div className="LogInForm">
                    <form onSubmit={handleLogin}>
                        <h1 className="Auth-h1">Вхід до форуму</h1>
                        {errorResult.isError && <span className="AuthErrorSpan">{errorResult.message}</span>}
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
                        <div>
                            <label>
                                Ваш пароль
                                <input
                                    className="AuthInput"
                                    type="password"
                                    name="password"
                                    placeholder='Пароль'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <button className="AuthButton BigButtonHoverAnimation" type="submit">Увійти <img alt=""
                                                                                                             src="/images/ArrowIcon.png"
                                                                                                             className='arrow'/>
                            </button>
                        </div>
                        <Link className="AuthLink" to="/Register">Create new account</Link>
                        <Link className="AuthLink" to="/ForgotPassword">Forgot the password</Link>
                    </form>
                </div>
            </div>
        </>
    )
}
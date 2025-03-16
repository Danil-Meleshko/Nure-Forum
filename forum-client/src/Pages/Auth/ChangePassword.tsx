import React, {useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import axios from "axios";


interface ErrorMessage {
    message: string;
    isError: boolean;
}

export default function ChangePassword(){
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({ password: "", confirmPassword: ""})
    
    const [errorPassword, setErrorPassword] = useState<ErrorMessage>({
        message: "Обидва пароля мають співпадати",
        isError: false,
    });
    const [errorResult, setErrorResult] = useState<ErrorMessage>({
        message: "Неправильний токен або пошта",
        isError: false,
    });
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    
    async function handleResetPassword(event: React.FormEvent) {
        event.preventDefault();
        setErrorResult(e => ( { ...e, isError: false }))
        
        if(form.confirmPassword !== form.password) {
            setErrorPassword(e => ({
                ...e,
                isError: true,
            }))
            return;
        }
        else setErrorPassword(e => ({...e, isError: false}));
        
        try {
            const credentials = {
                "email": searchParams.get("email"),
                "newPassword": form.password,
                "resetToken": decodeURIComponent(searchParams.get("token") || "")
            };
            
            const response = await axios.post(`${process.env.REACT_APP_API_PATH}/Auth/ResetPassword`,
                credentials);

            if(response.status === 200) {
                window.location.assign(`/LogIn`);
            }
        } catch (err) {
            setErrorResult(e => ({
                ...e,
                isError: true
            }))
            console.error("Login failed:", err);
        }
    }
    
    return(
        <>
            <div className="LogInPage">
                <div className="Logo">
                    <img src="/images/LogoPics1.png" alt="LogoPics1"/>
                </div>
                <div className="LogInForm">
                    <div id="ForgotPassword">
                        <form onSubmit={handleResetPassword}>
                            <h1 className="Auth-h1">Вхід до форуму</h1>
                            {errorResult.isError && <span className="AuthErrorSpan">{errorResult.message}</span>}
                            <div>
                                <label>
                                    Новий пароль
                                    <input
                                        className="AuthInput"
                                        type="password"
                                        name="password"
                                        placeholder='Пароль'
                                        onChange={(e) => handleFormChange(e)}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Повторіть пароль
                                    <input
                                        className="AuthInput"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder='Новий Пароль'
                                        onChange={(e) => handleFormChange(e)}
                                        required
                                    />
                                </label>
                            </div>
                            {errorPassword.isError && <span className="AuthErrorSpan">{errorPassword.message}</span>}
                            <div>
                                <button className="AuthButton BigButtonHoverAnimation" type="submit">Змінити <img alt=""
                                                                                                                  src="/images/ArrowIcon.png"
                                                                                                                  className='arrow'/>
                                </button>
                            </div>
                            <Link className="AuthLink" to="/LogIn">LogIn</Link>
                            <Link className="AuthLink" to="/Register">Create new acccount</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
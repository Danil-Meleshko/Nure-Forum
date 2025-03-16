import React, {useRef, useState} from "react";
import {GroupVisibilityArray} from "../../Models/Posts/GroupVisibilityArray";
import axios from "axios";
import {Link} from "react-router-dom";

interface ErrorMessege {
    email: boolean;
    password: boolean;
    message: string;
    isError: boolean;
}

export default function Register(){
    const [form, setForm] = useState({ email: "", password: "", group: "None" })
    const [teacherBox, setTeacherBox] = useState({
        isPressed: false,
        group: "Teacher"
    });
    const [token, setToken] = useState<string>("");
    const [errors, setErrors] = useState<ErrorMessege>({
        email: false,
        password: false,
        message: "",
        isError: false
    });
    const registerRef = useRef<HTMLDivElement>(null); 
    const confirmRef = useRef<HTMLDivElement>(null);
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    
    async function handleEmailConfirmation(e: React.FormEvent) {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_PATH}/Auth/EmailConfirmation?email=${form.email}&token=${token}`)
            if (response.status === 200) {
                setErrors(prev => ({
                    ...prev,
                    isError: false
                }));
                window.location.assign("/Login");
            }
        }
        catch(err){
            setErrors(prev => ({
                ...prev,
                message: "Невірний код",
                isError: true
            }));
            console.error("Confirmation failed:", e);
        }
    }
    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        
        if(!emailRegex.test(form.email) && passwordRegex.test(form.password)){
            setErrors(prev => ({
                ...prev,
                email: true,
                password: false,
                isError: false
            }));
            return;
        }
        
        if(!passwordRegex.test(form.password) && emailRegex.test(form.email)){
            setErrors({
                ...errors,
                password: true,
                email: false,
                isError: false
            });

            return;
        }
        
        if(!emailRegex.test(form.email) && !passwordRegex.test(form.password)){
            setErrors({
                ...errors,
                password: true,
                email: true,
                isError: false
            });

            return;
        }

        setErrors(prev => ({
            ...prev,
            password: false,
            email: false,
            isError: false
        }));
        
        try {
            let credentials;
            
            if(teacherBox.isPressed){
                credentials = {
                    "Email": form.email,
                    "Password": form.password,
                    "Group": teacherBox.group
                };
            }
            else {
                credentials = {
                    "Email": form.email,
                    "Password": form.password,
                    "Group": form.group
                };
            }

            await axios.post(`${process.env.REACT_APP_API_PATH}/Auth/Register`, credentials);
            
            if(registerRef.current) registerRef.current.classList.add("no-display");
            if(confirmRef.current) confirmRef.current.classList.remove("no-display");
        }
        catch(e: any) {
            if(e.status === 403){
                setErrors(prev => ({
                    ...prev,
                    message: "Ви не можете обрати цей факультет",
                    isError: true
                }));
            }
            else{
                setErrors(prev => ({
                    ...prev,
                    message: "Пошта чи пароль неправильні, або користувач з цими даними вже існує",
                    isError: true
                }));
            }
            console.error("Login failed:", e);
        }
    }

    return (
        <>
            <div className="LogInPage">
                <div className="Logo">
                    <img src="/images/LogoPics1.png" alt="LogoPics1"/>
                </div>
                <div className="LogInForm">
                    <div ref={registerRef}>
                        <form onSubmit={handleRegister}>
                            <h1 className="Auth-h1">Створіть новий акаунт</h1>
                            {errors.isError &&
                                <span className="AuthErrorSpan" id="RegisterResult">{errors.message}</span>}
                            <div className="InputFields">
                                <label>
                                    Ваша пошта
                                    <input
                                        className="AuthInput"
                                        type="text"
                                        name="email"
                                        placeholder='example@nure.ua'
                                        required={true}
                                        onChange={(e) => handleFormChange(e)}
                                    />
                                </label>
                                {errors.email ? (
                                    <span className="AuthErrorSpan">невірна пошта</span>
                                ) : (<></>)}
                            </div>
                            <div className="InputFields">
                                <label>
                                    Ваш пароль
                                    <input
                                        className="AuthInput"
                                        type="password"
                                        name="password"
                                        placeholder='Пароль'
                                        required={true}
                                        onChange={(e) => handleFormChange(e)}
                                    />
                                </label>
                                {errors.password ? (
                                    <span className="AuthErrorSpan">Хоча б 1 велика та маленька літера, хоча б одна цифра та сумарно від 8 символів і більше</span>
                                ) : (<></>)}
                            </div>
                            <div>
                                <label>
                                    Ваш факультет
                                    <select name="group" className="AuthRegisterSelect"
                                            onChange={(e) => handleFormChange(e)}>
                                        {GroupVisibilityArray.map(g => (
                                            <option key={g.id} value={g.group}>
                                                {g.group}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div style={{display: "flex", alignSelf: "start", gap: "8px"}}>
                                <input style={{width: "15px"}} name="teacherBox" type="checkbox"
                                        onClick={() => {setTeacherBox(prev => ({...prev, isPressed: !prev.isPressed}));}}/>
                                <label htmlFor="teacherBox">Викладач</label>
                            </div>

                            <div>
                                <button className="AuthButton BigButtonHoverAnimation" type="submit">Підтвердити <img
                                    src="/images/ArrowIcon.png"
                                    alt='' className='arrow'/></button>
                            </div>
                            <Link className="AuthLink" to="/LogIn">LogIn</Link>
                        </form>
                    </div>

                    <div ref={confirmRef} className="EmailConfirmation no-display" id="EmailConfirmationForm">
                        <form onSubmit={handleEmailConfirmation}>
                            <h1 className="Auth-h1">Підтвердіть пошту</h1>
                            {errors.isError &&
                                <span className="AuthErrorSpan" id="RegisterResult">{errors.message}</span>}
                            <div className="InputFields">
                                <label>
                                    Код
                                    <input
                                        className="AuthInput"
                                        type="text"
                                        name="token"
                                        placeholder='123456'
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <button className="AuthButton BigButtonHoverAnimation" type="submit">Підтвердити <img
                                    src="/images/ArrowIcon.png"
                                    alt='' className='arrow'/></button>
                            </div>
                            <button className="TryAgainButton" onClick={() => {
                                if (registerRef.current) registerRef.current.classList.remove("no-display");
                                if (confirmRef.current) confirmRef.current.classList.add("no-display");
                                setErrors(prev => ({
                                    ...prev,
                                    isError: false
                                }));
                            }}>Спробувати знову
                            </button>
                            <Link className="AuthLink" to="/LogIn">LogIn</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
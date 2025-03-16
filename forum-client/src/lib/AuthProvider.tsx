import React, {createContext, Dispatch, useContext, useEffect, useState} from "react";
import axios from "axios";

interface AuthProviderProps {
    loading: boolean,
    token: string | null,
    setLoading: (value: boolean) => void,
    handleLogout: () => void,
    setToken: Dispatch<React.SetStateAction<string | null>>
    axiosInstance: any,
    role: string  | undefined
    user: UserInfo,
    setUser: Dispatch<React.SetStateAction<UserInfo>>
}

interface UserInfo {
    id: string,
    email: string,
    group: string,
    image: string,
}

const AuthContext = createContext<AuthProviderProps | undefined>(undefined);

export function useAuthContext() {
    const authContext = useContext(AuthContext);

    if (authContext === undefined) {
        throw new Error("useAuthContext must be used with a AuthProvider");
    }

    return authContext;
}

export default function AuthProvider({children}: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | undefined>("None");
    const [token, setToken] = useState<string | null>(null); 
    const [user, setUser] = useState<UserInfo>({
        id: "",
        email: "",
        group: "",
        image: ""
    });
    
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_PATH,
        withCredentials: true
    });

    useEffect(() => {
        refreshToken();
    }, []);
    
    axiosInstance.interceptors.request.use(
        (config) => {
            if(token){
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    )
    
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401 && !error.config._retry) {
                error.config._retry = true;
                setLoading(true);
                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_PATH}/Auth/RefreshToken`, null, {
                        withCredentials: true,
                    });
                    error.config.headers["Authorization"] = `Bearer ${response.data.token}`;
                    setToken(response.data.token);
                    return axiosInstance(error.config); // Retry original request
                } catch(error) {
                    window.location.assign("/LogIn")
                    setToken(null);
                    setUser({
                        id: "",
                        email: "",
                        group: "",
                        image: ""
                    });
                    console.error(error);

                    return Promise.reject(error); // Refresh failed, reject request
                }
                finally {
                    setLoading(false);
                }
            }
            return Promise.reject(error);
        }
    );

    async function refreshToken() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_PATH}/Auth/RefreshToken`, null,
                {withCredentials: true});
            setToken(response.data.token);
            setUser({
                id: response.data.id,
                email: response.data.email,
                group: response.data.group,
                image: response.data.image ?? ""
            });
            setRole(response.data.role);
        } catch (error) {
            setToken(null);
        } finally {
            setLoading(false);  
        }
    }
    
    async function handleLogout() {
        try {
            await axios.post(`${process.env.REACT_APP_API_PATH}/Auth/LogOut`, null,
                {withCredentials: true});
            setToken(null);
            setUser({
                id: "",
                email: "",
                group: "",
                image: ""
            })
        }
        catch(error) {
            console.error(error);
        }
    }

    if (loading) return (
        <>
            <div>Loading...</div>
        </>
    )

    return (
        <AuthContext.Provider value={{loading, role, setLoading, token, setToken, axiosInstance, user, setUser, handleLogout}}>
            {children}
        </AuthContext.Provider>
    )
}
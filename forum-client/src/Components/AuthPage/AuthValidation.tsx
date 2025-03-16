import React from "react";
import {useAuthContext} from "../../lib/AuthProvider";
import {Navigate} from "react-router-dom";

export default  function AuthValidation({children} : {children: React.ReactNode}) {
    const {token} = useAuthContext();
    
    return token ? <>{children}</> : <Navigate to="/Login"/>;
}
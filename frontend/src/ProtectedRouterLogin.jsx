import { Outlet,Navigate } from "react-router-dom";

function ProtectedRouterLogin(){
    const storedData = localStorage.getItem("userDetails")
    const parsedData = JSON.parse(storedData)
    // console.log(parsedData);
    return parsedData ? (
        <Outlet />
    ):(
        <Navigate to={"/"}/>
    )
}

export default ProtectedRouterLogin;
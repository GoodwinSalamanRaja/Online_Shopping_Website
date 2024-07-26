import { Outlet,Navigate } from "react-router-dom";

function ProtectedRouterAdminLogin(){
    const storedData = localStorage.getItem("adminDetails")
    const parsedData = JSON.parse(storedData)
    console.log(parsedData);
    return parsedData ? (
        <Outlet />
    ):(
        <Navigate to={"/admin-login"}/>
    )
}

export default ProtectedRouterAdminLogin;
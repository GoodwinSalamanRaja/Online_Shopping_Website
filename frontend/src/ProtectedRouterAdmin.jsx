import { Outlet,Navigate } from "react-router-dom";

function ProtectedRouterAdmin(){
    const storedData = localStorage.getItem("adminDetails")
    const parsedData = JSON.parse(storedData)
    return parsedData ? (
        <Navigate to={"/admin-home"}/>
    ):(
        <Outlet />
    )
}

export default ProtectedRouterAdmin;
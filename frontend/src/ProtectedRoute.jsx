import { Outlet,Navigate } from "react-router-dom";

function ProtectedRouter(){
    const storedData = localStorage.getItem("userDetails")
    const parsedData = JSON.parse(storedData)
    // console.log(parsedData);
    return parsedData ? (
        <Navigate to={"/home"}/>
    ):(
        <Outlet />
    )
}

export default ProtectedRouter;
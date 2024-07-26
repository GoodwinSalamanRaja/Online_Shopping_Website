import {ToastContainer} from "react-toastify"
import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRouter from "./ProtectedRoute";
import ProtectedRouterLogin from "./ProtectedRouterLogin";
import HomePage from "./HomePage";
import AdminLogin from "./AdminLogin";
import AdminHomePage from "./AdminHomePage";
import ProtectedRouterAdmin from "./ProtectedRouterAdmin";
import ProtectedRouterAdminLogin from "./ProtectedRouterAdminLogin";
import AdminManageUser from "./AdminManageUser";
import CookieDemo from "./CookieDemo";
import WebMetamaskTransactions from "./WebMetamaskTransactions";
import AdminManageProducts from "./AdminManageProducts";
import Cart from "./Cart";
import io from "socket.io-client"
import { useEffect, useState } from "react";

const socket = io("http://localhost:8080")

function App() {

  // const storedData = localStorage.getItem("userDetails");
  // const parsedData = JSON.parse(storedData);

  const [length,setLength] = useState()

  useEffect(() => {

    // socket.emit("joinRoom",parsedData.userId)

    socket.emit("demo",{name:"goodwin"})

    socket.on("cartLength",(length) => {
      console.log("length",length);
      setLength(length)
    })

    socket.on("test",(test) => {
      console.log("test",test);
    })

    return () => {
      socket.off("demo")
      socket.off("cartLength")
      // socket.emit("leaveRoom",parsedData.userId)
    }
  },[])

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRouter />}>
            <Route path="/" element={<UserLogin />}></Route>
            <Route path="/register" element={<UserRegister />}></Route>
          </Route>
          <Route element={<ProtectedRouterLogin />}>
            <Route path="/home" element={<HomePage length={length}/>}></Route>
            <Route
              path="/metamasktransaction"
              element={<WebMetamaskTransactions />}
            ></Route>
            <Route
              path="/cart"
              element={<Cart length={length}/>}
            ></Route>
          </Route>
          <Route element={<ProtectedRouterAdmin />}>
            <Route path="/admin-login" element={<AdminLogin />}></Route>
          </Route>
          <Route element={<ProtectedRouterAdminLogin />}>
            <Route path="/admin-home" element={<AdminHomePage />}></Route>
            <Route path="/manage-users" element={<AdminManageUser />}></Route>
            <Route path="/products" element={<AdminManageProducts />}></Route>
          </Route>
          <Route path="/cookie" element={<CookieDemo />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;

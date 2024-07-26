import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './AdminLogin.css'
import { Link } from "react-router-dom";

function AdminLogin() {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(data);
    axios
      .post("http://localhost:8080/admin/check", data)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.status);
          // console.log(response.data);
          if (response.data.status === true) {
            alert(response.data.msg);
            console.log(response.data);
            localStorage.setItem("adminDetails",JSON.stringify({adminId:response.data.data._id,token:response.data.token}))
            navigate("/admin-home");
          } else if (response.data.status === false) {
            alert(response.data.msg);
          }
        }
        else if(response.status === 201){
          alert(response.data.msg)
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <div className="container-fluid">
      <form
        style={{ height: "100vh",}}
        className="row justify-content-center align-items-center admin-login-form"
        onSubmit={handleSubmit}
      >
        <fieldset
          className="col-11 col-sm-6 col-md-5 col-lg-4 col-xl-3 border border-light p-5 d-flex flex-column justify-content-center gap-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7" }}
        >
          <h3 className="text-center mb-4 fw-bold text-white">Admin Login</h3>
          <div class="form-floating mb-3">
            <input required
              type="text"
              name="username"
              value={data.username}
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={handleChange}
            />
            <label for="floatingInput">Username</label>
          </div>
          <div class="form-floating mb-3">
            <input required
              type="password"
              name="password"
              value={data.password}
              class="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={handleChange}
            />
            <label for="floatingPassword">Password</label>
          </div>
          <div className="text-center mb-3">
            <button className="btn btn-success p-2 w-50 fw-bold" type="submit">
              Login
            </button>
          </div>
          <div className="text-center fw-bold">
            <Link className="text-decoration-none" to={"/"}>Switch to user login</Link>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default AdminLogin;

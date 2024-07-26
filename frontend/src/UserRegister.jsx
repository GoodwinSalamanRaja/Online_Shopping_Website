import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserRegister.css"

function UserRegister() {
  const [data, setData] = useState({
    username: "",
    password: "",
    email: "",
    mobile: "",
  });
  const navigate = useNavigate();
  function handleChange(e) {
    const { name, value } = e.target;
    console.log(name, value);
    setData({ ...data, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(data);
    axios
      .post("http://localhost:8080/user/set",data)
      .then((response) => {
        console.log(response);
        console.log(response.status, "status");
        if (response.status === 200) {
          if (response.data.status === true) {
            alert("Account created successfully Click ok to login!");
            navigate("/");
          }
          else{
            alert(response.data.msg)
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className="container-fluid">
      <form
        style={{ height: "100vh"}}
        className="row justify-content-center align-items-center reg-form"
        onSubmit={handleSubmit}
      >
        <fieldset
          className="col-11 col-sm-6 col-md-5 col-lg-4 col-xl-3 border border-light p-5 d-flex flex-column justify-content-center gap-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <h3 className="text-center fw-bold text-white mb-3">Register</h3>
          <div class="form-floating mb-3">
            <input required
              name="username"
              value={data.username}
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={handleChange}
            />
            <label for="floatingInput">Username</label>
          </div>
          <div class="form-floating mb-3">
            <input required
              name="password"
              value={data.password}
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={handleChange}
            />
            <label for="floatingPassword">Password</label>
          </div>
          <div class="form-floating mb-3">
            <input required
              name="email"
              value={data.email}
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={handleChange}
            />
            <label for="floatingInput">Email</label>
          </div>
          <div class="form-floating mb-3">
            <input required
              name="mobile"
              value={data.mobile}
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={handleChange}
            />
            <label for="floatingInput">Mobile No</label>
          </div>
          <div className="text-center mb-3">
            <button className="btn btn-success p-2 w-50 fw-bold" type="submit">
              SignUp
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default UserRegister;

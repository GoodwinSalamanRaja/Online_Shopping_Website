import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

function UserLogin() {
  const [data, setData] = useState({ username: "", password: "" });
  const [email, setEmail] = useState();
  const [otp, setOtp] = useState();
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [otpPage, setOtpPage] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(data);
    axios
      .post("http://localhost:8080/user/check", data)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.status);
          // console.log(response.data);
          if (response.data.status === true) {
            alert(response.data.msg);
            console.log(response.data);
            localStorage.setItem(
              "userDetails",
              JSON.stringify({
                userId: response.data.data._id,
                token: response.data.token,
              })
            );
            navigate("/home");
          } else if (response.data.status === false) {
            alert(response.data.msg);
          }
        } else if (response.status === 201) {
          alert(response.data.msg);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function handleForgotSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(email);
    axios
      .get(`http://localhost:8080/user/forgot/${email}`)
      .then((response) => {
        if (response.status === 200) {
          alert(response.data.msg);
          setOtpPage("otp sent");
          setEmail(response.data.email);
          console.log(response.data);
        } else {
          alert(response.data.msg);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function handleOtpSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(email);
    axios
      .get(`http://localhost:8080/user/verify/${email}/${otp}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.msg);
          setOtpPage("");
        } 
        else if (response.status === 201) {
          console.log(response.data.msg);
          toast.error(response.data.msg)
        }
        else{
          toast.error(response.data.msg)
          window.location.reload()
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function handleNewPassword(e){
    e.preventDefault()
    e.stopPropagation()
    // console.log(password,confirmPassword);
    if(password === confirmPassword){
      axios
      .put(`http://localhost:8080/user/updatePassword/${email}/${confirmPassword}`)
      .then((response) => {
          setEmail("");
          console.log(response.data);
          alert(response.data.msg)
          navigate("/")
          window.location.reload()
      })
      .catch((e) => {
        console.log(e);
      });
    }
    else{
      alert("Password doesnot match")
    }
  }
  return (
    <div className="container-fluid">
      <form
        style={{ height: "100vh" }}
        className="row justify-content-center align-items-center user-login-form"
        onSubmit={handleSubmit}
      >
        <fieldset
          className="col-11 col-sm-6 col-md-5 col-lg-4 col-xl-3 border border-light p-5 d-flex flex-column justify-content-center gap-1"
          style={{ backgroundColor: "rgba(0,0,0,0.4" }}
        >
          <h3 className="text-center mb-4 fw-bold text-white">User Login</h3>
          <div class="form-floating mb-3">
            <input
              required
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
            <input
              required
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
          <div className="fw-bold text-center mb-3">
            <span type="button" className="text-primary" onClick={handleShow}>
              Forgot password?
            </span>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="fw-bold">Find Your Account</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {otpPage === false ? (
                  <form onSubmit={handleForgotSubmit}>
                    <div className="mb-2">
                      <span>
                        Please enter your email address to search for your
                        account.
                      </span>
                    </div>
                    <div class="form-floating mb-3">
                      <input
                        type="email"
                        class="form-control border border-secondary"
                        id="floatingInput"
                        placeholder="name@example.com"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label for="floatingInput">Email address</label>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <input
                          className="btn btn-primary"
                          type="submit"
                          value={"Submit"}
                        />
                      </Modal.Footer>
                    </div>
                  </form>
                ) : otpPage === "otp sent" ? (
                  <form onSubmit={handleOtpSubmit}>
                    <div class="form-floating mb-3">
                      <input
                        type="text"
                        class="form-control form-control-sm border border-secondary"
                        id="floatingInput"
                        placeholder="name@example.com"
                        required
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <label for="floatingInput">Enter OTP code</label>
                      <div className="text-center mt-3">
                        <input
                          type="submit"
                          value={"Submit"}
                          className="btn btn-success"
                        />
                      </div>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleNewPassword}>
                    <div class="form-floating mb-3">
                      <input
                        type="password"
                        class="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label for="floatingPassword">Enter a new Password</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input
                        type="password"
                        class="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <label for="floatingPassword">Confirm password</label>
                    </div>
                    <div className="text-center mb-3">
                      <input
                        className="btn btn-primary"
                        type="submit"
                        value={"Confirm"}
                      />
                    </div>
                  </form>
                )}
              </Modal.Body>
            </Modal>
          </div>
          <div className="fw-bold text-center mb-3">
            <a href="/register" className="text-decoration-none">
              Create a new account
            </a>
          </div>
          <div className="fw-bold text-center">
            <Link to={"/admin-login"} className="text-decoration-none">
              Switch to admin login
            </Link>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default UserLogin;

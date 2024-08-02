import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

function NavBar({ userData,length}) {
  console.log("navbar",length);
  const [name, setName] = useState();

  useEffect(() => {
    setName(userData.username);
  }, [userData]);

  function logout() {
    localStorage.removeItem("userDetails");
    window.location.reload();
  }
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const storedData = localStorage.getItem("userDetails");

  const parsedData = JSON.parse(storedData);

  // const [count, setCount] = useState();

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:8080/cart/getById/${parsedData.userId}`, {
  //       headers: { Authorization: parsedData.token },
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       setCount(response.data.length);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     Happy birthday @Vivekanantha anne,@Sasi & @Yakeshwaran brother  });
  // }, [parsedData.userId]);

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  const handleShowModal = () => setShowModal(true);

  const [data, setData] = useState({
    username: "",
    password: "",
    email: "",
    mobile: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  function getUserDetails() {
    axios
      .get(`http://localhost:8080/user/getByIdForUser/${parsedData.userId}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log("userData", response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // console.log(userData);
    axios
      .put(
        `http://localhost:8080/user/updateByUser/${parsedData.userId}`,
        data,
        { headers: { Authorization: parsedData.token } }
      )
      .then((response) => {
        console.log("userData", response.data);
        setName(response.data.username);
        handleCloseModal();
        toast.success("Updated Successfully!");
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = () => setShowConfirmation(true);

  function handleDelete() {
    axios
      .delete(`http://localhost:8080/user/deleteByUser/${parsedData.userId}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        // console.log("userData", response.data);
        alert(response.data.msg);
        localStorage.removeItem("userDetails");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <Navbar
        expand={"lg"}
        className="bg-body-tertiary mb-5"
        fixed="top"
        bg="dark"
        variant="dark"
        data-bs-theme="dark"
      >
        <Container fluid className="px-sm-4 py-sm-1 px-lg-5 py-lg-2">
          <Navbar.Brand href="#" className="fw-bold">
            Shopping Page
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand-lg`}
            onClick={() => setShow(true)}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
            className="bg-dark text-white"
            show={show}
            onHide={() => setShow(false)}
          >
            <Offcanvas.Header>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                Menu
              </Offcanvas.Title>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column flex-lg-row justify-content-lg-end gap-4">
              <Nav className="gap-4 d-flex align-items-center ">
                <Nav.Link className="text-white" href="/home">
                  Home
                </Nav.Link>
                <Nav.Link className="text-white" href="/cart">
                  <button
                    type="button"
                    class="btn btn-transparent position-relative text-white"
                  >
                    Cart
                    <span
                      style={{ top: "25%" }}
                      class="position-absolute start-100 translate-middle badge rounded-pill bg-danger"
                    >
                      {length}
                    </span>
                  </button>
                </Nav.Link>
                {/* {console.log(userData)} */}
                {name && (
                  <NavDropdown
                    className="text-white fw-bold"
                    title={`Welcome ${name}`}
                    id={`offcanvasNavbarDropdown-expand-lg`}
                    menuVariant="dark"
                  >
                    <NavDropdown.Item>
                      <Link
                        onClick={() => {
                          getUserDetails();
                          handleShowModal();
                        }}
                        className="text-decoration-none text-white d-block"
                      >
                        Edit
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                name="username"
                required
                value={`${data.username}`}
                onChange={handleChange}
              />
              <label for="floatingInput">Username</label>
            </div>
            {console.log(data)}
            <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control"
                id="floatingInput"
                placeholder="password"
                name="password"
                onChange={handleChange}
              />
              <label for="floatingInput">Password</label>
              <i className="m-1">
                Leave blank if you don't want to change password
              </i>
            </div>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                name="email"
                required
                value={`${data.email}`}
                onChange={handleChange}
              />
              <label for="floatingInput">Email</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                name="mobile"
                required
                value={`${data.mobile}`}
                onChange={handleChange}
              />
              <label for="floatingInput">Mobile No</label>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button
                variant="danger"
                className="btn btn-danger px-4 fw-bold"
                onClick={() => {handleCloseModal();handleShowConfirmation();}}
              >
                Deactivate
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete your account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleCloseConfirmation();
              handleDelete();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NavBar;

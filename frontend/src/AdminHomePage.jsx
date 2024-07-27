import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminManageProducts from "./AdminManageProducts";
import AdminManageUser from "./AdminManageUser";
import Categories from "./Categories";
import SubCategories from "./SubCategories";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import AdminManageOrders from "./AdminManageOrders";

function AdminHomePage() {
  const storedData = localStorage.getItem("adminDetails");
  const parsedData = JSON.parse(storedData);

  function logout() {
    localStorage.removeItem("adminDetails");
    window.location.reload();
  }

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  const handleShowModal = () => setShowModal(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [home, setHome] = useState(true);
  const [category, setCategory] = useState(false);
  const [subCategory, setSubCategory] = useState(false);
  const [product, setProduct] = useState(false);
  const [user, setUser] = useState(false);
  const [order,setOrder] = useState(false)

  const [data, setData] = useState({username:"",password:""});
  function getDetails(id) {
    console.log(id);
    axios
      .get(`http://localhost:8080/admin/get/${id}`,{headers:{Authorization:parsedData.token}})
      .then((response) => {
        console.log(response.data,"response");
        setData({ username: response.data, password: "" });
        handleShowModal();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(data);
    axios
      .put(`http://localhost:8080/admin/update/${parsedData.adminId}`, data,{headers:{Authorization:parsedData.token}})
      .then((response) => {
        console.log(response.data);
        handleCloseModal();
        toast.success("Updated successfully");
        setName(response.data.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [name, setName] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/admin/get/${parsedData.adminId}`,{headers:{Authorization:parsedData.token}})
      .then((response) => {
        console.log(response.data);
        setName(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [parsedData.adminId,parsedData.token]);

  function homePage() {
    setProduct(false);
    setUser(false);
    setCategory(false);
    setSubCategory(false);
    setOrder(false)
    setHome(true);
  }

  function categoriesPage() {
    setProduct(false);
    setUser(false);
    setHome(false);
    setSubCategory(false);
    setOrder(false)
    setCategory(true);
  }

  function subCategoriesPage() {
    setProduct(false);
    setUser(false);
    setHome(false);
    setCategory(false);
    setOrder(false)
    setSubCategory(true);
  }

  function productPage() {
    setHome(false);
    setCategory(false);
    setUser(false);
    setSubCategory(false);
    setOrder(false)
    setProduct(true);
  }

  function userPage() {
    setHome(false);
    setCategory(false);
    setProduct(false);
    setSubCategory(false);
    setOrder(false)
    setUser(true);
  }

  function orderPage() {
    setHome(false);
    setCategory(false);
    setProduct(false);
    setSubCategory(false);
    setUser(false);
    setOrder(true)
  }

  return (
    <div>
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
              Admin Dashboard
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
                <Nav className="gap-4">
                  <Nav.Link className="text-white" href="/admin-home">Home</Nav.Link>
                  {/* <Nav.Link className="text-white" href="/manage-users">
                    Users
                  </Nav.Link>
                  <Nav.Link className="text-white" href="/products">
                    Products
                  </Nav.Link> */}
                  {name && (
                    <NavDropdown
                      className="text-white fw-bold"
                      title={`Welcome ${name}`}
                      id={`offcanvasNavbarDropdown-expand-lg`}
                      menuVariant="dark"
                    >
                      <NavDropdown.Item>
                        <Link
                          className="text-decoration-none text-white d-block"
                          onClick={() => getDetails(parsedData.adminId)}
                        >
                          Edit
                        </Link>
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={logout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                  {data && (
                    <Modal show={showModal} onHide={handleCloseModal}>
                      <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">
                          Edit profile
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              class="form-control"
                              id="floatingInput"
                              placeholder="name@example.com"
                              required
                              value={data.username}
                              onChange={(e) =>
                                setData({ ...data, username: e.target.value })
                              }
                            />
                            <label for="floatingInput">Username</label>
                          </div>
                          {console.log(data.password)}
                          <div class="form-floating mb-3">
                            <input
                              type="password"
                              class="form-control"
                              id="floatingPassword"
                              placeholder="Password"
                              value={data.password}
                              onChange={(e) =>
                                setData({ ...data, password: e.target.value })
                              }
                            />
                            <label for="floatingPassword">Password</label>
                            <i className="m-1">
                              Leave blank if you don't want to change password
                            </i>
                          </div>

                          <Modal.Footer>
                            <Button
                              variant="secondary"
                              onClick={handleCloseModal}
                            >
                              Close
                            </Button>
                            <Button variant="primary" type="submit">
                              Save Changes
                            </Button>
                          </Modal.Footer>
                        </Form>
                      </Modal.Body>
                    </Modal>
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
      </div>
      <div
        className="container-fluid"
        style={{ backgroundColor: "rgb(208,209,211)" }}
      >
        <div className="row">
          <div className="col-2 p-0" style={{ height: "89vh" }}>
            <div
              style={{
                width: "14rem",
                position: "fixed",
                top: "12%",
                backgroundColor: "rgb(208,209,211)",
              }}
            >
              <div>
                <ul class="list-group list-group-flush">
                  <li
                    class={`list-group-item border border-1 p-3 btn-outline-primary fs-5 fw-500 d-flex gap-2 ${
                      home ? "bg-primary" : ""
                    }`}
                    style={{ color: home ? "white" : "" }}
                    type="button"
                    onClick={homePage}
                  >
                    <i class="bi bi-house-door-fill"></i>
                    <span>Home</span>
                  </li>
                  <li
                    class={`list-group-item border border-1 p-3 btn-outline-primary fs-5 fw-500 d-flex gap-2 ${
                      category ? "bg-primary" : ""
                    }`}
                    style={{ color: category ? "white" : "" }}
                    type="button"
                    onClick={categoriesPage}
                  >
                    <i class="bi bi-list-ul"></i>
                    <span>Categories</span>
                  </li>
                  <li
                    class={`list-group-item border border-1 p-3 btn-outline-primary fs-5 fw-500 d-flex gap-2 ${
                      subCategory ? "bg-primary" : ""
                    }`}
                    style={{ color: subCategory ? "white" : "" }}
                    type="button"
                    onClick={subCategoriesPage}
                  >
                    <i class="bi bi-list-nested"></i>
                    <span>Sub Categories</span>
                  </li>
                  <li
                    class={`list-group-item border border-1 p-3 btn-outline-primary fs-5 fw-500 d-flex gap-2 ${
                      product ? "bg-primary" : ""
                    }`}
                    style={{ color: product ? "white" : "" }}
                    type="button"
                    onClick={productPage}
                  >
                    <i class="bi bi-cart4"></i>
                    <span>Products</span>
                  </li>
                  <li
                    class={`list-group-item border border-1 p-3 btn-outline-primary fs-5 fw-500 d-flex gap-2 ${
                      user ? "bg-primary" : ""
                    }`}
                    style={{ color: user ? "white" : "" }}
                    type="button"
                    onClick={userPage}
                  >
                    <i class="bi bi-people-fill"></i>
                    <span>Users</span>
                  </li>
                  <li
                    class={`list-group-item border border-1 p-3 btn-outline-primary fs-5 fw-500 d-flex gap-2 ${
                      order ? "bg-primary" : ""
                    }`}
                    style={{ color: order ? "white" : "" }}
                    type="button"
                    onClick={orderPage}
                  >
                    <i class="bi bi-currency-rupee"></i>
                    <span>Orders</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="col-10 p-5"
            style={{ backgroundColor: "rgb(220,220,220)", marginTop: "5%" }}
          >
            {home ? (
              <div className="p-2 p-md-5 bg-light">
                <h1 className="fw-bold" style={{ fontSize: "1.5rem" }}>
                  Welcome back administrator!!
                </h1>
              </div>
            ) : category ? (
              <Categories />
            ) : subCategory ? (
              <SubCategories />
            ) : product ? (
              <AdminManageProducts />
            ) : user ? (
              <AdminManageUser />
            ) : order ? (
              <AdminManageOrders />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;

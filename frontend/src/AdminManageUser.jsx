import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

function AdminManageUser() {
  const [data, setData] = useState();
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [id, setId] = useState();

  const [show, setShow] = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  const handleCloseAdd = () => setShowAdd(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const handleShowAdd = () => setShowAdd(true);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseConfirm = () => setShowConfirm(false);

  const handleShowConfirm = () => setShowConfirm(true);

  const storedData = localStorage.getItem("adminDetails");
  const parsedData = JSON.parse(storedData);
  console.log(parsedData);

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    mobile: "",
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  }

  const [idForDelete,setIdForDelete] = useState()

  function handleDelete() {
    axios
      .delete(`http://localhost:8080/user/deleteByAdmin/${idForDelete}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        // console.log("userData", response.data);
        handleCloseConfirm()
        toast.success(response.data.msg);
        setData(data.filter((user) => response.data.data._id !== user._id))
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getUserDetails(id) {
    axios
      .get(`http://localhost:8080/user/getByIdForAdmin/${id}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log("userData", response.data);
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleSubmit() {
    console.log(id, "iddd");
    axios
      .put(`http://localhost:8080/user/updateByAdmin/${id}`, userData, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log("userData", response.data);
        handleClose()
        toast.success("User Updated Successfully!");
        setData(
          data.map((user) => {
            if (response.data._id === user._id) {
              return response.data;
            } else {
              return user;
            }
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleSubmit1(e) {
    e.preventDefault();
    console.log(userData);
    axios
      .post("http://localhost:8080/user/set", userData)
      .then((response) => {
        console.log(response);
        console.log(response.status, "status");
        if (response.status === 200) {
          if (response.data.status === true) {
            handleCloseAdd()
            toast.success("User Account created successfully");
            setData([...data, response.data.data]);
          } else {
            toast.error(response.data.msg);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  useEffect(() => {
    if (name !== "") {
      axios
        .get(`http://localhost:8080/user/searchByName/${name}`, {
          headers: { Authorization: parsedData.token },
        })
        .then((response) => {
          console.log(response.data);
          setData(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      axios
        .get(`http://localhost:8080/user/findByPage/${page}`, {
          headers: { Authorization: parsedData.token },
        })
        .then((response) => {
          console.log(response.data);
          setData(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [name, parsedData.token, page]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/findBySize/${size}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [size, parsedData.token]);
  return (
    <div className="container-fluid bg-white">
      <div className="container p-4">
        <div className="d-flex justify-content-between">
          <h3 className="fw-bold">User Details</h3>
          <div className="d-flex gap-4 align-items-baseline">
            <div>
              <button
                className="bg-primary border-0 text-white py-1 px-3"
                onClick={handleShowAdd}
              >
                <span className="fw-bold">Add User</span>
                <span className="fw-bold"> +</span>
              </button>
              <Modal show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                  <Modal.Title className="fw-bold">Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleSubmit1}>
                    <div class="form-floating mb-3">
                      <input
                        type="text"
                        class="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        name="username"
                        required
                        onChange={handleChange}
                      />
                      <label for="floatingInput">Username</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input
                        type="password"
                        class="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        name="password"
                        required
                        onChange={handleChange}
                      />
                      <label for="floatingPassword">Password</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input
                        type="email"
                        class="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        name="email"
                        required
                        onChange={handleChange}
                      />
                      <label for="floatingInput">Email</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input
                        type="text"
                        class="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        name="mobile"
                        required
                        onChange={handleChange}
                      />
                      <label for="floatingPassword">Mobile No</label>
                    </div>
                    <Modal.Footer>
                      <button
                        type="button"
                        class="btn btn-secondary"
                        onClick={handleCloseAdd}
                      >
                        Close
                      </button>
                      <button type="submit" class="btn btn-primary">
                        Submit
                      </button>
                    </Modal.Footer>
                  </form>
                </Modal.Body>
              </Modal>
            </div>
            <div className="d-flex gap-1 align-items-baseline">
              <span>show</span>
              <select
                className="align-self-start"
                onChange={(e) => setSize(e.target.value)}
                style={{ outline: "0" }}
              >
                <option value="5" selected>
                  5
                </option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
              <span>entries</span>
            </div>
            <div>
              <input
                type="search"
                class="form-control form-control-sm border border-dark"
                placeholder="Search"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="table-responsive mt-3">
          <table class="table table-light table-hover table-bordered align-middle border">
            <thead className="border border-2">
              <tr className="border border-2 text-center">
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Mobile No</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="border border-2">
              {Array.isArray(data) &&
                data.map((user, i) => (
                  <tr className="border border-2 text-center" key={user._id}>
                    <th scope="row">{i + 1}</th>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td className="d-flex gap-3 justify-content-center">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                          setId(user._id);
                          getUserDetails(user._id);
                          handleShow();
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => {handleShowConfirm();setIdForDelete(user._id)}}
                      >
                        Delete
                      </button>
                      <Modal show={showConfirm} onHide={handleCloseConfirm}>
                        <Modal.Header closeButton>
                          <Modal.Title className="fw-bold">Confirmation?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div>
                            <p>Are you sure to delete this user?</p>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                           <Button variant="success" onClick={handleCloseConfirm}>Cancel</Button>
                           <Button variant="danger" onClick={handleDelete}>Confirm</Button>
                        </Modal.Footer>
                      </Modal>
                    </td>
                  </tr>
                ))}
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title className="fw-bold">Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form>
                    <div class="form-floating mb-3">
                      <input
                        type="text"
                        class="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        name="username"
                        value={`${userData.username}`}
                        onChange={handleChange}
                      />
                      <label for="floatingInput">Username</label>
                    </div>
                    {/* <div class="form-floating">
                      <input
                        type="password"
                        class="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={userData.password}
                      />
                      <label for="floatingPassword">Password</label>
                      <i className="mt-2 mb-3 d-block">
                        Leave blank if you don't want to change password
                      </i>
                    </div> */}
                    <div class="form-floating mb-3">
                      <input
                        type="email"
                        class="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        name="email"
                        value={`${userData.email}`}
                        onChange={handleChange}
                      />
                      <label for="floatingInput">Email</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input
                        type="text"
                        class="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        name="mobile"
                        onChange={handleChange}
                        value={userData.mobile}
                      />
                      <label for="floatingPassword">Mobile No</label>
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleClose();
                      setTimeout(handleSubmit, 100);
                    }}
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </tbody>
          </table>
        </div>
        <nav aria-label="Page navigation example" className="d-inline">
          <ul class="pagination justify-content-center">
            <li className={`page-item`}>
              <button
                className={`page-link ${page === 1 ? "disabled" : ""}`}
                onClick={() => setPage(page - 1)}
                tabindex="-1"
                aria-disabled="true"
              >
                Previous
              </button>
            </li>
            <li class="page-item" onClick={() => setPage(1)}>
              <button class="page-link" href="#">
                1
              </button>
            </li>
            <li class="page-item" onClick={() => setPage(2)}>
              <button class="page-link" href="#">
                2
              </button>
            </li>
            <li class="page-item" onClick={() => setPage(3)}>
              <button class="page-link" href="#">
                3
              </button>
            </li>
            <li className={`page-item`}>
              <button
                className={`page-link ${page === 3 ? "disabled" : ""}`}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default AdminManageUser;

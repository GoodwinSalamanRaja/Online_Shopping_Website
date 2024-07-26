import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

function Categories() {
  const storedData = localStorage.getItem("adminDetails");
  const parsedData = JSON.parse(storedData);

  const [category, setCategory] = useState();

  const [show, setShow] = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  const handleCloseAdd = () => setShowAdd(false);

  const handleClose = () => setShow(false);

  const [data, setData] = useState();

  const handleShow = () => setShow(true);

  const handleShowAdd = () => setShowAdd(true);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(category);
    axios
      .post(`http://localhost:8080/category/set/${category}`, "", {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          toast.success("Category added successfully");
          handleCloseAdd();
          setData([...data, response.data]);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [name, setName] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/category/searchByCategory/${encodeURIComponent(
          name || " "
        )}`,
        { headers: { Authorization: parsedData.token } }
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [name, parsedData.token]);

  const [updateData, setUpdateData] = useState({ name: "" });

  function getCategoryDetails(id) {
    axios
      .get(`http://localhost:8080/category/getById/${id}`,{ headers: { Authorization: parsedData.token } })
      .then((response) => {
        console.log(response.data);
        setUpdateData({ ...updateData, name: response.data.category });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [id, setId] = useState();

  function handleUpdateSubmit(e) {
    e.preventDefault();
    console.log(updateData);
    axios
      .put(`http://localhost:8080/category/update/${id}/${updateData.name}`,"",{ headers: { Authorization: parsedData.token } })
      .then((response) => {
        console.log(response.data);
        handleClose();
        toast.success("Category updated successfully");
        setData(
          data.map((name) => {
            if (id === name._id) {
              return response.data;
            } else {
              return name;
            }
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    axios
      .get("http://localhost:8080/category/get",{ headers: { Authorization: parsedData.token } })
      .then((response) => {
        console.log(response.data,"jdffffffffk");
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <div className="container-fluid bg-white">
        <div className="container p-4">
          <div className="d-flex justify-content-between">
            <h3 className="fw-bold">Categories list</h3>
            <div className="d-flex gap-4 align-items-baseline">
              <div>
                <button
                  className="bg-primary border-0 text-white py-1 px-3"
                  onClick={handleShowAdd}
                >
                  <span className="fw-bold">Add Category</span>
                  <span className="fw-bold"> +</span>
                </button>
                <Modal show={showAdd} onHide={handleCloseAdd}>
                  <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Add Categeory</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={handleSubmit}>
                      <div class="form-floating mb-3">
                        <input
                          type="text"
                          class="form-control"
                          id="floatingInput"
                          placeholder="name@example.com"
                          required
                          pattern=".*\S+.*"
                          title="Type something"
                          onChange={(e) => setCategory(e.target.value)}
                        />
                        <label for="floatingInput">Name</label>
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
                  <th scope="col" className="border border-2">
                    #
                  </th>
                  <th scope="col" className="border border-2">
                    Category
                  </th>
                  <th scope="col" className="border border-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="border border-2">
                {Array.isArray(data) &&
                  data.map((item, i) => (
                    <tr className="border border-2 text-center" key={item._id}>
                      <th scope="row" className="border border-2">
                        {i + 1}
                      </th>
                      <td className="border border-2">{item.category}</td>
                      <td className="d-flex justify-content-center">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => {
                            setId(item._id);
                            getCategoryDetails(item._id);
                            handleShow();
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                {updateData && (
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title className="fw-bold">
                        Edit categeory
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <form onSubmit={handleUpdateSubmit}>
                        <div class="form-floating mb-3">
                          <input
                            type="text"
                            class="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            name="username"
                            required
                            pattern=".*\S+.*"
                            title="Type something"
                            value={updateData.name}
                            onChange={(e) => {
                              console.log(updateData);
                              setUpdateData({ name: e.target.value });
                            }}
                          />
                          <label for="floatingInput">Name</label>
                        </div>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="primary" type="submit">
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </form>
                    </Modal.Body>
                  </Modal>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;

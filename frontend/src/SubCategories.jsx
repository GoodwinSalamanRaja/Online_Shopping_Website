import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";

function SubCategories() {
  const storedData = localStorage.getItem("adminDetails");
  const parsedData = JSON.parse(storedData);

  const [category, setCategory] = useState();

  const [subCategory, setSubCategory] = useState();

  const [show, setShow] = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  const handleCloseAdd = () => setShowAdd(false);

  const handleClose = () => setShow(false);

  const [data, setData] = useState();

  const handleShow = () => setShow(true);

  const handleShowAdd = () => setShowAdd(true);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(category, subCategory);
    axios
      .put(
        `http://localhost:8080/category/setToCategory/${category}/${subCategory}`,"",
        {headers:{Authorization:parsedData.token}}
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          toast.success("Sub-Category added successfully");
          handleCloseAdd();
          getWithSubcategory();
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
        `http://localhost:8080/category/searchByCategoryAndSubCategory/${encodeURIComponent(
          name || " "
        )}`,{headers:{Authorization:parsedData.token}}
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [name]);

  const [updateData, setUpdateData] = useState({
    category: "",
    subCategory: "",
  });

  function getCategoryDetails(id, name) {
    axios
      .get(
        `http://localhost:8080/category/getByIdWithSubCategory/${id}/${name}`,{headers:{Authorization:parsedData.token}}
      )
      .then((response) => {
        console.log("id", response.data);
        // console.log(response.data.subcategory[0].name);
        setUpdateData({
          ...updateData,
          category: response.data.category.category,
          subCategory: response.data.subCategory[0].name,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [categoryId, setCategoryId] = useState();

  const [subCategoryId, setSubCategoryId] = useState();

  function handleUpdateSubmit(e) {
    e.preventDefault()
    console.log(updateData);
    axios
      .put(
        `http://localhost:8080/category/updateWithSubCategory/${categoryId}/${subCategoryId}/${updateData.category}/${updateData.subCategory}`,"",
        {headers:{Authorization:parsedData.token}}
      )
      .then((response) => {
        console.log(response.data);
        handleClose();
        toast.success("Category updated successfully");
        getWithSubcategory();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [categoryData, setCategoryData] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:8080/category/get",{headers:{Authorization:parsedData.token}})
      .then((response) => {
        console.log(response.data);
        setCategoryData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    getWithSubcategory();
  }, []);

  function getWithSubcategory() {
    axios
      .get("http://localhost:8080/category/getWithSubCategory",{headers:{Authorization:parsedData.token}})
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (Array.isArray(categoryData) && categoryData.length > 0) {
      setCategory(categoryData[0].category);
    }
  }, [categoryData]);

  return (
    <div>
      <div className="container-fluid bg-white">
        <div className="container p-4">
          <div className="d-flex justify-content-between">
            <h3 className="fw-bold">Sub-Categories list</h3>
            <div className="d-flex gap-4 align-items-baseline">
              <div>
                <button
                  className="bg-primary border-0 text-white py-1 px-3"
                  onClick={handleShowAdd}
                >
                  <span className="fw-bold">Add Sub-Category</span>
                  <span className="fw-bold"> +</span>
                </button>
                <Modal show={showAdd} onHide={handleCloseAdd}>
                  <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">
                      Add Sub-Category
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={handleSubmit}>
                      <div class="form-floating mb-3">
                        <Form.Select
                          aria-label="Default select example"
                          onChange={(e) => {
                            console.log("chng", e.target.value);
                            setCategory(e.target.value);
                          }}
                        >
                          {Array.isArray(categoryData) &&
                            categoryData.map((data) => (
                              <option key={data._id} value={data.category}>
                                {data.category}
                              </option>
                            ))}
                        </Form.Select>
                      </div>
                      <div class="form-floating mb-3">
                        <input
                          type="text"
                          class="form-control"
                          id="floatingInput"
                          placeholder="name@example.com"
                          required
                          pattern=".*\S+.*"
                          title="Type something"
                          onChange={(e) => setSubCategory(e.target.value)}
                        />
                        <label for="floatingInput">Name</label>
                      </div>
                      <div class="modal-footer">
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
                      </div>
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
          <hr className="my-2" />
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
                    Sub-Category
                  </th>
                  <th scope="col" className="border border-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="border border-2">
                {Array.isArray(data) &&
                  data.map((item, i) =>
                    item.subcategory.map((sub, j) => (
                      <tr
                        className="border border-2 text-center h-100"
                        key={sub._id}
                      >
                        <th scope="row" className="border border-2">
                          {i + 1}.{j + 1}
                        </th>
                        <td className="border border-2 fw-bold">
                          {item.category}
                        </td>
                        <td className="border border-2">{sub.name}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setCategoryId(item._id);
                              setSubCategoryId(sub._id);
                              getCategoryDetails(item._id, sub.name);
                              handleShow();
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                {updateData && (
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title className="fw-bold">
                        Edit Sub-Categeory
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <form onSubmit={handleUpdateSubmit}>
                        <div class="form-floating mb-3">
                          <Form.Select
                            aria-label="Default select example"
                            required
                            value={updateData.category}
                            onChange={(e) => {
                              console.log("chng", e.target.value);
                              setUpdateData({
                                ...updateData,
                                category: e.target.value,
                              });
                            }}
                          >
                            {Array.isArray(categoryData) &&
                              categoryData.map((data) => (
                                <option key={data._id} value={data.category}>
                                  {data.category}
                                </option>
                              ))}
                          </Form.Select>
                        </div>
                        <div class="form-floating mb-3">
                          {console.log(updateData.subCategory)}
                          <input
                            type="text"
                            class="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            required
                            pattern=".*\S+.*"
                            title="Type something"
                            value={updateData.subCategory}
                            onChange={(e) => {
                              console.log(updateData);
                              setUpdateData({
                                ...updateData,
                                subCategory: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                          >
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

export default SubCategories;

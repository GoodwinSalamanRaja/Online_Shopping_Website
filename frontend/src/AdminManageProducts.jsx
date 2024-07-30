import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function AdminManageProducts() {
  const [data, setData] = useState({
    name: "",
    price: "",
    category: "",
    subCategory: "",
    quantity: "",
    description: "",
    image: "",
  });

  const [file, setFile] = useState(null);

  const [categories, setCategories] = useState();

  const [subCategories, setSubCategories] = useState();

  const [category, setCategory] = useState();
  const [subCategory, setSubCategory] = useState();
  const storedData = localStorage.getItem("adminDetails");
  const parsedData = JSON.parse(storedData);
  const [products, setProducts] = useState();

  const [id, setId] = useState();

  const [show, setShow] = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  const handleCloseAdd = () => setShowAdd(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const handleShowAdd = () => setShowAdd(true);

  useEffect(() => {
    // axios
    //   .get("http://localhost:8080/product/list", {
    //     headers: { Authorization: parsedData.token },
    //   })
    //   .then((response) => {
    //     console.log("products", response.data);
    //     console.log(response.data.slice().reverse());
    //     setProducts(response.data.slice().reverse());
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    axios
      .get("http://localhost:8080/category/get", {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log("category", response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });  
  }, []);  
  
  useEffect(() => {
    console.log("category", category);
    axios
      .get(`http://localhost:8080/category/getByCategoryAdmin/${category}`,{
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log("category", response.data);
        setSubCategories(response.data.subcategory);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category]);
  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  function handleChangeUpdate(e) {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  }

  const [error, setError] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    console.log(data);
    if (data.category === "") {
      setError({ ...error, category: "Category field is required" });
    } else if (data.subCategory === "") {
      setError({
        ...error,
        subCategory: "Sub-Category field is required",
        category: "",
      });
    } else if (data.category === "" && data.subCategory === "") {
      setError({
        ...error,
        category: "Sub-Category field is required",
        subCategory: "Sub-Category field is required",
      });
    } else {
      setError({
        ...error,
        category: "",
        subCategory: "",
      });
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);
      formData.append("description", data.description);
      formData.append("image", data.image);
      console.log("formdata", formData);
      axios
        .post("http://localhost:8080/product/set", formData, {
          headers: { Authorization: parsedData.token },
        })
        .then((response) => {
          setData({ ...data, image: null });
          console.log("products", response.data);
          handleCloseAdd();
          toast.success("Product added successfully");
          setProducts([response.data,...products]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  const [image, setImage] = useState(null);
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    item: "",
    quantity: "",
    description: "",
    image: "",
  });

  function getProductDetails(id, categoryName) {
    setCategory(categoryName);
    axios
      .get(`http://localhost:8080/product/getById/${id}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log("singleProduct", response.data);
        setProductData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleUpdateSubmit(e) {
    e.preventDefault();
    console.log(productData);
    console.log(image);
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("category", productData.category);
    formData.append("subcategory", productData.subcategory);
    formData.append("item", productData.item);
    formData.append("price", productData.price);
    formData.append("quantity", productData.quantity);
    formData.append("description", productData.description);
    formData.append("image", image);
    console.log("formdata", formData);
    axios
      .put(`http://localhost:8080/product/update/${id}`, formData, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        handleClose();
        console.log("products", response.data);
        toast.success("Product updated successfully");
        setProducts(
          products.map((product) => {
            console.log(product);
            if (product._id === id) {
              return response.data;
            } else {
              return product;
            }
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [name, setName] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/product/getBySearch/${encodeURIComponent(
          name || " "
        )}`,
        {
          headers: { Authorization: parsedData.token },
        }
      )
      .then((response) => {
        console.log("search Product", response.data);
        setProducts(response.data.reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  }, [name]);

  return (
    <div>
      <div className="container-fluid">
        <div className="container p-4" style={{ backgroundColor: "white" }}>
          <div className="d-flex justify-content-between align-items-baseline">
            <h4 className="fw-bold">Manage Products</h4>
            <div className="d-flex">
              <div>
                <input
                  type="search"
                  class="form-control border border-dark w-75"
                  id="exampleFormControlInput1"
                  placeholder="Search..."
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <button
                className="bg-primary border-0 text-white py-1 px-3"
                onClick={handleShowAdd}
              >
                <span className="fw-bold">New Entries</span>
                <span className="fw-bold"> +</span>
              </button>
            </div>
          </div>
          <hr className="mt-2" />
          <Modal show={showAdd} onHide={handleCloseAdd}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Add products</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div class="form-floating mb-3">
                  <input
                    type="text"
                    class="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name="name"
                    required
                    pattern=".*\S+.*"
                    title="Type something"
                    onChange={handleChange}
                  />
                  <label for="floatingInput">Name</label>
                </div>
                <div className="mb-3">
                  <select
                    class="form-select form-select-md"
                    aria-label=".form-select-sm example"
                    name="category"
                    required
                    onChange={(e) => {
                      setCategory(e.target.value);
                      handleChange(e);
                    }}
                  >
                    <option selected disabled>
                      Select category
                    </option>
                    {Array.isArray(categories) &&
                      categories.map((item) => (
                        <option value={item.category} key={item._id}>
                          {item.category}
                        </option>
                      ))}
                  </select>
                  <p className="text-danger m-1">{error.category}</p>
                </div>
                <div className="mb-3">
                  <select
                    class="form-select form-select-md"
                    aria-label=".form-select-sm example"
                    name="subCategory"
                    required
                    onChange={(e) => {
                      setSubCategory(e.target.value);
                      handleChange(e);
                    }}
                  >
                    <option selected disabled>
                      Select Sub-Category
                    </option>
                    {Array.isArray(subCategories) &&
                      subCategories.map((data) => (
                        <option key={data._id} value={data.name}>{data.name}</option>
                      ))}
                  </select>
                  <p className="text-danger m-1">{error.subCategory}</p>
                </div>
                <div class="form-floating mb-3">
                  <input
                    type="text"
                    class="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="price"
                    min={"1"}
                    pattern="[1-9]\d*(\.\d+)?"
                    title="Enter only numbers"
                    required
                    onChange={handleChange}
                  />
                  <label for="floatingPassword">Price</label>
                </div>
                <div class="form-floating mb-3">
                  <input
                    type="text"
                    class="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="quantity"
                    required
                    min="1"
                    pattern="[1-9]\d*"
                    title="Please enter a whole number"
                    onChange={handleChange}
                  />
                  <label for="floatingPassword">Quantity</label>
                </div>
                <div class="form-floating mb-3">
                  <textarea
                    class="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                    name="description"
                    required
                    pattern=".*\S+.*"
                    title="Type something"
                    onChange={handleChange}
                  ></textarea>
                  <label for="floatingTextarea">Description</label>
                </div>
                <div class="input-group">
                  <input
                    type="file"
                    accept="image/*"
                    class="form-control"
                    id="inputGroupFile04"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="Upload"
                    name="image"
                    required
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      console.log("file", selectedFile);
                      if (
                        selectedFile &&
                        selectedFile.type.startsWith("image/")
                      ) {
                        setError({ ...error, image: "" });
                        setFile(selectedFile);
                        console.log("fileeee", file);
                      } else {
                        setError({ ...error, image: "Choose image alone" });
                        setFile(null);
                      }
                    }}
                  />
                  <button
                    class="btn btn-outline-success"
                    type="button"
                    id="inputGroupFileAddon04"
                    onClick={() => {
                      console.log("file", file);
                      setData({ ...data, image: file });
                    }}
                  >
                    Upload
                  </button>
                  <button
                    class="btn btn-outline-danger"
                    type="button"
                    id="inputGroupFileAddon04"
                    onClick={() => {
                      setData({ ...data, image: null });
                    }}
                  >
                    Remove
                  </button>
                </div>
                <p className="text-danger mx-2 my-1">{error.image}</p>
                {data.image && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(data.image)}
                      alt="not found"
                      height={"150px"}
                    />
                  </div>
                )}
                <Modal.Footer>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    onClick={handleCloseAdd}
                  >
                    Close
                  </button>
                  <button type="submit" class="btn btn-primary">
                    Save
                  </button>
                </Modal.Footer>
              </form>
            </Modal.Body>
          </Modal>
          <div className="table-responsive mt-3">
            <table class="table table-light table-hover table-bordered align-middle border border-2">
              <thead className="border border-2">
                <tr className="border border-2 text-center">
                  <th scope="col">#</th>
                  <th scope="col">Image</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Sub-category</th>
                  <th scope="col">Item</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Description</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="border border-2">
                {Array.isArray(products) &&
                  products.map((data, i) => (
                    <tr className="border border-2 text-center" key={data._id}>
                      <th scope="row" className="border border-2 text-center">
                        {i + 1}
                      </th>
                      <td className="border border-2 text-center">
                        <img
                          src={`http://localhost:8080/public/${data.image}`}
                          alt="not found"
                          height={"100px"}
                        />
                      </td>
                      <td className="border border-2 text-center">
                        {data.name}
                      </td>
                      <td className="border border-2 text-center">
                        {data.category}
                      </td>
                      <td className="border border-2 text-center">
                        {data.subcategory}
                      </td>
                      <td className="border border-2 text-center">
                        {data.item}
                      </td>
                      <td className="border border-2 text-center">
                        {data.price}
                      </td>
                      <td className="border border-2 text-center">
                        {data.quantity}
                      </td>
                      <td className="border border-2 text-center">
                        {data.description}
                      </td>
                      <td className="border border-2 text-center">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => {
                            setId(data._id);
                            getProductDetails(data._id, data.category);
                            handleShow();
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                {productData && (
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title className="fw-bold">
                        Edit Product
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
                            name="name"
                            required
                            pattern=".*\S+.*"
                            title="Type something"
                            value={productData.name}
                            onChange={handleChangeUpdate}
                          />
                          <label for="floatingInput">Name</label>
                        </div>
                        <div className="mb-3">
                          <select
                            class="form-select form-select-md"
                            aria-label=".form-select-sm example"
                            name="category"
                            required
                            value={productData.category}
                            onChange={(e) => {
                              setCategory(e.target.value);
                              handleChangeUpdate(e);
                            }}
                          >
                            {Array.isArray(categories) &&
                              categories.map((data) => (
                                <option key={data._id} value={data.category}>
                                  {data.category}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          {console.log(productData.subcategory)}
                          <select
                            class="form-select form-select-md"
                            name="subcategory"
                            value={productData.subcategory}
                            onChange={(e) => {
                              setSubCategory(e.target.value);
                              handleChangeUpdate(e);
                            }}
                          >
                            {console.log(subCategories)}
                            {/* {console.log(productData.subcategory)}
                            {console.log(category)} */}
                            {Array.isArray(subCategories) &&
                              subCategories.map((data) => (
                                <option key={data._id} value={data.name}>
                                  {data.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div class="form-floating mb-3">
                          <input
                            type="text"
                            class="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            name="price"
                            min={"1"}
                            pattern="[1-9]\d*(\.\d+)?"
                            value={productData.price}
                            onChange={handleChangeUpdate}
                          />
                          <label for="floatingPassword">Price</label>
                        </div>
                        <div class="form-floating mb-3">
                          <input
                            type="text"
                            class="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            name="quantity"
                            min={"1"}
                            pattern="[1-9]\d*"
                            value={productData.quantity}
                            onChange={handleChangeUpdate}
                          />
                          <label for="floatingPassword">Quantity</label>
                        </div>
                        <div class="form-floating mb-3">
                          <textarea
                            class="form-control"
                            placeholder="Leave a comment here"
                            id="floatingTextarea"
                            name="description"
                            required
                            pattern=".*\S+.*"
                            title="Type something"
                            value={productData.description}
                            onChange={handleChangeUpdate}
                          ></textarea>
                          <label for="floatingTextarea">Description</label>
                        </div>
                        <div class="input-group">
                          <input
                            type="file"
                            accept="image/*"
                            class="form-control"
                            id="inputGroupFile04"
                            aria-describedby="inputGroupFileAddon04"
                            aria-label="Upload"
                            name="image"
                            onChange={(e) => (file = e.target.files[0])}
                          />
                          <button
                            class="btn btn-outline-success"
                            type="button"
                            id="inputGroupFileAddon04"
                            onClick={() => {
                              setImage(file);
                            }}
                          >
                            Upload
                          </button>
                          <button
                            class="btn btn-outline-danger"
                            type="button"
                            id="inputGroupFileAddon04"
                            onClick={() => {
                              setProductData({ ...productData, image: null });
                              setImage(null);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        {productData.image && (
                          <div className="text-center">
                            <img
                              src={`http://localhost:8080/public/${productData.image}`}
                              alt="not found"
                              height={"150px"}
                            />
                          </div>
                        )}
                        {image && (
                          <div className="text-center">
                            <img
                              src={URL.createObjectURL(image)}
                              alt="not found"
                              height={"150px"}
                            />
                          </div>
                        )}
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button type="submit" variant="primary">
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

export default AdminManageProducts;

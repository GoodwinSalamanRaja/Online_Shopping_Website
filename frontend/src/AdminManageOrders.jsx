import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function AdminManageOrders() {
  const storedData = localStorage.getItem("adminDetails");
  const parsedData = JSON.parse(storedData);

  const [products, setProducts] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:8080/cart/get", {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [userData, setUserData] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/cart/search/${encodeURIComponent(name || " ")}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
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
            <h4 className="fw-bold">Orders list</h4>
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
            </div>
          </div>
          <hr className="mt-2" />
          <div className="table-responsive mt-3">
            <table class="table table-light table-hover table-bordered align-middle border border-2">
              <thead className="border border-2">
                <tr className="border border-2 text-center">
                  <th scope="col" className="border border-2 text-nowrap">
                    #
                  </th>
                  <th scope="col" className="border border-2 text-nowrap">
                    Image
                  </th>
                  <th scope="col" className="border border-2 text-nowrap">
                    Product Name
                  </th>
                  <th scope="col" className="border border-2 text-nowrap">
                    Category
                  </th>
                  <th scope="col" className="border border-2 text-nowrap">
                    Sub-category
                  </th>
                  <th scope="col" className="border border-2 text-nowrap">
                    Price
                  </th>
                  <th scope="col" className="border border-2 text-nowrap">
                    Quantity
                  </th>
                  <th scope="col" className="border border-2 text-nowrap">
                    Total
                  </th>
                  <th scope="col" className="border border-2 text-nowrap">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="border border-2 text-nowrap"
                    style={{ minWidth: "220px" }}
                  >
                    Description
                  </th>
                  <th scope="col" className="border border-2 text-nowrap">
                    Buyer Details
                  </th>
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
                        {data.price}
                      </td>
                      <td className="border border-2 text-center">
                        {data.cartQuantity}
                      </td>
                      <td className="border border-2 text-center">
                        {data.total}
                      </td>
                      <td className="border border-2 text-center text-nowrap">
                        <span
                          className={`${
                            data.status === "Sold"
                              ? "btn btn-success"
                              : "btn btn-secondary"
                          } fw-bold`}
                        >
                          {data.status}
                        </span>
                      </td>
                      <td className="border border-2 text-center">
                        {data.description}
                      </td>
                      <td className="border border-2 text-center">
                        <Button
                          variant="primary"
                          className="text-nowrap"
                          onClick={() => {
                            setUserData(data.userId);
                            handleShow();
                          }}
                        >
                          View Buyer Details
                        </Button>
                        {userData && (
                          <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                              <Modal.Title className="fw-bold">
                                Buyer Details
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="d-flex flex-column gap-1">
                                <div className="d-flex gap-1">
                                  <span>Name :</span>
                                  <span className="fw-bold">
                                    {userData.username}
                                  </span>
                                </div>
                                <div className="d-flex gap-1">
                                  <span>Email :</span>
                                  <span className="fw-bold">
                                    {userData.email}
                                  </span>
                                </div>
                                <div className="d-flex gap-1">
                                  <span>Contact No :</span>
                                  <span className="fw-bold">
                                    {userData.mobile}
                                  </span>
                                </div>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminManageOrders;

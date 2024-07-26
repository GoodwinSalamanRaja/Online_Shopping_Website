import NavBar from "./NavBar";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import WebMetamask from "./WebMetamask";
import Spinner from "react-bootstrap/Spinner";

function Cart({length}) {
  const storedData = localStorage.getItem("userDetails");

  const parsedData = JSON.parse(storedData);

  const [userData, setUserData] = useState();

  const [products, setProducts] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/getByIdForUser/${parsedData.userId}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log("userData", response.data);
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [parsedData.userId, parsedData.token]);

  const [count,setCount] = useState()

  useEffect(() => {
    setCount(length)
    console.log("cartlength",length);
  },[length])

  const [cartLength, setCartLength] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/cart/getById/${parsedData.userId}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log(response.data);
        setCartLength(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [parsedData.userId, products]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [id, setId] = useState();

  function handleDelete() {
    axios
      .delete(`http://localhost:8080/cart/delete/${id}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log(response.data);
        handleClose();
        toast.success("Product removed successfully");
        setProducts(products.filter((data) => data._id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    axios
      .get(`http://localhost:8080/cart/getById/${parsedData.userId}`,{
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [parsedData.userId]);

  function handleIncUpdate(id) {
    axios
      .put(`http://localhost:8080/cart/updateInc/${id}`,"",{
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log(response.data);
        setProducts(
          products.map((data) => {
            if (data._id === id) {
              console.log("if", response.data);
              return response.data;
            } else {
              console.log("else", data);
              return data;
            }
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleDecUpdate(id) {
    axios
      .put(`http://localhost:8080/cart/updateDec/${id}`,"",{
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log(response.data);
        setProducts(
          products.map((data) => {
            if (data._id === id) {
              console.log("if", response.data);
              return response.data;
            } else {
              console.log("else", data);
              return data;
            }
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const { accounts, contractInstance } = WebMetamask();

  async function convert(n) {
    try {
      var sign = +n < 0 ? "-" : "",
        toStr = n.toString();
      if (!/e/i.test(toStr)) {
        return n;
      }
      var [lead, decimal, pow] = n
        .toString()
        .replace(/^-/, "")
        .replace(/^([0-9]+)(e.*)/, "$1.$2")
        .split(/e|\./);
      return +pow < 0
        ? sign +
            "0." +
            "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
            lead +
            decimal
        : sign +
            lead +
            (+pow >= decimal.length
              ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))
              : decimal.slice(0, +pow) + "." + decimal.slice(+pow));
    } catch (err) {
      return 0;
    }
  }

  const [loader, setLoader] = useState(false);

  async function handleBuy(amt, id) {
    console.log(parseInt(amt.replace(/,/g, "")), typeof amt);
    let amount = (parseInt(amt.replace(/,/g, "")) * 1e18).toString();
    amount = await convert(amount);
    console.log(amount, "amtamtamt");
    setLoader(true);
    try {
      await contractInstance.methods
        .transfer("0x36737B0a07943b751C672359F72D686bcD866e8b", amount)
        .send({ from: accounts })
        .then(async (res) => {
          console.log(res);
          setLoader(false);
          toast.success("Payment successfull");
          const response = await axios.put(
            `http://localhost:8080/cart/updateStatus/${id}`,"",{headers:{Authorization:parsedData.token}}
          );
          if (response.status === 200) {
            setProducts(products.filter((data) => data._id !== id));
          }
        })
        .catch((e) => {
          console.log(e);
          toast.error("Payment failed");
          setLoader(false);
        });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (loader) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loader]);

  return (
    <div style={{ position: "relative" }}>
      {console.log(length, "userData")}
      {cartLength >= 0 && userData && (
        <div>
          <NavBar userData={userData} length={count || cartLength}/>
        </div>
      )}
      {cartLength === 0 && (
        <div className="container-fluid mt-5 p-5">
          <div
            className="container mt-5 p-5"
            style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
          >
            <h1 className="mt-5 fw-bold pb-5 text-center">
              Your cart is empty
            </h1>
          </div>
        </div>
      )}
      {cartLength >= 1 && (
        <div className="container-fluid mt-5">
          <div className="row justify-content-center mt-5">
            {Array.isArray(products) &&
              products.map((data) => (
                <div className="col-4 mt-5">
                  <Card className="shadow-lg">
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8080/public/${data.image}`}
                      height={"350px"}
                    />
                    <hr className="m-0" />
                    <Card.Body className="d-flex flex-column gap-2">
                      <div className="d-flex gap-1">
                        <span>Name : </span>
                        <span className="fw-bold">{data.name}</span>
                      </div>
                      <div className="d-flex gap-1">
                        <span>Price : </span>
                        <span className="fw-bold">₹{data.price}</span>
                      </div>
                      <div className="d-flex gap-1">
                        <span className="fw-bold">Description:</span>
                        <span>{data.description}</span>
                      </div>
                      <div className="d-flex gap-1">
                        <div>
                          <span className="fw-bold">Quantity:</span>
                        </div>
                        <div class="input-group mb-3">
                          <button
                            class="btn btn-outline-danger bi bi-dash-lg"
                            type="button"
                            id="button-addon1"
                            disabled={data.cartQuantity === 1}
                            onClick={() => handleDecUpdate(data._id)}
                          ></button>
                          <input
                            type="text"
                            class="form-control text-center"
                            placeholder="Quantity"
                            value={data.cartQuantity}
                            aria-label="Example text with button addon"
                            aria-describedby="button-addon1"
                          />
                          <button
                            class="btn btn-outline-success bi bi-plus-lg"
                            type="button"
                            id="button-addon2"
                            onClick={() => handleIncUpdate(data._id)}
                          ></button>
                        </div>
                      </div>
                      <div className="d-flex gap-1 align-self-center">
                        <span>Total :</span>
                        <span className="fw-bold">₹{data.total}</span>
                      </div>
                      <div className="align-self-center d-flex gap-5">
                        <Button
                          variant="danger"
                          onClick={() => {
                            setId(data._id);
                            handleShow();
                          }}
                        >
                          Remove from cart
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => {
                            handleBuy(data.total, data._id);
                          }}
                        >
                          Proceed to Buy
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
          </div>
          {loader === true && (
            <div
              style={{
                position: "fixed",
                zIndex: "1000",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Spinner
                animation="border"
                variant="success"
                className="fs-3"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          )}
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to remove this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={() => {
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

export default Cart;

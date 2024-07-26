import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import './AllProducts.css'

function AllProducts() {
  const [products, setProducts] = useState();
  const storedData = localStorage.getItem("userDetails");
  const parsedData = JSON.parse(storedData);
  const navigate = useNavigate()
  useEffect(() => {
    axios
      .get("http://localhost:8080/product/get", {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log("products", response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [name, setName] = useState(" ");

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/product/getBySearchUser/${encodeURIComponent(
          name || " "
        )}`,
        {
          headers: { Authorization: parsedData.token },
        }
      )
      .then((response) => {
        console.log("search Product", response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [name]);

  function handleCart(data) {
    axios
      .post(`http://localhost:8080/cart/set/${data._id}/${parsedData.userId}`, data,{headers: { Authorization: parsedData.token }})
      .then((response) => {
        console.log("cart", response.data);
        toast.success("Product added to cart successfully")
        navigate("/cart")
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div className="container-fluid p-5 bg-white">
        <div className="d-flex justify-content-end">
          <input
            type="search"
            class="form-control border border-dark w-25"
            placeholder="Search..."
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="row justify-content-center gap-5 mt-3">
          {Array.isArray(products) &&
            products.map((data) => (
              <div className="col-5">
                <Card className="shadow-lg overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8080/public/${data.image}`}
                    height={"350px"}
                    className="image"
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
                    <div className="align-self-center d-flex gap-5 m-3">
                      <Button
                        variant="primary"
                        onClick={() => handleCart(data)}
                      >
                        Add to cart
                      </Button>
                      <Button variant="success">Buy Now</Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AllProducts;

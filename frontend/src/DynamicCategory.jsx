import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './DynamicCategory.css'

const DynamicCategory = React.memo(({ datas, subCategories, category }) => {
  console.log("props", datas);
  console.log("props", subCategories);
  const storedData = localStorage.getItem("userDetails");
  const parsedData = JSON.parse(storedData);

  const [subCategory, setSubCategory] = useState("Sort by sub-category");

  useEffect(() => {
    setSubCategory("Sort by sub-category");
  }, [subCategories]);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (subCategory !== "Sort by sub-category") {
      axios
        .get(
          `http://localhost:8080/product/getBySubCategory/${category}/${subCategory}`,
          {
            headers: { Authorization: parsedData.token },
          }
        )
        .then((response) => {
          console.log("products subCategory", response.data);
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (Array.isArray(datas)) {
        setData(datas);
      }
    }
  }, [subCategory, category, datas, parsedData.token]);

  const [name, setName] = useState(null);

  useEffect(() => {
    if (subCategory !== "Sort by sub-category") {
      console.log(category, subCategory);
      axios
        .get(
          `http://localhost:8080/product/getByItems/${category}/${subCategory}/${encodeURIComponent(
            name || " "
          )}`,
          {
            headers: { Authorization: parsedData.token },
          }
        )
        .then((response) => {
          console.log("productData", response.data);
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log(category, subCategory, "============================");
      axios
        .get(
          `http://localhost:8080/product/getByItems/${category}/${encodeURIComponent(
            name || " "
          )}`,
          {
            headers: { Authorization: parsedData.token },
          }
        )
        .then((response) => {
          console.log("productData", response.data);
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [name, category, subCategory, parsedData.token]);

  useEffect(() => {
    setName("");
  }, [subCategory, category]);

  const navigate = useNavigate();

  function handleCart(data) {
    axios
      .post(
        `http://localhost:8080/cart/set/${data._id}/${parsedData.userId}`,
        data,
        {
          headers: { Authorization: parsedData.token },
        }
      )
      .then((response) => {
        console.log("cart", response.data);
        toast.success("Product added to cart successfully");
        navigate("/cart");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div className="container-fluid p-5 bg-white">
        <div className="d-flex gap-5 justify-content-end">
          <Form.Select
            aria-label="Default select example"
            className="w-25 border border-dark fw-bold"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option selected disabled className="fw-bold">
              Sort by sub-category
            </option>
            {Array.isArray(subCategories.subcategory) &&
              subCategories.subcategory.map((data) => (
                <option key={data._id} value={data.name}>
                  {data.name}
                </option>
              ))}
          </Form.Select>
          <div>
            <input
              type="search"
              class="form-control border border-dark w-75"
              placeholder="Search..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="row justify-content-center gap-5 mt-3">
          {Array.isArray(data) &&
            data.map((item) => (
              <div className="col-5" key={item._id}>
                <Card className="shadow-lg overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8080/public/${item.image}`}
                    height={"350px"}
                    className="image"
                  />
                  <hr className="m-0" />
                  <Card.Body className="d-flex flex-column gap-2">
                    <div className="d-flex gap-1">
                      <span>Name : </span>
                      <span className="fw-bold">{item.name}</span>
                    </div>
                    <div className="d-flex gap-1">
                      <span>Price : </span>
                      <span className="fw-bold">₹{item.price}</span>
                    </div>
                    <div className="d-flex gap-1">
                      <span className="fw-bold">Description:</span>
                      <span>{item.description}</span>
                    </div>
                    <div className="align-self-center d-flex gap-5 m-3">
                      <Button
                        variant="primary"
                        onClick={() => handleCart(item)}
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
});

export default DynamicCategory;

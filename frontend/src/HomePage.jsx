import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import AllProducts from "./AllProducts";
import DynamicCategory from "./DynamicCategory";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import './App.css';

function HomePage({length}) {
  if(length){
    console.log("lengthhhhhhhhhhhhhhhhhhh",length);
  }
  
  const storedData = localStorage.getItem("userDetails");
  const parsedData = JSON.parse(storedData);
  // console.log(parsedData.userId);
  const [userData, setUserData] = useState();

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
  }, [parsedData.userId]);

  const [all, setAll] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState();

  function allProducts() {
    setSelectedCategory(null);
    setAll(true);
  }

  const navigate = useNavigate();

  function handleCategoryClick(categoryName) {
    setAll(false);
    setSelectedCategory(categoryName);
    // console.log(categoryName);
    navigate(`/home?category=${categoryName}`);
  }

  const [categories, setCategories] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:8080/category/getByUser", {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        // console.log(response.data,"cattttttttttt");
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const location = useLocation();

  const [category, setCategory] = useState();

  useEffect(() => {
    console.log(location.search.category);
    const searchParams = new URLSearchParams(location.search);
    console.log(searchParams);
    const category = searchParams.get("category");
    if (category) {
      console.log("Category:", category);
      setCategory(category);
    }
  }, [location]);

  const [subCategories, setSubCategories] = useState();

  useEffect(() => {
    console.log("category", category);
    axios
      .get(`http://localhost:8080/category/getByCategory/${category}`,{
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log(response.data);
        setSubCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category]);

  const [productData, setProductData] = useState();

  useEffect(() => {
    console.log("category", category);
    axios
      .get(`http://localhost:8080/product/getByCategory/${category}`, {
        headers: { Authorization: parsedData.token },
      })
      .then((response) => {
        console.log("productData", response.data);
        setProductData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category, parsedData.token]);

  const memorizedCategoryData = useMemo(() => category, [category]);

  const memorizedProductData = useMemo(() => productData, [productData]);

  const memorizedSubCategoryData = useMemo(
    () => subCategories,
    [subCategories]
  );

  return (
    <div>
      {userData && <NavBar userData={userData} length={count || cartLength}/>}
      <div
        className="container-fluid"
        style={{ backgroundColor: "rgb(208,209,211)" }}
      >
        <div className="row">
          <div className="col-2 p-0">
            <div className="sidebar">
              <div>
                <h4 className="fw-bold text-center p-2">Categories</h4>
                <ul class="list-group list-group-flush">
                  <li
                    class={`list-group-item border border-1 p-3 btn-outline-primary fs-5 fw-500 d-flex gap-2 ${
                      all ? "bg-primary" : ""
                    }`}
                    style={{ color: all ? "white" : "" }}
                    type="button"
                    onClick={allProducts}
                  >
                    <i class="bi bi-house-door-fill"></i>
                    <span>All</span>
                  </li>
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <li
                        key={category._id}
                        className={`list-group-item border border-1 p-3 btn-outline-primary fs-5 fw-500 d-flex gap-2 ${
                          selectedCategory === category.category
                            ? "bg-primary"
                            : ""
                        }`}
                        style={{
                          color:
                            selectedCategory === category.category
                              ? "white"
                              : "",
                        }}
                        type="button"
                        onClick={() => handleCategoryClick(category.category)}
                      >
                        <i className={`bi ${category.icon}`}></i>
                        <span>{category.category}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div
            className="col-10 p-4"
            style={{ backgroundColor: "rgb(220,220,220)", marginTop: "5%" }}
          >
            {all ? (
              <AllProducts />
            ) : (
              <DynamicCategory
                datas={memorizedProductData}
                subCategories={memorizedSubCategoryData}
                category={memorizedCategoryData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

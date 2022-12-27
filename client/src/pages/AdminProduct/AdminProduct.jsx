import React, { useEffect } from "react";
import Minus from "../../assets/svgs/Minus";
import Tick from "../../assets/svgs/Tick";
import Plus from "../../assets/svgs/Plus";
import "./AdminProduct.css";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, updateProduct } from "../../redux/webSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import convertToBase64 from "../../utils/base64Convert";
import imageCompression from "browser-image-compression";

const AdminProduct = () => {
  //! useState
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageRef = useRef();
  const { Token, success, products } = useSelector((state) => ({
    ...state.web,
  }));

  const [saleState, setSaleState] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    type: "",
    price: "",
    quantity: 0,
    salePrice: "",
    saleExpirery: "",
    description: "",
    background: "",
    sold: 0,
  });

  //! MISC

  const handleChangeProductData = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const changeProductBackground = async (e) => {
    try {
      e.preventDefault();
      let image = e.target.files[0];
      let loader = true;
      loader &&
        toast.loading("მიმდინარეობს ინფორმაციის მიღება...", {
          id: "single",
          duration: 10000,
          style: {
            backgroundColor: "black",
            border: "1px solid #D084E3",
            color: "white",
            boxShadow: "0px 0px 30px #D084E3",
          },
        });
      const compressedFile = await imageCompression(image, {
        initialQuality: 0.3,
        fileType: "image/webp",
      });
      const base64 = await convertToBase64(compressedFile);
      const { data } = await axios.post(
        "/api/user/uploadProductImage",
        { image: base64 },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      loader = false;
      setProductData({ ...productData, background: data.payload });
      toast.success(data.message, {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    }
  };

  const handleCreateProduct = async () => {
    try {
      await dispatch(createProduct({ Token, payload: productData }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await dispatch(updateProduct({ Token, payload: productData, id }));
    } catch (error) {
      console.log(error);
    }
  };

  //! useEffect

  useEffect(() => {
    if (success !== null) navigate("/admin");
  }, [success]);

  useEffect(() => {
    if (id !== "new") {
      let product = products.find((output) => output._id === id);
      setProductData({
        name: product?.name,
        type: product?.type,
        price: product?.price,
        quantity: product?.quantity,
        salePrice: product?.salePrice,
        saleExpirery: product?.saleExpirery,
        description: product?.description,
        background: product?.background,
        sold: product?.sold,
      });
    }
  }, [id]);

  return (
    <main id="admin_product">
      <section>
        <aside>
          <div
            id="admin_product_background"
            style={{ backgroundImage: `url(${productData?.background})` }}
          ></div>
          <input
            ref={imageRef}
            style={{ display: "none" }}
            onChange={changeProductBackground}
            type="file"
            accept="image/png, image/jpeg, image/webp"
          />
          <button onClick={() => imageRef.current.click()}>
            სურათის არჩევა
          </button>
        </aside>
        <aside>
          <div>
            <article id="admin_product_details">
              <fieldset>
                <input
                  type="text"
                  placeholder="სახელი"
                  name="name"
                  value={productData.name}
                  onChange={handleChangeProductData}
                />
                <div></div>
              </fieldset>
              <fieldset>
                <input
                  type="text"
                  placeholder="ტიპი"
                  name="type"
                  value={productData.type}
                  onChange={handleChangeProductData}
                />
                <div></div>
              </fieldset>
              <fieldset>
                <input
                  type="number"
                  placeholder="ფასი"
                  name="price"
                  value={productData.price}
                  onChange={handleChangeProductData}
                />
                <div></div>
              </fieldset>
              <span>გაყიდულია</span>
              <div className="admin_product_capacity">
                <div
                  onClick={() => {
                    if (productData.sold !== 0) {
                      setProductData((prevData) => ({
                        ...prevData,
                        sold: prevData.sold - 1,
                      }));
                    }
                  }}
                >
                  <Minus />
                </div>
                <span>{productData.sold}</span>
                <div
                  onClick={() => {
                    setProductData((prevData) => ({
                      ...prevData,
                      sold: prevData.sold + 1,
                    }));
                  }}
                >
                  <Plus />
                </div>
              </div>
              <span>რაოდენობა</span>
              <div className="admin_product_capacity">
                <div
                  onClick={() => {
                    if (productData.quantity !== 0) {
                      setProductData((prevData) => ({
                        ...prevData,
                        quantity: prevData.quantity - 1,
                      }));
                    }
                  }}
                >
                  <Minus />
                </div>
                <span>{productData.quantity}</span>
                <div
                  onClick={() => {
                    setProductData((prevData) => ({
                      ...prevData,
                      quantity: prevData.quantity + 1,
                    }));
                  }}
                >
                  <Plus />
                </div>
              </div>
              <div className="checkBox">
                <div
                  onClick={() => setSaleState(!saleState)}
                  className={saleState ? "trigger_player" : undefined}
                >
                  <Tick />
                </div>
                <span>ფასდაკლება</span>
              </div>
              <fieldset className={!saleState ? "disabledField" : undefined}>
                <input
                  type="number"
                  placeholder="ახალი ფასი"
                  disabled={!saleState}
                  name="salePrice"
                  value={productData.salePrice}
                  onChange={handleChangeProductData}
                />
                <div></div>
              </fieldset>
              <fieldset className={!saleState ? "disabledField" : undefined}>
                <input
                  type="number"
                  placeholder="ფასდაკლების ვადა"
                  disabled={!saleState}
                  name="saleExpirery"
                  value={productData.saleExpirery}
                  onChange={handleChangeProductData}
                />
                <div></div>
              </fieldset>
            </article>
            <textarea
              cols="30"
              rows="10"
              placeholder="აღწერა"
              name="description"
              value={productData.description}
              onChange={handleChangeProductData}
            ></textarea>
          </div>
          <button
            onClick={() => {
              if (id !== "new") {
                handleUpdateProduct();
              } else {
                handleCreateProduct();
              }
            }}
          >
            შენახვა
          </button>
        </aside>
      </section>
    </main>
  );
};

export default AdminProduct;

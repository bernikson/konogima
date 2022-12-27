import React from "react";
import "./InnerProduct.css";
import { useNavigate } from "react-router-dom";
import StarFull from "../../assets/svgs/StarFull";
import StarEmpty from "../../assets/svgs/StarEmpty";
import StarHalf from "../../assets/svgs/StarHalf";
import Search from "../../assets/svgs/Search";

const InnerProduct = ({ product }) => {
  //! Initializations
  const navigate = useNavigate();

  return (
    <artice
      className="home_product"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="home_product_hover">
        <Search />
      </div>
      <div
        className="home_product_background"
        style={{ backgroundImage: `url(${product?.background})` }}
      ></div>
      <div>
        <h6>{product?.type}</h6>
        <h3>{product?.name}</h3>
        <div className="home_product_ratings">
          <StarFull />
          {(() => {
            if (product.rating < 1.5) {
              return <StarEmpty />;
            } else if (product.rating >= 1.5 && product.rating < 2) {
              return <StarHalf />;
            } else {
              return <StarFull />;
            }
          })()}
          {(() => {
            if (product.rating < 2.5) {
              return <StarEmpty />;
            } else if (product.rating >= 2.5 && product.rating < 3) {
              return <StarHalf />;
            } else {
              return <StarFull />;
            }
          })()}
          {(() => {
            if (product.rating < 3.5) {
              return <StarEmpty />;
            } else if (product.rating >= 3.5 && product.rating < 4) {
              return <StarHalf />;
            } else {
              return <StarFull />;
            }
          })()}
          {(() => {
            if (product.rating < 4.5) {
              return <StarEmpty />;
            } else if (product.rating >= 4.5 && product.rating < 5) {
              return <StarHalf />;
            } else {
              return <StarFull />;
            }
          })()}
        </div>
        <div className="home_product_price">
          {product?.salePrice && (
            <span className="home_product_sale">₾{product?.salePrice}</span>
          )}

          <span
            className={`home_product_real ${
              !product?.salePrice ? "home_product_saleOriginal" : undefined
            }`}
          >
            ₾{product?.price}
          </span>
          {product?.salePrice && (
            <div>
              {(
                (100 * (product?.price - product?.salePrice)) /
                product?.price
              ).toFixed(0)}
              %
            </div>
          )}
        </div>
      </div>
    </artice>
  );
};

export default InnerProduct;

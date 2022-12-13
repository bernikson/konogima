import "./Product.css";
import StarEmpty from "../../assets/svgs/StarEmpty";
import StarFull from "../../assets/svgs/StarFull";
import StarHalf from "../../assets/svgs/StarHalf";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductReview from "../../components/ProductReview/ProductReview";
import { toast } from "react-hot-toast";
import axios from "axios";

const Product = () => {
  //! initializations
  const { id } = useParams();
  const { products, user, Token } = useSelector((state) => ({ ...state.web }));
  const navigate = useNavigate();

  //! useState
  const [currentProduct, setCurrentProduct] = useState({});
  const [review, createReview] = useState({
    userId: "",
    productId: id,
    username: "",
    comment: "",
    rating: 5,
    avatar: "",
  });
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5);

  //! useEffect
  useEffect(() => {
    let filteredProduct = products.find((output) => output._id === id);
    setCurrentProduct(filteredProduct);
  }, [id, products]);

  useEffect(() => {
    if (Object.values(user).length !== 0) {
      createReview((prevData) => ({
        ...prevData,
        userId: user?._id,
        productId: id,
        username: user?.username,
        comment: "",
        rating: 5,
        avatar: user?.avatar,
      }));
    }
  }, [id, user]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await axios.get(`/api/user/getReviews/${id}`);
      setReviews(data?.payload);
      let sumOfRating = 0;
      data?.payload?.forEach((output) => {
        sumOfRating += output?.rating;
      });
      setAverageRating(sumOfRating / reviews?.length);
    };
    fetchReviews();
  }, [id, reviews?.length]);

  //! MISC
  const addReview = async () => {
    if (review?.comment === "") {
      return toast.error("ცარიელ შეფასებას ვერ დაწერთ!", {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    } else if (review?.comment?.length >= 1000) {
      return toast.error("1000 სიმბოლოზე მეტს ვერ დაწერთ!", {
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
    createReview({ ...review, comment: "" });
    const { data } = await axios.post(
      "/api/user/createReview",
      {
        username: review?.username,
        userId: review?._id,
        comment: review.comment,
        rating: review.rating,
        avatar: review.avatar,
        productId: review.productId,
      },
      {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    setReviews([...reviews, data?.payload]);
  };

  return (
    <main id="product">
      <section id="product_details">
        <aside
          id="product_background"
          style={{ backgroundImage: `url(${currentProduct?.background})` }}
        ></aside>
        <aside>
          <div>
            <h6>დეტალები:</h6>
            <h2>{currentProduct?.name}</h2>
            <div id="product_ratings_wrapper">
              <div className="home_product_ratings">
                <StarFull />
                {(() => {
                  if (averageRating < 1.5) {
                    return <StarEmpty />;
                  } else if (averageRating >= 1.5 && averageRating < 2) {
                    return <StarHalf />;
                  } else {
                    return <StarFull />;
                  }
                })()}
                {(() => {
                  if (averageRating < 2.5) {
                    return <StarEmpty />;
                  } else if (averageRating >= 2.5 && averageRating < 3) {
                    return <StarHalf />;
                  } else {
                    return <StarFull />;
                  }
                })()}
                {(() => {
                  if (averageRating < 3.5) {
                    return <StarEmpty />;
                  } else if (averageRating >= 3.5 && averageRating < 4) {
                    return <StarHalf />;
                  } else {
                    return <StarFull />;
                  }
                })()}
                {(() => {
                  if (averageRating < 4.5) {
                    return <StarEmpty />;
                  } else if (averageRating >= 4.5 && averageRating < 5) {
                    return <StarHalf />;
                  } else {
                    return <StarFull />;
                  }
                })()}
              </div>
              <span>
                <span>{reviews?.length}</span> Reviews
              </span>
            </div>
            <div id="product_price_wrapper">
              <h2
                style={
                  !currentProduct?.salePrice ? { color: "white" } : undefined
                }
              >
                ₾
                {currentProduct?.salePrice
                  ? currentProduct?.salePrice
                  : currentProduct?.price}
              </h2>
              {currentProduct?.salePrice && (
                <span>₾{currentProduct?.price}</span>
              )}
              {currentProduct?.salePrice && (
                <div>
                  {(
                    (100 *
                      (currentProduct?.price - currentProduct?.salePrice)) /
                    currentProduct?.price
                  ).toFixed(0)}
                  %
                </div>
              )}
            </div>
            {currentProduct?.salePrice && (
              <div id="product_price_expirery">
                ფასდაკლება სრულდება <span>{currentProduct?.saleExpirery}</span>{" "}
                დღეში!
              </div>
            )}

            <div className="product_additional_info">
              მარაგშია: <span>{currentProduct?.quantity}</span>
            </div>
            <div className="product_additional_info">
              გაყიდულია: <span>{currentProduct?.sold}</span>
            </div>
          </div>
          <div>
            <h6>აღწერა:</h6>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              dolorum aut esse necessitatibus ipsam facere dolore illo
              consectetur! Asperiores perferendis blanditiis, laborum eius magni
              laboriosam adipisci vitae totam libero maxime.
            </p>
            <div id="product_button_wrapper">
              <button>შეკვეთა</button>
              <button onClick={() => navigate("/")}>უკან</button>
            </div>
          </div>
        </aside>
      </section>
      <section id="product_review_write">
        <div className="home_product_ratings">
          <div onClick={() => createReview({ ...review, rating: 1 })}>
            <StarFull />
          </div>
          <div onClick={() => createReview({ ...review, rating: 2 })}>
            {review.rating < 2 ? <StarEmpty /> : <StarFull />}
          </div>
          <div onClick={() => createReview({ ...review, rating: 3 })}>
            {review.rating < 3 ? <StarEmpty /> : <StarFull />}
          </div>
          <div onClick={() => createReview({ ...review, rating: 4 })}>
            {review.rating < 4 ? <StarEmpty /> : <StarFull />}
          </div>
          <div onClick={() => createReview({ ...review, rating: 5 })}>
            {review.rating < 5 ? <StarEmpty /> : <StarFull />}
          </div>
        </div>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={review?.comment}
          onChange={(e) => createReview({ ...review, comment: e.target.value })}
        ></textarea>
        <button onClick={() => addReview()}>შეფასება</button>
      </section>
      <section id="product_reviews_wrapper">
        {reviews?.map((output) => (
          <ProductReview data={output} />
        ))}
      </section>
    </main>
  );
};

export default Product;

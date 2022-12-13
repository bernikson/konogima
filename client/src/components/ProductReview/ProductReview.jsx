import StarEmpty from "../../assets/svgs/StarEmpty";
import StarFull from "../../assets/svgs/StarFull";
import StarHalf from "../../assets/svgs/StarHalf";
import "./ProductReview.css";
import { useNavigate } from "react-router-dom";

const ProductReview = ({ data }) => {
  //! Initializations
  const navigate = useNavigate();

  return (
    <article className="product_review">
      <aside>
        <div
          onClick={() => navigate(`/profile/${data?.username}`)}
          className="product_review_avatar"
          style={{ backgroundImage: `url(${data?.avatar})` }}
        ></div>
      </aside>
      <aside>
        <div>
          <h5>{data?.username}</h5>
          <div className="home_product_ratings">
            <StarFull />
            {data?.rating < 2 ? <StarEmpty /> : <StarFull />}
            {data?.rating < 3 ? <StarEmpty /> : <StarFull />}
            {data?.rating < 4 ? <StarEmpty /> : <StarFull />}
            {data?.rating < 5 ? <StarEmpty /> : <StarFull />}
          </div>
        </div>
        <p>{data?.comment}</p>
        <span>{new Date(data?.createdAt).toLocaleString()}</span>
      </aside>
    </article>
  );
};

export default ProductReview;

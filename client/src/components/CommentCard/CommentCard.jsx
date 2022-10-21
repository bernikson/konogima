import React from "react";
import "./CommentCard.css";
import { useDispatch, useSelector } from "react-redux";
import Dislike from "../../assets/svgs/Dislike";
import Like from "../../assets/svgs/Like";
import { useState } from "react";
import {
  updateAuthState,
  likeAnimeComment,
  dislikeAnimeComment,
  likeReplyComment,
  dislikeReplyComment,
} from "../../redux/webSlice";
import { toast } from "react-hot-toast";

const CommentCard = ({ data, id }) => {
  const dispatch = useDispatch();
  const { Token, user, socket } = useSelector((state) => ({ ...state.web }));
  const [replyComment, triggerReplyComment] = useState(false);
  const [replyData, setReplyData] = useState("");

  const createReply = () => {
    if (Object.values(user).length === 0) return dispatch(updateAuthState(1));
    if (replyData === "")
      return toast.error("ცარიელ კომენტარს ვერ დაწერთ!", {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    if (replyData.length >= 1000)
      return toast.error("ათას სიმბოლოზე მეტს ვერ დაწერთ კომენტარში!", {
        id: "single",
        duration: 4000,
        style: {
          backgroundColor: "black",
          border: "1px solid #D084E3",
          color: "white",
          boxShadow: "0px 0px 30px #D084E3",
        },
      });
    let commentData = {
      username: user?.username,
      comment: replyData,
      avatar: user?.avatar,
      isChild: true,
    };

    socket.emit("replyComment", { Token, commentId: data?._id, commentData });
    setReplyData("");
  };

  return (
    <article className="anime_comment">
      <div
        className="anime_user_profile"
        style={{ backgroundImage: `url(${data?.avatar})` }}
      ></div>
      <div className="anime_comment_info">
        <span>{data?.username}</span>
        <p>{data?.comment}</p>
        <div className="anime_comment_actions_wrapper">
          {data?._id && (
            <div>
              <div
                onClick={() => {
                  if (Object.values(user).length === 0)
                    return dispatch(updateAuthState(1));
                  dispatch(
                    likeAnimeComment({
                      commentId: data?._id,
                      userId: user?._id,
                    })
                  );
                  socket.emit("likeComment", {
                    Token,
                    animeId: id,
                    commentId: data?._id,
                    userId: user?._id,
                  });
                }}
              >
                <Like width="30" />
              </div>
              <span>{data?.likeRatio?.counter || 0}</span>
              <div
                onClick={() => {
                  if (Object.values(user).length === 0)
                    return dispatch(updateAuthState(1));
                  dispatch(
                    dislikeAnimeComment({
                      commentId: data?._id,
                      userId: user?._id,
                    })
                  );
                  socket.emit("dislikeComment", {
                    Token,
                    animeId: id,
                    commentId: data?._id,
                    userId: user?._id,
                  });
                }}
              >
                <Dislike width="30" />
              </div>
            </div>
          )}
          {data?._id && (
            <span onClick={() => triggerReplyComment(!replyComment)}>
              პასუხი
            </span>
          )}
          <span>
            {new Date(data?.createdAt).toLocaleString() === "Invalid Date"
              ? new Date().toLocaleString()
              : new Date(data?.createdAt).toLocaleString()}
          </span>
        </div>
        <div
          className={`comment_reply ${
            replyComment ? "trigger_reply" : undefined
          }`}
        >
          <textarea
            cols="30"
            rows="10"
            value={replyData}
            onChange={(e) => setReplyData(e.target.value)}
          ></textarea>
          <button id="comment_reply_button" onClick={createReply}>
            გამოეხმაურე
          </button>
        </div>
        {data?.reply?.map((output, index) => (
          <article className="anime_comment" key={index}>
            <div
              className="anime_user_profile"
              style={{ backgroundImage: `url(${output?.avatar})` }}
            ></div>
            <div className="anime_comment_info">
              <span>{output?.username}</span>
              <p>{output?.comment}</p>
              <div className="anime_comment_actions_wrapper">
                {output?._id && (
                  <div>
                    <div
                      onClick={() => {
                        if (Object.values(user).length === 0)
                          return dispatch(updateAuthState(1));
                        dispatch(
                          likeReplyComment({
                            fatherCommentId: data?._id,
                            commentId: output?._id,
                            userId: user?._id,
                          })
                        );
                        socket.emit("likeComment", {
                          Token,
                          animeId: id,
                          commentId: output?._id,
                          userId: user?._id,
                        });
                      }}
                    >
                      <Like width="30" />
                    </div>
                    <span>{output?.likeRatio?.counter || 0}</span>
                    <div
                      onClick={() => {
                        if (Object.values(user).length === 0)
                          return dispatch(updateAuthState(1));
                        dispatch(
                          dislikeReplyComment({
                            fatherCommentId: data?._id,
                            commentId: output?._id,
                            userId: user?._id,
                          })
                        );
                        socket.emit("dislikeComment", {
                          Token,
                          animeId: id,
                          commentId: output?._id,
                          userId: user?._id,
                        });
                      }}
                    >
                      <Dislike width="30" />
                    </div>
                  </div>
                )}
                <span>
                  {new Date(output?.createdAt).toLocaleString() ===
                  "Invalid Date"
                    ? new Date().toLocaleString()
                    : new Date(output?.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </article>
  );
};

export default CommentCard;

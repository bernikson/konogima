import React from "react";
import "./CommentCard.css";
import { useDispatch, useSelector } from "react-redux";
import Dislike from "../../assets/svgs/Dislike";
import Like from "../../assets/svgs/Like";
import { useState, useEffect } from "react";
import { updateAuthState } from "../../redux/webSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CommentCard = ({ data, id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Token, user, socket } = useSelector((state) => ({ ...state.web }));
  const [replyComment, triggerReplyComment] = useState(false);
  const [replyData, setReplyData] = useState("");
  const [focus, setFocus] = useState(false);
  const [replies, setReplies] = useState(data);

  useEffect(() => {
    data?.reply?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setReplies(data);
  }, [data]);

  useEffect(() => {
    const listener = (event) => {
      if (focus && (event.code === "Enter" || event.code === "NumpadEnter")) {
        event.preventDefault();
        createReply();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [replyData, focus]);
  useEffect(() => {
    socket.on("replyCommentClient", async (response) => {
      if (!response.success) {
        return toast.error(response.message, {
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
      if (data?._id === response.payload.commentId) {
        setReplies((prevReply) => {
          console.log(prevReply);
          prevReply.reply.push(response.payload.comment);
          prevReply.reply.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          return prevReply;
        });
      }
    });
  }, [socket, data, replies]);

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
      status: user?.status,
    };

    socket.emit("replyComment", { Token, commentId: data?._id, commentData });
    setReplyData("");
  };

  const likeComment = (payload) => {
    if (replies?.likeRatio.like.includes(payload.userId)) {
      let index = replies?.likeRatio.like.indexOf(payload.userId);
      setReplies((prevReplies) => {
        prevReplies?.likeRatio.like.splice(index, 1);
        prevReplies.likeRatio.counter -= 1;
        console.log(prevReplies);
        return { ...prevReplies };
      });
    } else {
      if (replies?.likeRatio.dislike.includes(payload.userId)) {
        let index = replies?.likeRatio.dislike.indexOf(payload.userId);
        setReplies((prevReplies) => {
          replies?.likeRatio.dislike.splice(index, 1);
          replies.likeRatio.counter += 1;
          return { ...prevReplies };
        });
      }
      setReplies((prevReplies) => {
        replies?.likeRatio.like.push(payload.userId);
        replies.likeRatio.counter += 1;
        return { ...prevReplies };
      });
    }
  };

  const dislikeComment = (payload) => {
    if (replies?.likeRatio.dislike.includes(payload.userId)) {
      let index = replies?.likeRatio.dislike.indexOf(payload.userId);
      setReplies((prevReplies) => {
        prevReplies?.likeRatio.dislike.splice(index, 1);
        prevReplies.likeRatio.counter += 1;
        console.log(prevReplies);
        return { ...prevReplies };
      });
    } else {
      if (replies?.likeRatio.like.includes(payload.userId)) {
        let index = replies?.likeRatio.like.indexOf(payload.userId);
        setReplies((prevReplies) => {
          replies?.likeRatio.like.splice(index, 1);
          replies.likeRatio.counter -= 1;
          return { ...prevReplies };
        });
      }
      setReplies((prevReplies) => {
        replies?.likeRatio.dislike.push(payload.userId);
        replies.likeRatio.counter -= 1;
        return { ...prevReplies };
      });
    }
  };

  const likeReplyComment = (payload) => {
    replies?.reply.map((output) => {
      if (output._id === payload.commentId) {
        if (output?.likeRatio.like.includes(payload.userId)) {
          console.log(output?.likeRatio.like);
          let index = output?.likeRatio.like.indexOf(payload.userId);
          setReplies((prevReplies) => {
            output?.likeRatio.like.splice(index, 1);
            output.likeRatio.counter -= 1;
            return { ...prevReplies };
          });
        } else {
          if (output?.likeRatio.dislike.includes(payload.userId)) {
            let index = output?.likeRatio.dislike.indexOf(payload.userId);
            setReplies((prevReplies) => {
              output?.likeRatio.dislike.splice(index, 1);
              output.likeRatio.counter += 1;
              return { ...prevReplies };
            });
          }
          setReplies((prevReplies) => {
            output?.likeRatio.like.push(payload.userId);
            output.likeRatio.counter += 1;
            return { ...prevReplies };
          });
        }
      }
    });
  };

  const dislikeReplyComment = (payload) => {
    replies?.reply.map((output) => {
      if (output._id === payload.commentId) {
        if (output?.likeRatio.dislike.includes(payload.userId)) {
          console.log(output?.likeRatio.dislike);
          let index = output?.likeRatio.dislike.indexOf(payload.userId);
          setReplies((prevReplies) => {
            output?.likeRatio.dislike.splice(index, 1);
            output.likeRatio.counter += 1;
            return { ...prevReplies };
          });
        } else {
          if (output?.likeRatio.like.includes(payload.userId)) {
            let index = output?.likeRatio.like.indexOf(payload.userId);
            setReplies((prevReplies) => {
              output?.likeRatio.like.splice(index, 1);
              output.likeRatio.counter -= 1;
              return { ...prevReplies };
            });
          }
          setReplies((prevReplies) => {
            output?.likeRatio.dislike.push(payload.userId);
            output.likeRatio.counter -= 1;
            return { ...prevReplies };
          });
        }
      }
    });
  };

  return (
    <article className="anime_comment">
      <div
        onClick={() => navigate(`/profile/${replies.username}`)}
        className="anime_user_profile"
        style={{
          backgroundImage: `url(${replies?.avatar})`,
          cursor: "pointer",
        }}
      ></div>
      <div className="anime_comment_info">
        <div className="anime_comment_name_wrapper">
          <span>{replies?.username}</span>
          {replies?.status?.map((output, index) => {
            let bgColor = "";
            let fontColor = "";
            switch (output) {
              case "მომხმარებელი":
                bgColor = "#3498db";
                break;
              case "დეველოპერი":
                bgColor = "#130f40";
                fontColor = "red";
                break;
              case "VIP":
                bgColor = "#f1c40f";
                break;
              case "გამხმოვანებელი":
                bgColor = "#16a085";
                break;
              case "მთარგმნელი":
                bgColor = "#7bed9f";
                break;
              case "ადმინისტრატორი":
                bgColor = "black";
                fontColor = "red";
                break;
              default:
                bgColor = "yellow";
                fontColor = "black";
                break;
            }
            return (
              <div
                key={index}
                style={{
                  backgroundColor: `${bgColor}`,
                  color: `${fontColor}`,
                  fontWeight: "bold",
                  padding: "0.1rem 0.8rem",
                  borderRadius: "5px",
                }}
              >
                {output}
              </div>
            );
          })}
        </div>

        <p>{replies?.comment}</p>
        <div className="anime_comment_actions_wrapper">
          {replies?._id && (
            <div>
              <div
                onClick={() => {
                  if (Object.values(user).length === 0)
                    return dispatch(updateAuthState(1));
                  likeComment({
                    commentId: replies?._id,
                    userId: user?._id,
                  });
                  socket.emit("likeComment", {
                    Token,
                    animeId: id,
                    commentId: replies?._id,
                    userId: user?._id,
                  });
                }}
              >
                <Like width="30" />
              </div>
              <span>{replies?.likeRatio?.counter || 0}</span>
              <div
                onClick={() => {
                  if (Object.values(user).length === 0)
                    return dispatch(updateAuthState(1));
                  dislikeComment({
                    commentId: replies?._id,
                    userId: user?._id,
                  });
                  socket.emit("dislikeComment", {
                    Token,
                    animeId: id,
                    commentId: replies?._id,
                    userId: user?._id,
                  });
                }}
              >
                <Dislike width="30" />
              </div>
            </div>
          )}
          {replies?._id && (
            <span onClick={() => triggerReplyComment(!replyComment)}>
              პასუხი
            </span>
          )}

          <span>
            {new Date(replies?.createdAt).toLocaleString() === "Invalid Date"
              ? new Date().toLocaleString()
              : new Date(replies?.createdAt).toLocaleString()}
          </span>
          {(user?.role === 1 || user?.username === data?.username) && (
            <span
              className="delComment"
              onClick={() =>
                socket.emit("deleteComment", { Token, commentId: data?._id })
              }
            >
              წაშლა
            </span>
          )}
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
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(e) => setReplyData(e.target.value)}
          ></textarea>
          <button id="comment_reply_button" onClick={createReply}>
            გამოეხმაურე
          </button>
        </div>
        {replies?.reply?.map((output, index) => (
          <article className="anime_comment" key={index}>
            <div
              onClick={() => navigate(`/profile/${output.username}`)}
              className="anime_user_profile"
              style={{
                backgroundImage: `url(${output?.avatar})`,
                cursor: "pointer",
              }}
            ></div>
            <div className="anime_comment_info">
              <div className="anime_comment_name_wrapper">
                <span>{output?.username}</span>
                {output?.status?.map((output, index) => {
                  let bgColor = "";
                  let fontColor = "";
                  switch (output) {
                    case "მომხმარებელი":
                      bgColor = "#3498db";
                      break;
                    case "დეველოპერი":
                      bgColor = "#130f40";
                      fontColor = "red";
                      break;
                    case "VIP":
                      bgColor = "#f1c40f";
                      break;
                    case "გამხმოვანებელი":
                      bgColor = "#16a085";
                      break;
                    case "მთარგმნელი":
                      bgColor = "#7bed9f";
                      break;
                    case "ადმინისტრატორი":
                      bgColor = "black";
                      fontColor = "red";
                      break;
                    default:
                      bgColor = "yellow";
                      fontColor = "black";
                      break;
                  }
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: `${bgColor}`,
                        color: `${fontColor}`,
                        fontWeight: "bold",
                        padding: "0.1rem 0.8rem",
                        borderRadius: "5px",
                      }}
                    >
                      {output}
                    </div>
                  );
                })}
              </div>
              <p>{output?.comment}</p>
              <div className="anime_comment_actions_wrapper">
                {output?._id && (
                  <div>
                    <div
                      onClick={() => {
                        if (Object.values(user).length === 0)
                          return dispatch(updateAuthState(1));
                        likeReplyComment({
                          fatherCommentId: replies?._id,
                          commentId: output?._id,
                          userId: user?._id,
                        });
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
                        dislikeReplyComment({
                          fatherCommentId: data?._id,
                          commentId: output?._id,
                          userId: user?._id,
                        });

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
                {(user?.role === 1 || user?.username === output?.username) && (
                  <span
                    className="delComment"
                    onClick={() =>
                      socket.emit("deleteComment", {
                        Token,
                        commentId: output?._id,
                      })
                    }
                  >
                    წაშლა
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </article>
  );
};

export default CommentCard;

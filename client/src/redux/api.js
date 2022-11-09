import axios from "axios";

export const loginAPI = (data) => axios.post("/api/user/login", data);
export const registerAPI = (data) => axios.post("/api/user/register", data);
export const tokenAPI = () => axios.get("/api/user/refreshToken");
export const logoutAPI = () => axios.get("/api/user/logout");
export const forgotPasswordAPI = (data) =>
  axios.post("/api/user/forgotPassword", data);
export const resetPasswordAPI = (data) =>
  axios.post("/api/user/resetPassword", data);
export const uploadImageAPI = (image, Token) =>
  axios.post("/api/user/uploadImage", image, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${Token}`,
    },
  });
export const createAnimeAPI = (paylaod, Token) =>
  axios.post("/api/user/createAnime", paylaod, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${Token}`,
    },
  });
export const deleteAnimeAPI = (paylaod, Token) =>
  axios.post(
    "/api/user/deleteAnime",
    { animeId: paylaod },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${Token}`,
      },
    }
  );

export const updateAnimeAPI = (paylaod, Token, animeId) =>
  axios.patch(`/api/user/updateAnime/${animeId}`, paylaod, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${Token}`,
    },
  });

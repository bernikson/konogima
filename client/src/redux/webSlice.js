import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import io from "socket.io-client";
import * as api from "./api";

export const login = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.loginAPI(payload);
      localStorage.setItem("isLogged", true);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.registerAPI(payload);
      localStorage.setItem("isLogged", true);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.forgotPasswordAPI(payload);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.resetPasswordAPI(payload);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getToken = createAsyncThunk(
  "user/getToken",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.tokenAPI();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.logoutAPI();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const uploadImage = createAsyncThunk(
  "user/uploadImage",
  async ({ image, Token }, { rejectWithValue }) => {
    try {
      const { data } = await api.uploadImageAPI(image, Token);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createAnime = createAsyncThunk(
  "user/createAnime",
  async ({ payload, Token }, { rejectWithValue }) => {
    try {
      const { data } = await api.createAnimeAPI(payload, Token);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateAnime = createAsyncThunk(
  "user/updateAnime",
  async ({ payload, Token, animeId }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateAnimeAPI(payload, Token, animeId);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

const webSlice = createSlice({
  name: "webSlice",
  initialState: {
    user: {},
    authState: 0,
    socket: io.connect("http://localhost:5000"),
    success: null,
    error: null,
    loading: false,
    Token: null,
    animes: [],
    comments: [],
    sortedAnimes: "",
  },
  reducers: {
    updateAuthState: (state, { payload }) => {
      state.authState = payload;
    },
    clearStatus: (state, { payload }) => {
      state.success = null;
      state.error = null;
    },
    updateUserState: (state, { payload }) => {
      state.user = payload;
    },
    getAnimes: (state, { payload }) => {
      state.animes = payload;
    },
    addAnime: (state, { payload }) => {
      state.animes.push(payload.payload);
    },
    addUpdatedAnime: (state, { payload }) => {
      let id = payload.payload._id;
      state.animes = state.animes.map((anime) => {
        if (anime._id === id) {
          anime = payload.payload;
          return anime;
        } else {
          return anime;
        }
      });
    },
    addAnimeSeasonRedux: (state, { payload }) => {
      let anime = state.animes.find((output) => output._id === payload.animeId);
      let season = anime.seasons.find(
        (output) => output.index === payload.index
      );
      if (!season) {
        anime.seasons.push(payload);
      } else {
        season = payload;
        anime.seasons = anime.seasons.map((output) => {
          if (output.index === season.index) {
            output = season;
            return output;
          } else {
            return output;
          }
        });
      }
    },
    updateAnimeSeriesRedux: (state, { payload }) => {
      let anime = state.animes.find((output) => output._id === payload.animeId);
      anime.seasons = anime?.seasons?.map((output) => {
        if (output._id === payload._id) {
          output = payload;
          return output;
        } else {
          return output;
        }
      });
    },
    addComment: (state, { payload }) => {
      state.comments = payload;
    },
    likeAnimeComment: (state, { payload }) => {
      state.comments = state.comments.map((comment) => {
        if (comment._id === payload.commentId) {
          if (comment?.likeRatio.like.includes(payload.userId)) {
            let index = comment?.likeRatio.like.indexOf(payload.userId);
            comment?.likeRatio.like.splice(index, 1);
            comment.likeRatio.counter -= 1;
          } else {
            if (comment?.likeRatio.dislike.includes(payload.userId)) {
              let index = comment?.likeRatio.dislike.indexOf(payload.userId);
              comment?.likeRatio.dislike.splice(index, 1);
              comment.likeRatio.counter += 1;
            }
            comment?.likeRatio.like.push(payload.userId);
            comment.likeRatio.counter += 1;
          }

          return comment;
        } else {
          return comment;
        }
      });
    },
    dislikeAnimeComment: (state, { payload }) => {
      state.comments = state.comments.map((comment) => {
        if (comment._id === payload.commentId) {
          if (comment?.likeRatio.dislike.includes(payload.userId)) {
            let index = comment?.likeRatio.dislike.indexOf(payload.userId);
            comment?.likeRatio.dislike.splice(index, 1);
            comment.likeRatio.counter += 1;
          } else {
            if (comment?.likeRatio.like.includes(payload.userId)) {
              let index = comment?.likeRatio.like.indexOf(payload.userId);
              comment?.likeRatio.like.splice(index, 1);
              comment.likeRatio.counter -= 1;
            }
            comment?.likeRatio.dislike.push(payload.userId);
            comment.likeRatio.counter -= 1;
          }

          return comment;
        } else {
          return comment;
        }
      });
    },
    likeReplyComment: (state, { payload }) => {
      let mainComment = state.comments.find(
        (output) => output._id === payload.fatherCommentId
      );
      mainComment.reply = mainComment.reply.map((comment) => {
        if (comment._id === payload.commentId) {
          if (comment?.likeRatio.like.includes(payload.userId)) {
            let index = comment?.likeRatio.like.indexOf(payload.userId);
            comment?.likeRatio.like.splice(index, 1);
            comment.likeRatio.counter -= 1;
          } else {
            if (comment?.likeRatio.dislike.includes(payload.userId)) {
              let index = comment?.likeRatio.dislike.indexOf(payload.userId);
              comment?.likeRatio.dislike.splice(index, 1);
              comment.likeRatio.counter += 1;
            }
            comment?.likeRatio.like.push(payload.userId);
            comment.likeRatio.counter += 1;
          }

          return comment;
        } else {
          return comment;
        }
      });
    },
    dislikeReplyComment: (state, { payload }) => {
      let mainComment = state.comments.find(
        (output) => output._id === payload.fatherCommentId
      );
      mainComment.reply = mainComment.reply.map((comment) => {
        if (comment._id === payload.commentId) {
          if (comment?.likeRatio.dislike.includes(payload.userId)) {
            let index = comment?.likeRatio.dislike.indexOf(payload.userId);
            comment?.likeRatio.dislike.splice(index, 1);
            comment.likeRatio.counter += 1;
          } else {
            if (comment?.likeRatio.like.includes(payload.userId)) {
              let index = comment?.likeRatio.like.indexOf(payload.userId);
              comment?.likeRatio.like.splice(index, 1);
              comment.likeRatio.counter -= 1;
            }
            comment?.likeRatio.dislike.push(payload.userId);
            comment.likeRatio.counter -= 1;
          }

          return comment;
        } else {
          return comment;
        }
      });
    },
    addReply: (state, { payload }) => {
      state.comments = state.comments.map((output) => {
        if (output._id === payload.commentId) {
          output.reply.push(payload.comment);
          return output;
        } else {
          return output;
        }
      });
    },
    getComments: (state, { payload }) => {
      payload.forEach((arr) => state.comments.push(arr));
    },
    clearComments: (state, { payload }) => {
      state.comments = [];
    },
    updateWatchLater: (state, { payload }) => {
      if (!payload.update) {
        state.user?.watchLater?.map((iterator) => {
          if (iterator?.anime === payload.animeId) {
            console.log(iterator);
            iterator.anime = payload.animeId;
            iterator.playerDetails = payload.playerOptions;
            return iterator;
          } else {
            return [];
          }
        });
      } else {
        state.user?.watchLater.push({
          anime: payload?.animeId,
          playerDetails: payload?.playerOptions,
        });
      }
    },
    sortAnimes: (state, { payload }) => {
      state.sortedAnimes = payload;
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, { payload }) => {
      state.success = payload.message;
      state.Token = payload.payload;
      state.loading = false;
      state.error = null;
    },
    [login.rejected]: (state, { payload }) => {
      state.error = payload;
      state.success = null;
      state.loading = false;
    },
    [getToken.fulfilled]: (state, { payload }) => {
      state.Token = payload.payload;
    },
    [getToken.rejected]: (state, { payload }) => {
      state.error = payload;
    },
    [logout.fulfilled]: (state, { payload }) => {
      state.Token = null;
      localStorage.setItem("isLogged", false);
      state.user = {};
    },
    [register.pending]: (state) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, { payload }) => {
      state.success = payload.message;
      state.Token = payload.payload;
      state.loading = false;
      state.error = null;
    },
    [register.rejected]: (state, { payload }) => {
      state.error = payload;
      state.success = null;
      state.loading = false;
    },
    [forgotPassword.pending]: (state) => {
      state.loading = true;
    },
    [forgotPassword.fulfilled]: (state, { payload }) => {
      state.success = payload.message;
      state.loading = false;
      state.error = null;
    },
    [forgotPassword.rejected]: (state, { payload }) => {
      state.error = payload;
      state.success = null;
      state.loading = false;
    },
    [resetPassword.pending]: (state) => {
      state.loading = true;
    },
    [resetPassword.fulfilled]: (state, { payload }) => {
      state.success = payload.message;
      state.loading = false;
      state.error = null;
    },
    [resetPassword.rejected]: (state, { payload }) => {
      state.error = payload;
      state.success = null;
      state.loading = false;
    },
    [uploadImage.pending]: (state) => {
      state.loading = true;
    },
    [uploadImage.fulfilled]: (state, { payload }) => {
      state.success = payload.message;
      state.loading = false;
      state.error = null;
      state.user.avatar = payload.payload;
    },
    [uploadImage.rejected]: (state, { payload }) => {
      state.error = payload;
      state.success = null;
      state.loading = false;
    },
    [createAnime.pending]: (state) => {
      state.loading = true;
    },
    [createAnime.fulfilled]: (state, { payload }) => {
      state.success = payload.message;
      state.loading = false;
      state.error = null;
    },
    [createAnime.rejected]: (state, { payload }) => {
      state.error = payload;
      state.success = null;
      state.loading = false;
    },
    [updateAnime.pending]: (state) => {
      state.loading = true;
    },
    [updateAnime.fulfilled]: (state, { payload }) => {
      state.success = payload.message;
      state.loading = false;
      state.error = null;
    },
    [updateAnime.rejected]: (state, { payload }) => {
      state.error = payload;
      state.success = null;
      state.loading = false;
    },
  },
});

export const {
  updateAuthState,
  clearStatus,
  updateUserState,
  getAnimes,
  addAnime,
  addUpdatedAnime,
  addAnimeSeasonRedux,
  updateAnimeSeriesRedux,
  addComment,
  likeAnimeComment,
  dislikeAnimeComment,
  addReply,
  getComments,
  likeReplyComment,
  dislikeReplyComment,
  clearComments,
  sortAnimes,
  updateWatchLater,
} = webSlice.actions;
export default webSlice.reducer;

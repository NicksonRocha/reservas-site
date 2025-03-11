import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "../services/authService"

const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
    user: user || null,
    notificationsData: [], 
    error: null,
    success: false,
    successMsg: false,
    loading: false,
    perfilUser: null,
    editUser : null,
  };

export const register = createAsyncThunk("auth/register",
    async (user, thunkAPI) => {
        const data = await authService.register(user)

        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data
    })

    export const logout = createAsyncThunk("auth/logout", async () => {
        await authService.logout()
    })

export const login = createAsyncThunk("auth/login",
    async (user, thunkAPI) => {
        const data = await authService.login(user)

        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data
    })

export const perfil = createAsyncThunk(
  "auth/perfil",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      return await authService.perfil(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      return await authService.updateProfile(data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
    "auth/fetchNotifications",
    async (_, thunkAPI) => {
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;
  
      try {
        const data = await authService.fetchNotifications(token);
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
export const markNotificationsAsRead = createAsyncThunk(
    "auth/markNotificationsAsRead",
    async (_, thunkAPI) => {
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;
  
      try {
        const data = await authService.markNotificationsAsRead(token);
        return data; 
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  export const deleteUser = createAsyncThunk("auth/deleteUser", async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;
    try {
      return await authService.deleteUser(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

    export const authSlice = createSlice({
        name: "auth",
        initialState,
        reducers: {
            reset: (state) => {
                state.loading = false
                state.error = false
                state.success = false
            },
            clearPopUpMsg: (state) => {
              state.error = null;
              state.successMsg = null;
            },
        },
        extraReducers: (builder) => {
            builder
                .addCase(register.pending, (state) => {
                    state.loading = true
                    state.error = false
                })
                .addCase(register.fulfilled, (state, action) => {
                  state.loading = false
                  state.success = true
                  state.error = null
                  state.user = action.payload
                })
                .addCase(register.rejected, (state, action) => {
                    state.loading = false
                    state.error = action.payload
                    state.user = null
                })
      .addCase(perfil.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(perfil.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.perfilUser = action.payload;
        state.editUser = action.payload;
      })
      .addCase(perfil.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.perfilUser = null;
        state.editUser = null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.editUser = action.payload;
        state.perfilUser = { ...state.perfilUser, ...action.payload };
        state.successMsg = 'Perfil editado com sucesso.'
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
                .addCase(logout.fulfilled, (state, action) => {
                    state.loading = false
                    state.success = true
                    state.error = null
                    state.user = null
                })
                .addCase(login.pending, (state) => {

                    state.loading = true
                    state.error = null
                })
                .addCase(login.fulfilled, (state, action) => {
                    
                    state.loading = false
                    state.success = true
                    state.error = null
                    state.user = action.payload
                })
                .addCase(login.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload || "Erro desconhecido."; 
                  state.user = null;
                }) 
                .addCase(fetchNotifications.pending, (state) => {
                    state.loading = true;
                  })
                  .addCase(fetchNotifications.fulfilled, (state, action) => {
                    state.loading = false;
                    state.notificationsData = action.payload;
                    state.success = true;
                  })
                  .addCase(fetchNotifications.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                  })
                  .addCase(markNotificationsAsRead.pending, (state) => {
                    state.loading = true;
                  })     
                  .addCase(markNotificationsAsRead.fulfilled, (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;
                    state.notificationsData = state.notificationsData.map((notification) => ({
                      ...notification,
                      isRead: true,
                    }));
                  })
                  .addCase(markNotificationsAsRead.rejected, (state, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.payload;
                  })
                  .addCase(deleteUser.pending, (state) => {
                    state.loading = true;
                  })
                  .addCase(deleteUser.fulfilled, (state) => {
                    state.loading = false;
                    state.success = true;
                    state.user = null;
                    localStorage.removeItem("user");
                  })
                  .addCase(deleteUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                  })    
                
        },
    })

    export const { reset, clearPopUpMsg } = authSlice.actions
    export default authSlice.reducer

    
    
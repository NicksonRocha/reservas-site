
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import businessService from '../services/businessService';

export const fetchMyBusiness = createAsyncThunk('business/fetch', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.user?.token; 
  try {
    const response = await businessService.getMyBusiness(token);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const createBusiness = createAsyncThunk(
  'business/createBusiness',
  async ({ data }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      
      const response = await businessService.createBusiness(data, token);
      
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const editBusinessSlice = createAsyncThunk(
  'business/editBusiness',
  async ({ data, id }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token; 

    try {
      const response = await businessService.editBusinessService(data, id, token, true);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteBusiness = createAsyncThunk(
  'business/deleteBusiness',
  async ({ id }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      const response = await businessService.deleteBusinessService(id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteProfileImageSlice = createAsyncThunk(
  'business/deleteProfileImage',
  async ({ id }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      const response = await businessService.deleteImageBusinessProfile(id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchBusinessProfile = createAsyncThunk(
  'business/fetchProfile',
  async ({ token, id }, thunkAPI) => {
    try {
      const response = await businessService.perfilBusiness(token, id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchClientBusinessProfile = createAsyncThunk(
  'business/fetchClientBusinessProfile',
  async (id, thunkAPI) => {
    try {
      const response = await businessService.clientPerfilBusiness(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchBusinessNotifications = createAsyncThunk(
  "business/fetchBusinessNotifications",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      const data = await businessService.fetchBusinessNotifications(id, token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const businessNotificationsAsRead = createAsyncThunk(
  "business/businessNotificationsAsRead",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      const data = await businessService.businessNotificationsAsRead(id, token);
      return data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState: {
    businesses: [],
    businessProfile: null, 
    isLoading: false,
    loading: false,
    isLoadingProfile: false,
    error: null,
    errorProfile: null, 
    successMessage: null,
    successDeleteMessage: null,
    notificationsBusiness: [],
    notificationsByBusiness: {}, 
    isLoadingClientProfile: false,
    errorClientProfile: null,
    clientBusinessProfile: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
      state.errorProfile = null;
      state.successDeleteMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload;
      })
      .addCase(fetchMyBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
      
        if (!Array.isArray(state.businesses)) {
          
          state.businesses = []; 
        }
      
        const newBusinesses = Array.isArray(action.payload.businesses)
          ? action.payload.businesses
          : [action.payload.businesses]; 

        state.businesses.push(...newBusinesses);
      
        state.successMessage = 'Empresa criada com sucesso!';
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBusinessProfile.pending, (state) => {
        state.isLoadingProfile = true;
        state.errorProfile = null;
      })
      .addCase(fetchBusinessProfile.fulfilled, (state, action) => {
        state.isLoadingProfile = false;
        state.businessProfile = action.payload;
      })
      .addCase(fetchBusinessProfile.rejected, (state, action) => {
        state.isLoadingProfile = false;
        state.errorProfile = action.payload;
      })
      .addCase(fetchClientBusinessProfile.pending, (state) => {
        state.isLoadingClientProfile = true;
        state.errorClientProfile = null;
      })
      .addCase(fetchClientBusinessProfile.fulfilled, (state, action) => {
        state.isLoadingClientProfile = false;
        state.clientBusinessProfile = action.payload; 
      })
      .addCase(fetchClientBusinessProfile.rejected, (state, action) => {
        state.isLoadingClientProfile = false;
        state.errorClientProfile = action.payload;
      })
      .addCase(editBusinessSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(editBusinessSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Empresa editada com sucesso!';
      })
      .addCase(editBusinessSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = state.businesses.filter((business) => business.id !== action.meta.arg.id);
        state.successDeleteMessage = 'Empresa deletada com sucesso!';
      })
      .addCase(deleteBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteProfileImageSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProfileImageSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Imagem deletada com sucesso!';
      })
      .addCase(deleteProfileImageSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBusinessNotifications.pending, (state) => {
                          state.loading = true;
                        })
                        .addCase(fetchBusinessNotifications.fulfilled, (state, action) => {
                          state.loading = false;
                          state.notificationsBusiness = action.payload; 
                          state.success = true;
                        })
                        .addCase(fetchBusinessNotifications.rejected, (state, action) => {
                          state.loading = false;
                          state.error = action.payload;
                        })
                        .addCase(businessNotificationsAsRead.pending, (state) => {
                                            state.loading = true;
                                          })     
                                          .addCase(businessNotificationsAsRead.fulfilled, (state, action) => {
                                            state.loading = false;
                                            state.success = true;
                                            state.error = null;
                                            state.notificationsBusiness = state.notificationsBusiness.map((notification) => ({
                                              ...notification,
                                              isRead: true,
                                            }));
                                          })
                                          .addCase(businessNotificationsAsRead.rejected, (state, action) => {
                                            state.loading = false;
                                            state.success = false;
                                            state.error = action.payload;
                                          })
  },
});

export const { clearMessages } = businessSlice.actions;
export default businessSlice.reducer;




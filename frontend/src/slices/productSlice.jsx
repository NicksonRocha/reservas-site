
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../services/productService';

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async ({ data, id}, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token; 
    try {
      const response = await productService.createProduct(data, id, token, true);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); 
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async ({id}, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      const response = await productService.deleteProduct(id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)

export const createAlbum = createAsyncThunk(
  'products/createAlbum',
  async ({ data, id}, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token; 
    try {
      const response = await productService.createAlbum(data, id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); 
    }
  }
);

export const showAlbum = createAsyncThunk(
  'products/showAlbum',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token; 
    try {
      const response = await productService.showAlbum(id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); 
    }
  }
);

export const fetchProductsByAlbumId = createAsyncThunk(
  'products/fetchByAlbumId',
  async (id, thunkAPI) => {    
    try {
      return await productService.getProductsByAlbumId(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token; 
    try {
      return await productService.fetchProducts(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const promotionProducts = createAsyncThunk(
  'products/promotionProducts',
  async (_, thunkAPI) => { 
    try {
      return await productService.promotionProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Erro ao carregar produtos promocionais');
    }
  }
);

export const recentsProducts = createAsyncThunk(
  'products/recentsProducts',
  async (_, thunkAPI) => { 
    try {
      return await productService.recentsProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Erro ao carregar produtos promocionais');
    }
  }
);


export const perfilProduct = createAsyncThunk(
  'products/perfilProduct',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;
    try {
      return await productService.perfilProduct(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const perfilClientProduct = createAsyncThunk(
  'products/perfilClientProduct',
  async (id, thunkAPI) => {
    try {
      return await productService.perfilClientProduct(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const perfilBookingsProduct = createAsyncThunk(
  'products/perfilBookingsProduct',
  async (id, thunkAPI) => {
    try {
      return await productService.perfilBookingsProduct(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const seeOptionsProductBookings = createAsyncThunk(
  'products/seeOptionsProductBookings',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      return await productService.seeOptionsProductBookings(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const editOptionsTour = createAsyncThunk(
  'products/editOptionsTour',
  async ({id, data}, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;
    try {
      return await productService.editOptionsTour(id, data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const moveAlbum = createAsyncThunk(
  'products/moveAlbum',
  async ({ id, order, comand }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token; 
    try {
      const response = await productService.moveAlbum(id, order, comand, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ data, id }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;
    try {
      const response = await productService.editProduct(data, id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  'products/deleteProductImage',
  async ({ productId, imageField }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;
    try {
      const response = await productService.deleteProductImage(productId, imageField, token);
      return { productId, imageField, response };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteAlbum = createAsyncThunk(
  'products/deleteAlbum ',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;
    try {
      const response = await productService.deleteAlbum (id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query}, thunkAPI) => {
    try {
      return await productService.searchProducts(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createTourOptions = createAsyncThunk(
  'products/createTourOptions',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;
    
    try {
      const response = await productService.createTourOptions(data, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteOptionsTour = createAsyncThunk(
  'products/deleteOptionsTour',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      const response = await productService.deleteOptionsTour(id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); 
    }
  }
)

export const createBooking = createAsyncThunk(
  'products/createBooking',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token; 
    try {
      return await productService.createBooking(data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'products/deleteBooking',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      const response = await productService.deleteBooking(id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); 
    }
  }
)

export const myBookings = createAsyncThunk(
  'products/myBookings',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;

    try {
      const data = await productService.myBookings(token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const ticketConfirmed = createAsyncThunk(
  'products/ticketConfirmed',
  async ({ data }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token;
    try {
      const response = await productService.ticketConfirmed(data, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); 
    }
  }
);

export const fetchBookingsByOptionTour = createAsyncThunk(
  'products/fetchBookingsByOptionTour',
  async (optionTourId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.user?.token; 
    try {
      const data = await productService.listBookingsByOptionTour(optionTourId, token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);



const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: [],
    productBooking: [],
    promotionProduct: [],
    recentsProduct: [],
    albums: [],
    loading: false,
    loadingSchedule: false,
    error: null,
    successMessage: null,
    successMessageDelete: null,
    successMessageAlbum: null, 
    searchResults: [],
    tourOptions: [],
    successMessageOption: null,
    bookings: [],
    myBookingsTickets: [],
    ticket: [],
    successMessageTickets: null,
    successMessageBookings: null,
    ticketConfirmedMsg: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null; 
    },
    clearSuccessMessageAlbum: (state) => {
      state.successMessageAlbum = null;
    },
    clearSuccessMessageDelete: (state) => {
      state.successMessageDelete = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearTourOptions: (state) => {
      state.tourOptions = [];
    },
    clearProduct(state) {
      state.product = {}; 
    },
    clearBookings(state) {
      state.bookings = []; 
    },
    clearBookingMessages: (state) => {
      state.error = null;
      state.successMessageBookings = null;
    },
    clearTicketMessages: (state) => {
      state.error = null;
      state.successMessageTickets = null;
    },
    clearOptionMsg: (state) => {
      state.error = null;
      state.successMessageOption = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null; 
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.successMessage = 'Produto criado com sucesso!'; 
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessageAlbum = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums.push(action.payload);
        state.successMessageAlbum = 'Album criado com sucesso.';
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(showAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(showAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
      })
      .addCase(showAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsByAlbumId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByAlbumId.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || []; 
      })
      .addCase(fetchProductsByAlbumId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(perfilProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(perfilProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(perfilProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(perfilClientProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(perfilClientProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(perfilClientProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(perfilBookingsProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(perfilBookingsProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productBooking = action.payload;
      })
      .addCase(perfilBookingsProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(seeOptionsProductBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(seeOptionsProductBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.productBooking = action.payload;
      })
      .addCase(seeOptionsProductBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(moveAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessageAlbum = 'Album modificado.';
      })
      .addCase(moveAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao mover o álbum';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessageDelete = 'Produto Deletado.';
        const deletedProductId = action.payload.id;
        state.products = state.products.filter(product => product.id !== deletedProductId);
    })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao deletar produto.';
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.successMessage = 'Produto editado com sucesso!';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, imageField } = action.payload;
        const productIndex = state.products.findIndex((product) => product.id === productId);
        if (productIndex >= 0) {
          state.products[productIndex].images[imageField] = null;
        }
        state.successMessage = 'Imagem deletada com sucesso.';
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = state.albums.filter(album => album.id !== action.meta.arg);
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao deletar álbum.';
      })
      .addCase(promotionProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(promotionProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.promotionProduct = action.payload;
      })
      .addCase(promotionProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(recentsProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recentsProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.recentsProduct = action.payload;
      })
      .addCase(recentsProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTourOptions.pending, (state) => {
        state.loadingSchedule = true;
        state.error = null;
      })
      .addCase(createTourOptions.fulfilled, (state, action) => {
        state.loadingSchedule = false;
        state.tourOptions.push(...action.payload.createdOptions);
        state.successMessageOption = "Opções de passeio criadas com sucesso!";
      })
      .addCase(createTourOptions.rejected, (state, action) => {
        state.loadingSchedule = false;
        state.error = action.payload;
      })
      .addCase(editOptionsTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editOptionsTour.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOption = action.payload;
        Object.keys(state.productBooking.options).forEach((optionName) => {
          state.productBooking.options[optionName] = state.productBooking.options[optionName].map((option) =>
            option.id === updatedOption.id ? updatedOption : option
          );
        });
      })
      .addCase(editOptionsTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOptionsTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOptionsTour.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessageDelete = 'Opção de Produto Deletada.';
        const optionIdToDelete = action.meta.arg; 
        Object.keys(state.productBooking.options).forEach((optionName) => {
          state.productBooking.options[optionName] = state.productBooking.options[optionName].filter(
            (option) => option.id !== optionIdToDelete
          );
          if (state.productBooking.options[optionName].length === 0) {
            delete state.productBooking.options[optionName];
          }
        });
      })      
      .addCase(deleteOptionsTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao deletar a reserva.';
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
        state.successMessageTickets = 'Reserva criada com sucesso!';
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessageDelete = 'Produto Deletado.';
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erro ao deletar a reserva.';
      })
      .addCase(myBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookingsTickets = action.payload;
      })
      .addCase(myBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(ticketConfirmed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ticketConfirmed.fulfilled, (state, action) => {
        state.loading = false;
        state.ticketConfirmedMsg = true;
        state.ticket = action.payload;
      })
      .addCase(ticketConfirmed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookingsByOptionTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingsByOptionTour.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookingsByOptionTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearErrors, clearSuccessMessage, clearSuccessMessageAlbum, clearSuccessMessageDelete,  clearSearchResults, clearTourOptions, clearProduct,clearBookings, clearBookingMessages, clearTicketMessages, clearOptionMsg } = productSlice.actions;
export default productSlice.reducer;




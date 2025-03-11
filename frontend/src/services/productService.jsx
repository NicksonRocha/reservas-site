
import { api, requestConfig } from '../utils/config';

const createProduct = async (data, id, token) => {
  const config = requestConfig('POST', data, token, true);
  
  const response = await fetch(`${api}/create/product/${id}`, config);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const dataProduct = await response.json();
  return dataProduct;
};

const editProduct = async (data, id, token) => {
  const config = requestConfig('PUT', data, token, true);
  
  const response = await fetch(`${api}/edit-product/${id}`, config);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const updatedProduct = await response.json();
  return updatedProduct;
};

const deleteProduct = async(id,token) => {
  const config = requestConfig('DELETE', null, token);
  
  const response = await fetch(`${api}/delete-product/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const dataDeleteProduct = await response.json();
  return dataDeleteProduct;

}

const createAlbum = async (data, id, token) => {
  const config = requestConfig('POST', data, token);
  
  const response = await fetch(`${api}/create-album/${id}`, config);
 
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const dataAlbum = await response.json();
  return dataAlbum;
};

const deleteAlbum = async(id,token) => {
  const config = requestConfig('DELETE', null, token);
  
  const response = await fetch(`${api}/delete-album/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const dataDeleteAlbum = await response.json();
  return dataDeleteAlbum;

}

const showAlbum = async (id, token) => {
  const config = requestConfig('GET', null, token);
  
  const response = await fetch(`${api}/show-album/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const dataShowAlbum = await response.json();
  
  return dataShowAlbum;
};

const getProductsByAlbumId = async (id) => {
  const config = requestConfig('GET', null);
  
  const response = await fetch(`${api}/products/album/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const productsAlbum = await response.json();
  
  return productsAlbum;
};

const perfilProduct = async (id, token) => {
  const config = requestConfig('GET', null, token);
  
  const response = await fetch(`${api}/perfil/product/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const product = await response.json();
  
  return product;
}; 

const perfilClientProduct = async (id) => {
  const config = requestConfig('GET', null);
  
  const response = await fetch(`${api}/perfil/produto/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const product = await response.json();
  
  return product;
}; 

const perfilBookingsProduct = async (id) => {
  const config = requestConfig('GET', null);
  
  const response = await fetch(`${api}/perfil-produto-bookings/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const product = await response.json();
  
  return product;
}; 

const seeOptionsProductBookings = async (id, token) => {
  const config = requestConfig('GET', null, token);
  
  const response = await fetch(`${api}/see/edit-options/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const product = await response.json();
  
  return product;
}; 


const fetchProducts = async (id, token) => {
  const config = requestConfig('GET', null, token);
  
  const response = await fetch(`${api}/products/all/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const products= await response.json();
  
  return products;
};


const promotionProducts = async () => {
  const config = requestConfig('GET', null); 
  const response = await fetch(`${api}/promotion-products`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const products = await response.json();
  return products;
};


const recentsProducts = async () => {
  const config = requestConfig('GET', null); 
  const response = await fetch(`${api}/recents-products`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const products = await response.json();
  return products;
};



const moveAlbum = async (id, order, comand, token) => {
  const config = requestConfig('PUT', null, token); 
  
  const response = await fetch(`${api}/move-album/${id}/${order}/${comand}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const dataMoveAlbum = await response.json();
  return dataMoveAlbum;
};


const deleteProductImage = async (productId, imageField, token) => {
  const config = requestConfig('DELETE', null, token);

  const response = await fetch(`${api}/delete-product-image/${productId}?imageField=${imageField}`, config);

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors.join(', '));
  }

  const result = await response.json();
  return result;
};


const searchProducts = async (query) => {
  const config = requestConfig('GET');
  const url = `${api}/search-products?query=${query}`;
  
  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const products = await response.json();
  return products;
};

const createTourOptions = async (data, token) => {
  const config = requestConfig('POST', data, token, false);
  
  const response = await fetch(`${api}/create-tour-options`, config);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const createdOptions = await response.json();
  return createdOptions;
};

const editOptionsTour = async (id, data, token) => {
  const config = requestConfig('PUT', data, token);
  
  const response = await fetch(`${api}/edit-options-tour/${id}`, config);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const updatedOption = await response.json();
  return updatedOption;
};

const deleteOptionsTour = async(id, token) => {
  const config = requestConfig('DELETE', null, token);
  
  const response = await fetch(`${api}/delete-option-tour/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

}

const createBooking = async (data, token) => {
  const config = requestConfig('POST', data, token, false);

  const response = await fetch(`${api}/create-booking`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const createdBooking = await response.json();
  return createdBooking;
};

const deleteBooking = async(id,token) => {
  const config = requestConfig('DELETE', null, token);
  
  const response = await fetch(`${api}/delete-booking/${id}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

}

const myBookings = async (token) => {
  const config = requestConfig("GET", null, token);

  const response = await fetch(`${api}/my-bookings`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(", "));
  }

  const bookings = await response.json();
  return bookings;
};

const listBookingsByOptionTour = async (optionTourId, token) => {
  const config = requestConfig('GET', null, token);

  const response = await fetch(`${api}/bookings/${optionTourId}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const bookings = await response.json();
  return bookings;
};

const ticketConfirmed = async (data, token) => {
  const config = requestConfig('PUT', data, token);
  
  const response = await fetch(`${api}/ticket-confirmed`, config);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const ticketConfirmed = await response.json();
  return ticketConfirmed;
};

const fetchNotifications = async (token) => {
  const config = requestConfig('GET', null, token);

  const response = await fetch(`${api}/notifications`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
  }

  const notifications = await response.json();
  return notifications;
};

const productService = {
  createProduct,
  deleteProduct,
  createAlbum,
  showAlbum,
  getProductsByAlbumId,
  perfilProduct,
  perfilClientProduct,
  perfilBookingsProduct,
  seeOptionsProductBookings,
  moveAlbum,
  editProduct, 
  deleteProductImage,
  fetchProducts,
  deleteAlbum,
  promotionProducts,
  recentsProducts,
  searchProducts,
  createTourOptions, 
  editOptionsTour,
  deleteOptionsTour,
  createBooking,
  myBookings,
  listBookingsByOptionTour,
  deleteBooking,
  ticketConfirmed,
  fetchNotifications
};

export default productService;



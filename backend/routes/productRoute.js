
const express = require('express');
const authGuard = require('../middlewares/authGuard');
const { productCreateValidation, productEditValidation } = require('../middlewares/productValidation');
const validate = require('../middlewares/handleValidation');
const {
    registerProduct,
    editProduct,
    perfilProduct,
    productMulter,
    createAlbum,
    showAlbum,
    getProductsByAlbumId,
    moveAlbum,
    deleteProduct,
    deleteProductImage,
    fetchProducts,
    deleteAlbum,
    promotionHome,
    recentsProductsHome,
    searchProducts,
    createOptionsTour,
    perfilClientProduct,
    createBooking,
    listBookingsByOptionTour,
    perfilProductBookings,
    deleteBooking,
    seeOptionsProductBookings,
    deleteOptionsTour,
    editOptionsTour,
    myBookings,
    ticketConfirmed
} = require('../controllers/ProductController');
const productRoute = express.Router();


productRoute.get('/bookings/:optionTourId', authGuard, listBookingsByOptionTour);

productRoute.post('/create-booking', authGuard, createBooking)
productRoute.delete('/delete-booking/:id', authGuard, deleteBooking)
productRoute.get('/my-bookings', authGuard, myBookings);
productRoute.put('/ticket-confirmed', authGuard, ticketConfirmed)

productRoute.post('/create-tour-options', authGuard, createOptionsTour);
productRoute.put('/edit-options-tour/:id', authGuard, editOptionsTour)
productRoute.delete('/delete-option-tour/:id', authGuard, deleteOptionsTour)

productRoute.get('/search-products', searchProducts);


productRoute.get('/promotion-products', promotionHome)
productRoute.get('/recents-products', recentsProductsHome)

productRoute.get('/perfil/product/:id', authGuard, perfilProduct);

productRoute.get('/see/edit-options/:id', authGuard, seeOptionsProductBookings);

productRoute.get('/perfil/produto/:id', perfilClientProduct);
productRoute.get('/perfil-produto-bookings/:id', perfilProductBookings);

productRoute.delete('/delete-product/:id', authGuard, deleteProduct)

productRoute.put(
    '/edit-product/:id',
    authGuard,
    productMulter.fields([
        { name: 'title', maxCount: 1 },
        { name: 'description', maxCount: 1 },
        { name: 'price', maxCount: 1 },
        { name: 'category', maxCount: 1 },
        { name: 'promotion', maxCount: 1 },
        { name: 'duration', maxCount: 1 },
        { name: 'title_one', maxCount: 1 },
        { name: 'title_two', maxCount: 1 },
        { name: 'title_three', maxCount: 1 },
        { name: 'title_four', maxCount: 1 },
        { name: 'title_five', maxCount: 1 },
        { name: 'title_six', maxCount: 1 }
    ]),
    productEditValidation(),
    validate,
    editProduct
);

productRoute.delete('/delete-product-image/:id', authGuard, deleteProductImage);

productRoute.get('/products/all/:id', authGuard, fetchProducts)

productRoute.get('/products/album/:id', getProductsByAlbumId)
productRoute.delete('/delete-album/:id', authGuard, deleteAlbum)
productRoute.get('/show-album/:id', authGuard, showAlbum)
productRoute.post('/create-album/:id', authGuard, createAlbum)
productRoute.put('/move-album/:id/:order/:comand', authGuard, moveAlbum)

productRoute.post(
    '/create/product/:id',
    authGuard,
    productMulter.array('images', 6),  
    productCreateValidation(),
    validate,
    registerProduct
);

module.exports = productRoute;

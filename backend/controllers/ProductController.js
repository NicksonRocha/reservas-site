const { Op } = require('sequelize');
const moment = require('moment-timezone');

const User = require('../models/User')
const Booking = require('../models/Booking')
const Product = require('../models/Product')
const Business = require('../models/Business')
const ProductImage = require('../models/ProductImage')
const Album = require('../models/Album')
const OptionsTour = require('../models/OptionsTour');
const Notification = require('../models/Notification');
const NotificationBusiness = require('../models/NotificationBusiness');

const UploadImagesServices = require('../services/UploadImagesServices');
const DeleteImagesServices = require('../services/DeleteImagesServices');
const multerConfig = require('../config/multer');
const multer = require('multer');
const productMulter = multer(multerConfig);

const AWS = require('aws-sdk');


const crypto = require('crypto'); 
const QRCode = require('qrcode'); 
const BookingCode = require('../models/BookingCode');
const fs = require('fs'); 
const path = require('path'); 


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'sa-east-1', 
});
const moveAlbum = async (req, res) => {
  const { id, order, comand } = req.params;
  const reqUser = req.user;

  try {
      const album = await Album.findOne({ where: { BusinessId: id } });
      if (!album) {
          return res.status(404).json({ errors: ["Álbum não encontrado."] });
      }

      const company = await Business.findByPk(album.BusinessId);
      if (reqUser.id !== company.UserId) {
          return res.status(403).json({ errors: ["Você não tem permissão para alterar este álbum."] });
      }

      const currentOrder = parseInt(order, 10); 
      if (comand === 'up') {
          const albumOrder = await Album.findOne({
              where: {
                  order: currentOrder,
                  BusinessId: id
              }
          });

          const changeOrder = await Album.findOne({
              where: {
                  order: currentOrder - 1,
                  BusinessId: id
              }
          });

          if (!albumOrder || !changeOrder) {
              return res.status(404).json({ errors: ["Ordem especificada não encontrada."] });
          }

          albumOrder.order = currentOrder - 1;
          changeOrder.order = currentOrder;

          await albumOrder.save();
          await changeOrder.save();
      } 

      if (comand === 'down') {
          const albumOrder = await Album.findOne({
              where: {
                  BusinessId: id,
                  order: currentOrder,
              }
          });

          const changeOrder = await Album.findOne({
              where: {
                  BusinessId: id,
                  order: currentOrder + 1,
              }
          });

          if (!albumOrder || !changeOrder) {
              return res.status(404).json({ errors: ["Ordem especificada não encontrada."] });
          }

          albumOrder.order = currentOrder + 1;
          changeOrder.order = currentOrder;

          await albumOrder.save();
          await changeOrder.save();
      } 

      res.status(200).json({ message: "Álbum movido com sucesso." });
  } catch (error) {
      console.error("Erro ao mover álbum:", error);
      res.status(500).json({ error: "Erro ao mover álbum." });
  }
};

const createAlbum = async (req, res) => {
    const { name } = req.body; 
    const { id } = req.params;  
    const reqUser = req.user;

    try {
        const company = await Business.findByPk(id);
        if (!company) {
            return res.status(404).json({ errors: ["Empresa não encontrada."] });
        }

        if (reqUser.id !== company.UserId) {
            return res.status(403).json({ errors: ["Você não tem permissão para editar esta empresa."] });
        }

        const lastAlbum = await Album.findOne({
            where: { BusinessId: id },
            order: [['order', 'DESC']],  
        });

        const nextOrder = lastAlbum ? lastAlbum.order + 1 : 0; 

        const album = await Album.create({
            name,
            order: nextOrder,  
            BusinessId: id,
        });

        res.status(201).json(album);
    } catch (error) {
        console.error('Erro ao criar álbum:', error);
        res.status(500).json({ error: 'Erro ao criar álbum.' });
    }
};


const deleteAlbum = async (req, res) => {
    const { id } = req.params;
    const reqUser = req.user;

    try {
        const album = await Album.findByPk(id);
        if (!album) {
            return res.status(404).json({ errors: ["Álbum não encontrado."] });
        }

        const company = await Business.findByPk(album.BusinessId);
        if (!company) {
            return res.status(404).json({ errors: ["Empresa associada ao álbum não encontrada."] });
        }

        if (reqUser.id !== company.UserId) {
            return res.status(403).json({ errors: ["Você não tem permissão para deletar álbuns desta empresa."] });
        }

        await Product.update(
            { AlbumId: null },
            { where: { AlbumId: id } }
        );

        const deletedAlbumOrder = album.order;

        await album.destroy();

        const albumsToUpdate = await Album.findAll({
            where: {
                BusinessId: album.BusinessId,
                order: { [Op.gt]: deletedAlbumOrder }
            },
            order: [['order', 'ASC']]
        });

        for (const albumToUpdate of albumsToUpdate) {
            albumToUpdate.order -= 1;
            await albumToUpdate.save();
        }

        res.status(200).json({ message: "Álbum deletado com sucesso e ordem atualizada." });
    } catch (error) {
        console.error('Erro ao deletar álbum:', error);
        res.status(500).json({ error: 'Erro ao deletar álbum.' });
    }
};

const showAlbum = async (req, res) => {

    try {
        const { id } = req.params; 
        const reqUser = req.user;
    
        const company = await Business.findByPk(id);

        if (!company) {
            return res.status(404).json({ errors: ["Empresa não encontrada para ver álbuns."] });
        }

        if (reqUser.id !== company.UserId) {
            return res.status(403).json({ errors: ["Você não tem permissão para editar esta empresa."] });
        }

        const albums = await Album.findAll({
          where: { BusinessId: id },
          order: [['order', 'ASC']],
        });
        
        return res.status(200).json(albums)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao mostrar álbum.' });
    }
}


const getProductsByAlbumId = async (req, res) => {
    try {
      const { id } = req.params;
  
      const products = await Product.findAll({ where: { BusinessId: id } });
  
      if (!products || products.length === 0) {
        return res.status(200).json([]); 
      }
  
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          
          const productImage = await ProductImage.findOne({
            where: { productId: product.id },
          });
  
          let imageUrls = [];
          if (productImage) {
            const imageFields = [
              'title_one',
              'title_two',
              'title_three',
              'title_four',
              'title_five',
              'title_six',
            ];
  
            for (const field of imageFields) {
              if (productImage[field]) {
                const params = {
                  Bucket: 'reservas-bucket', 
                  Key: productImage[field], 
                  Expires: 60 * 60, 
                };
                const imageUrl = await s3.getSignedUrlPromise('getObject', params);
                imageUrls.push(imageUrl);
              }
            }
          }
  
          return {
            ...product.toJSON(),
            images: imageUrls, 
            
          };
        })
      );
  
      res.status(200).json(productsWithImages);
    } catch (error) {
      console.error('Erro ao buscar produtos por AlbumId:', error);
      res.status(500).json({ message: 'Erro ao buscar produtos.', error });
    }
  };


const registerProduct = async (req, res) => {
    try {
        const reqUser = req.user;
        const { id } = req.params;

        const company = await Business.findByPk(id);

        if (!company) {
            return res.status(404).json({ errors: ["Empresa não encontrada."] });
        }

        const { title, description, price, promotion, duration, AlbumId } = req.body;

        const existingProduct = await Product.findOne({
            where: {
                title,
                businessId: id,
            },
        });

        if (existingProduct) {
            return res.status(422).json({
                errors: ["Por favor utilize um nome diferente, você já tem um produto com este nome."],
            });
        }

        if (reqUser.id !== company.UserId) {
            return res.status(403).json({
                errors: ["Você não tem permissão para adicionar produtos a esta empresa."],
            });
        }

const newProduct = await Product.create({
    title,
    description,
    price,
    category: company.category,
    BusinessId: id, 
    promotion,
    duration,
    AlbumId: AlbumId || null  
});


        if (!newProduct) {
            return res.status(422).json({
                errors: ["Houve um erro ao criar o produto, por favor tente mais tarde."],
            });
        }

        let productImageId = null;

        if (req.files && req.files.length > 0) {
            if (req.files.length > 6) {
                return res.status(400).json({
                    errors: ["Você pode enviar no máximo 6 imagens."],
                });
            }

            const uploadImagesServices = new UploadImagesServices();

            const imageFields = ['title_one', 'title_two', 'title_three', 'title_four', 'title_five', 'title_six'];
            const imageData = {};

            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];

                await uploadImagesServices.execute(file);

                imageData[imageFields[i]] = file.filename;
            }

            if (Object.keys(imageData).length > 0) {
                
                const productImage = await ProductImage.create({
                    ...imageData, 
                    productId: newProduct.id, 
                });

                productImageId = productImage.id;
            }
        }

        if (productImageId) {
            await newProduct.update({ productImageId });
        }

        const notificationBusiness = await NotificationBusiness.create({
          userId: reqUser.id,
          businessId: newProduct.businessId,
          message: `Produto ${title} foi criado com sucesso.`,
        });

        return res.status(201).json({newProduct, notificationBusiness});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ errors: ["Ocorreu um erro no servidor, tente novamente mais tarde."] });
    }
};

const editProduct = async (req, res) => { 
    try {
        const { id } = req.params;
        const { title, description, price, pricePromotion, category, promotion, duration, albumId } = req.body; 
        const reqUser = req.user;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ errors: ["Produto não encontrado."] });
        }

        const business = await Business.findByPk(product.BusinessId);
        if (!business) {
            return res.status(404).json({ errors: ["Empresa não encontrada."] });
        }

        if (reqUser.id !== business.UserId) {
            return res.status(403).json({ errors: ["Você não tem permissão para editar este produto."] });
        }

        if (title) product.title = title;
        if (albumId) product.AlbumId = albumId;
        if (description) product.description = description;
        if (price) product.price = parseFloat(price);
        if (pricePromotion) product.pricePromotion = parseFloat(pricePromotion);
        if (category) product.category = category;
        if (promotion !== undefined) product.promotion = promotion === 'true';
        if (duration) product.duration = parseInt(duration);

        const imageFields = ['title_one', 'title_two', 'title_three', 'title_four', 'title_five', 'title_six'];
        const imageUpdates = {};
        const uploadImagesServices = new UploadImagesServices();
        const deleteImagesServices = new DeleteImagesServices();

        for (const field of imageFields) {
            if (req.files && req.files[field]) {
                const oldImage = product.productImage ? product.productImage[field] : null;

                const file = req.files[field][0];
                if (file) {
                    await uploadImagesServices.execute(file);
                    imageUpdates[field] = file.filename;

                    if (oldImage) {
                        await deleteImagesServices.execute(oldImage);
                    }
                }
            }
        }

        if (Object.keys(imageUpdates).length > 0) {
            let productImage = await ProductImage.findOne({ where: { productId: product.id } });
            if (!productImage) {
                productImage = await ProductImage.create({ productId: product.id, ...imageUpdates });
                product.productImageId = productImage.id;
            } else {
                await productImage.update(imageUpdates);
            }
        }

        await product.save();

        const notificationBusiness = await NotificationBusiness.create({
          userId: reqUser.id,
          businessId: product.businessId,
          message: `Produto ${product.title} foi editado com sucesso.`,
        });

        return res.status(200).json({product, notificationBusiness});

    } catch (error) {
        console.error("Erro ao editar produto:", error);
        return res.status(500).json({ errors: ["Erro no servidor, tente novamente mais tarde."] });
    }
};

const deleteProductImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageField } = req.query; 
        const reqUser = req.user;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ errors: ["Produto não encontrado."] });
        }

        const business = await Business.findByPk(product.BusinessId);
        if (!business) {
            return res.status(404).json({ errors: ["Empresa não encontrada."] });
        }

        if (reqUser.id !== business.UserId) {
            return res.status(403).json({ errors: ["Você não tem permissão para editar este produto."] });
        }

        const productImage = await ProductImage.findOne({ where: { productId: product.id } });
        if (productImage && productImage[imageField]) {
            const oldImage = productImage[imageField];
            const deleteImagesServices = new DeleteImagesServices();
            await deleteImagesServices.execute(oldImage);
            await productImage.update({ [imageField]: null });

            const titleFields = [
                'title_one', 'title_two', 'title_three', 'title_four', 'title_five', 'title_six'
            ];

            const startIndex = titleFields.indexOf(imageField);
            if (startIndex !== -1) {
                for (let i = startIndex; i < titleFields.length - 1; i++) {
                    productImage[titleFields[i]] = productImage[titleFields[i + 1]];
                }
                productImage[titleFields[titleFields.length - 1]] = null; 
            }

            await productImage.save();
        }

        return res.status(200).json({ message: "Imagem deletada com sucesso." });

    } catch (error) {
        console.error("Erro ao deletar imagem do produto:", error);
        return res.status(500).json({ errors: ["Erro no servidor, tente novamente mais tarde."] });
    }
};


const deleteProduct = async (req, res) => {
  try {
      const reqUser = req.user;
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
          return res.status(404).json({ errors: ["Produto não encontrado."] });
      }

      const company = await Business.findByPk(product.BusinessId);

      if (reqUser.id !== company.UserId) {
          return res.status(403).json({
              errors: ["Você não tem permissão para deletar este produto."],
          });
      }

      const productImages = await ProductImage.findOne({ where: { productId: product.id } });

      if (productImages) {
          const deleteImagesServices = new DeleteImagesServices();

          const imageFields = ['title_one', 'title_two', 'title_three', 'title_four', 'title_five', 'title_six'];
          for (let field of imageFields) {
              if (productImages[field]) {
                  await deleteImagesServices.execute(productImages[field]);
              }
          }
        
          await product.update({ productImageId: null });

          await productImages.destroy();
      }

      const notificationBusiness = await NotificationBusiness.create({
          userId: reqUser.id,
          businessId: product.BusinessId,
          message: `Produto ${product.title} foi deletado com sucesso.`,
      });

      await product.destroy();

      return res.status(200).json({ 
          message: "Produto deletado com sucesso.", 
          id, 
          notificationBusiness 
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: ["Ocorreu um erro no servidor, tente novamente mais tarde."] });
  }
};


const perfilProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const reqUser = req.user;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ errors: ["Produto não encontrado."] });
    }

     const business = await Business.findByPk(product.BusinessId);
     if (!business) {
         return res.status(404).json({ errors: ["Empresa não encontrada."] });
     }

     if (!reqUser || reqUser.id !== business.UserId) {
      return res.status(403).json({ errors: ["Você não tem permissão para ver este produto."] });
    }

    const productImage = await ProductImage.findOne({
      where: { productId: product.id },
    });

    if (!productImage) {
      return res.json({
        ...product.toJSON(),
        images: [], 
      });
    }

    const imageFields = [
      'title_one',
      'title_two',
      'title_three',
      'title_four',
      'title_five',
      'title_six',
    ];

    const imageUrls = await Promise.all(
      imageFields
        .filter((field) => productImage[field]) 
        .map(async (field) => {
          const params = {
            Bucket: 'reservas-bucket',
            Key: productImage[field], 
            Expires: 60 * 60, 
          };
          return s3.getSignedUrlPromise('getObject', params); 
        })
    );

    return res.json({
      ...product.toJSON(),
      images: imageUrls, 
    });
  } catch (error) {
    console.error("Erro ao buscar perfil do produto:", error);
    return res.status(500).json({ errors: ["Erro ao buscar o perfil do produto."] });
  }
};


const perfilClientProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ errors: ["Produto não encontrado."] });
    }

    const business = await Business.findByPk(product.BusinessId);

    if (!business) {
      return res.status(404).json({ errors: ["Empresa não encontrada."] });
    }

    let profileImageUrl = null;
    if (business.profile_image) {
      const params = {
        Bucket: "reservas-bucket", 
        Key: business.profile_image, 
        Expires: 60 * 60, 
      };
      profileImageUrl = await s3.getSignedUrlPromise("getObject", params);
    }

    const productImage = await ProductImage.findOne({
      where: { productId: product.id },
    });

    const options = await OptionsTour.findAll({
      where: { productId: id },
      order: [["name", "ASC"], ["date", "ASC"], ["startHour", "ASC"]],
    });

    const nowMaceio = moment().tz("America/Maceio");

    const filteredOptions = options.filter((option) => {

      const optionDateTime = moment.tz(
        `${option.date} ${option.startHour}`,
        "YYYY-MM-DD HH:mm",
        "America/Maceio"
      );

      return optionDateTime.isSameOrAfter(nowMaceio);
    });

    const imageFields = [
      "title_one",
      "title_two",
      "title_three",
      "title_four",
      "title_five",
      "title_six",
    ];

    const imageUrls = productImage
      ? await Promise.all(
          imageFields
            .filter((field) => productImage[field]) 
            .map(async (field) => {
              const params = {
                Bucket: "reservas-bucket",
                Key: productImage[field],
                Expires: 60 * 60,
              };
              return s3.getSignedUrlPromise("getObject", params);
            })
        )
      : [];

    const groupedOptions = {};

    for (const option of filteredOptions) {
      const bookings = await Booking.findAll({
        where: { optionTourId: option.id },
      });

      const totalBookings = bookings.length;
      const remainingCapacity = option.capacity - totalBookings;

      if (remainingCapacity > 0) {
        if (!groupedOptions[option.name]) {
          groupedOptions[option.name] = [];
        }

        groupedOptions[option.name].push({
          id: option.id,
          date: option.date,
          startHour: option.startHour,
          endHour: option.endHour,
          price: option.price,
          capacity: option.capacity,
          availability: remainingCapacity,
        });
      }
    }

    return res.json({
      ...product.toJSON(),
      images: imageUrls,
      options: groupedOptions,
      business: {
        name: business.name,
        profileImageUrl: profileImageUrl,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar perfil do produto:", error);
    return res.status(500).json({ errors: ["Erro ao buscar o perfil do produto."] });
  }
};

const perfilProductBookings = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ errors: ["Produto não encontrado."] });
    }

    const productImage = await ProductImage.findOne({
      where: { productId: product.id },
    });

    const options = await OptionsTour.findAll({
      where: { productId: id },
      order: [["name", "ASC"], ["date", "ASC"], ["startHour", "ASC"]],
    });

    const imageFields = [
      "title_one",
      "title_two",
      "title_three",
      "title_four",
      "title_five",
      "title_six",
    ];

    const imageUrls = productImage
      ? await Promise.all(
          imageFields
            .filter((field) => productImage[field]) 
            .map(async (field) => {
              const params = {
                Bucket: "reservas-bucket", 
                Key: productImage[field], 
                Expires: 60 * 60, 
              };
              return s3.getSignedUrlPromise("getObject", params);
            })
        )
      : [];

    const groupedOptions = {};

    for (const option of options) {
      const bookings = await Booking.findAll({
        where: { optionTourId: option.id },
      });

      const totalBookings = bookings.length;
      const remainingCapacity = option.capacity - totalBookings;

      if (!groupedOptions[option.name]) {
        groupedOptions[option.name] = [];
      }

      groupedOptions[option.name].push({
        id: option.id,
        date: new Date(option.date).toISOString().split("T")[0], 
        startHour: option.startHour,
        endHour: option.endHour,
        price: option.price,
        capacity: option.capacity,
        availability:
          remainingCapacity > 0 ? `${remainingCapacity} vagas` : "Esgotada",
      });
    }

    return res.json({
      ...product.toJSON(),
      images: imageUrls,
      options: groupedOptions,
    });
  } catch (error) {
    console.error("Erro ao buscar perfil do produto:", error);
    return res.status(500).json({ errors: ["Erro ao buscar o perfil do produto."] });
  }
};


const seeOptionsProductBookings = async (req, res) => {
  try {  
    const { id } = req.params;
    const reqUser = req.user; 

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ errors: ["Produto não encontrado."] });
    }

     const business = await Business.findByPk(product.BusinessId);
     if (!business) {
         return res.status(404).json({ errors: ["Empresa não encontrada."] });
     }

     if (!reqUser || reqUser.id !== business.UserId) {
      return res.status(403).json({ errors: ["Você não tem permissão para ver este produto."] });
    }

    const productImage = await ProductImage.findOne({
      where: { productId: product.id },
    });

    const options = await OptionsTour.findAll({
      where: { productId: id },
      order: [["name", "ASC"], ["date", "ASC"], ["startHour", "ASC"]],
    });

    const today = new Date();
    const filteredOptions = options.filter(option => new Date(option.date) >= today);

    const imageFields = [
      "title_one",
      "title_two",
      "title_three",
      "title_four",
      "title_five",
      "title_six",
    ];

    const imageUrls = productImage
      ? await Promise.all(
          imageFields
            .filter((field) => productImage[field]) 
            .map(async (field) => {
              const params = {
                Bucket: "reservas-bucket", 
                Key: productImage[field], 
                Expires: 60 * 60, 
              };
              return s3.getSignedUrlPromise("getObject", params);
            })
        )
      : [];

    const groupedOptions = {};

    for (const option of filteredOptions) {
      const bookings = await Booking.findAll({
        where: { optionTourId: option.id },
      });

      const totalBookings = bookings.length;
      const remainingCapacity = option.capacity - totalBookings;

      if (!groupedOptions[option.name]) {
        groupedOptions[option.name] = [];
      }

      groupedOptions[option.name].push({
        id: option.id,
        name: option.name,
        date: new Date(option.date).toISOString().split("T")[0], 
        startHour: option.startHour,
        endHour: option.endHour,
        price: option.price,
        capacity: option.capacity,
        availability:
          remainingCapacity > 0 ? `${remainingCapacity} vagas` : "Esgotada",
      });
    }

    return res.json({
      ...product.toJSON(),
      images: imageUrls,
      options: groupedOptions,
    });
  } catch (error) {
    console.error("Erro ao buscar perfil do produto:", error);
    return res.status(500).json({ errors: ["Erro ao buscar o perfil do produto."] });
  }
};



  const fetchProducts = async (req, res) => {
    try {
        const { id } = req.params;
    
        const products = await Product.findAll({ where: { BusinessId: id } });
    
        if (!products || products.length === 0) {
          return res.status(404).json({ message: 'Nenhum produto encontrado.' });
        }
    
        const productsWithImages = await Promise.all(
          products.map(async (product) => {
            const productImage = await ProductImage.findOne({
              where: { productId: product.id },
            });
    
            let imageUrls = [];
            if (productImage) {
              const imageFields = [
                'title_one',
                'title_two',
                'title_three',
                'title_four',
                'title_five',
                'title_six',
              ];
    
              for (const field of imageFields) {
                if (productImage[field]) {
                  const params = {
                    Bucket: 'reservas-bucket', 
                    Key: productImage[field], 
                    Expires: 60 * 60, 
                  };
                  const imageUrl = await s3.getSignedUrlPromise('getObject', params);
                  imageUrls.push(imageUrl);
                }
              }
            }
    
            return {
              ...product.toJSON(),
              images: imageUrls,
              
            };
          })
        );
    
        res.status(200).json(productsWithImages);
      } catch (error) {
        console.error('Erro ao buscar produtos por AlbumId:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos.', error });
      }
  }
  
  const promotionHome = async (req, res) => {
    try {
      const products = await Product.findAll({ where: { promotion: '1' }, limit: 10 });
  
      if (!products || products.length === 0) {
        return res.status(200).json({ message: 'Nenhum produto promocional encontrado.', products: [] });
      }
  
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const productImage = await ProductImage.findOne({
            where: { productId: product.id },
          });
  
          let imageUrls = [];
          if (productImage) {
            const imageFields = [
              'title_one',
              'title_two',
              'title_three',
              'title_four',
              'title_five',
              'title_six',
            ];
  
            for (const field of imageFields) {
              if (productImage[field]) {
                const params = {
                  Bucket: 'reservas-bucket', 
                  Key: productImage[field], 
                  Expires: 60 * 60,
                };
                const imageUrl = await s3.getSignedUrlPromise('getObject', params);
                imageUrls.push(imageUrl);
              }
            }
          }
  
          return {
            ...product.toJSON(),
            images: imageUrls, 
          };
        })
      );
  
      res.status(200).json(productsWithImages);
    } catch (error) {
      console.error('Erro ao buscar produtos promocionais', error);
      res.status(500).json({ message: 'Erro ao buscar produtos.', error });
    }
  };

const recentsProductsHome = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']], 
      limit: 10, 
    });

    if (!products || products.length === 0) {
      return res.status(200).json({ message: 'Nenhum produto recente encontrado.', products: [] });
    }

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const productImage = await ProductImage.findOne({
          where: { productId: product.id },
        });

        let imageUrls = [];
        if (productImage) {
          const imageFields = [
            'title_one',
            'title_two',
            'title_three',
            'title_four',
            'title_five',
            'title_six',
          ];


          for (const field of imageFields) {
            if (productImage[field]) {
              const params = {
                Bucket: 'reservas-bucket', 
                Key: productImage[field], 
                Expires: 60 * 60, 
              };
              const imageUrl = await s3.getSignedUrlPromise('getObject', params);
              imageUrls.push(imageUrl);
            }
          }
        }

        return {
          ...product.toJSON(),
          images: imageUrls,
        };
      })
    );

    res.status(200).json(productsWithImages);
  } catch (error) {
    console.error('Erro ao buscar produtos mais recentes:', error);
   
    res.status(500).json({ message: 'Erro ao buscar produtos mais recentes.' });
  }
};



const searchProducts = async (req, res) => {
  try {
    const { query, maxPrice, promotion, category } = req.query;

    if (!query || query.trim() === "") {
      return res
        .status(400)
        .json({ errors: ["O termo de pesquisa não pode estar vazio."] });
    }

    const whereCondition = {
      [Op.or]: [
        { title: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
      ],
    };

    if (maxPrice) {
      whereCondition.price = { [Op.lte]: parseFloat(maxPrice) };
    }

    if (promotion !== undefined) {
      whereCondition.promotion = promotion === "true";
    }

    if (category) {
      whereCondition.category = category;
    }

    const products = await Product.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
    });

    if (products.length === 0) {
      return res.status(200).json([]); 
    }

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const productImage = await ProductImage.findOne({
          where: { productId: product.id },
        });

        let imageUrls = [];
        if (productImage) {
          const imageFields = [
            "title_one",
            "title_two",
            "title_three",
            "title_four",
            "title_five",
            "title_six",
          ];

          for (const field of imageFields) {
            if (productImage[field]) {
              const params = {
                Bucket: "reservas-bucket", 
                Key: productImage[field],  
                Expires: 60 * 60,          
              };
              const imageUrl = await s3.getSignedUrlPromise("getObject", params);
              imageUrls.push(imageUrl);
            }
          }
        }

        return {
          ...product.toJSON(),
          images: imageUrls,
        };
      })
    );

    return res.status(200).json(productsWithImages);

  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao realizar a busca, tente novamente mais tarde."] });
  }
};

const createOptionsTour = async (req, res) => {
  try {
    const { name, capacity, price, productId, timeSlots, dates } = req.body;

    const reqUser = req.user;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ errors: ["Produto não encontrado."] });
    }

    const business = await Business.findByPk(product.BusinessId);
    if (!business) {
      return res.status(404).json({ errors: ["Empresa não encontrada."] });
    }

    if (reqUser.id !== business.UserId) {
      return res.status(403).json({ errors: ["Você não tem permissão para editar este produto."] });
    }

    if (!name || !capacity || !price || !productId || !timeSlots.length || !dates.length) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios e não podem estar vazios.' });
    }

    timeSlots.forEach((slot) => {
      if (!slot.includes(' - ')) {
        throw new Error(`Formato inválido para o intervalo de horário: ${slot}`);
      }
    });

    const optionsData = [];
    dates.forEach((date) => {
      const adjustedDate = moment
        .tz(date, "America/Maceio")
        .format("YYYY-MM-DD");    

      timeSlots.forEach((slot) => {
        const [startHour, endHour] = slot.split(' - ');
        optionsData.push({
          name,
          capacity,
          price,
          productId,
          startHour,
          endHour,
          date: adjustedDate,
        });
      });
    });

    const createdOptions = await OptionsTour.bulkCreate(optionsData);

    return res.status(201).json({ message: 'Opções criadas com sucesso!', createdOptions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar opções de passeio.', details: error.message });
  }
};

const editOptionsTour = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, capacity, price, startHour, endHour, date } = req.body;

    const reqUser = req.user;

    const option = await OptionsTour.findByPk(id);

    if (!option) {
      return res.status(404).json({ errors: ["Opção de passeio não encontrada."] });
    }

    const product = await Product.findByPk(option.productId);
    if (!product) {
      return res.status(404).json({ errors: ["Produto associado não encontrado."] });
    }

    const business = await Business.findByPk(product.BusinessId);
    if (!business) {
      return res.status(404).json({ errors: ["Empresa associada não encontrada."] });
    }

    if (reqUser.id !== business.UserId) {
      return res.status(403).json({ errors: ["Você não tem permissão para editar esta opção."] });
    }

    if (!name || !capacity || !price || !startHour || !endHour || !date) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (!startHour.includes(':') || !endHour.includes(':')) {
      return res.status(400).json({ error: 'Formato de hora inválido. Use o formato HH:MM.' });
    }

    const adjustedDate = new Date(date);
    if (isNaN(adjustedDate.getTime())) {
      return res.status(400).json({ error: 'Data inválida.' });
    }

    option.name = name;
    option.capacity = capacity;
    option.price = price;
    option.startHour = startHour;
    option.endHour = endHour;
    option.date = adjustedDate.toISOString().split('T')[0]; 
    await option.save();

    return res.status(200).json({ message: 'Opção de passeio atualizada com sucesso!', option });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao editar a opção de passeio.', details: error.message });
  }
};

const deleteOptionsTour = async (req, res) => {
  try {
    const { id } = req.params; 
    const reqUser = req.user; 

    const optionTour = await OptionsTour.findByPk(id);
    if (!optionTour) {
      return res.status(404).json({ errors: ["Opção de passeio não encontrada."] });
    }

    const product = await Product.findByPk(optionTour.productId);
    if (!product) {
      return res.status(404).json({ errors: ["Produto associado não encontrado."] });
    }

    const business = await Business.findByPk(product.BusinessId);
    if (!business) {
      return res.status(404).json({ errors: ["Empresa associada não encontrada."] });
    }

    if (reqUser.id !== business.UserId) {
      return res.status(403).json({ errors: ["Você não tem permissão para deletar esta opção de passeio."] });
    }

    await Booking.destroy({ where: { optionTourId: id } });

    await optionTour.destroy();

    return res.status(200).json({ message: "Opção de passeio e reservas associadas deletadas com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar opção de passeio.", details: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const reqUser = req.user;

    const {
      ownerName,
      cpf,
      passportNumber,
      phone,
      email,
      birthDate,
      state,
      country,
      optionTourId,
    } = req.body;

    if (!ownerName || !email || !birthDate || !country || !optionTourId) {
      return res
        .status(400)
        .json({ error: "Os campos obrigatórios devem ser preenchidos." });
    }

    const optionTour = await OptionsTour.findByPk(optionTourId);
    if (!optionTour) {
      return res.status(404).json({ error: "Opção de passeio não encontrada." });
    }

    const product = await Product.findByPk(optionTour.productId);
    if (!product) {
      return res
        .status(404)
        .json({ error: "Produto associado à opção de passeio não encontrado." });
    }

    const business = await Business.findByPk(product.BusinessId);
    if (!business) {
      return res
        .status(404)
        .json({ error: "Empresa associada ao produto não encontrada." });
    }

    const bookingsCount = await Booking.count({ where: { optionTourId } });
    if (bookingsCount >= optionTour.capacity) {
      return res
        .status(400)
        .json({ error: "Capacidade máxima para esta opção de passeio já foi atingida." });
    }

    const booking = await Booking.create({
      userId: reqUser.id,
      ownerName,
      cpf,
      passportNumber,
      phone,
      email,
      birthDate,
      state,
      country,
      optionTourId,
      productId: product.id,
      businessId: business.id,
    });

    const encryptedId = crypto.randomBytes(3).toString("hex").toUpperCase();

    const qrCodeData = JSON.stringify({
      code: encryptedId,
      optionId: optionTourId,
    });

    const qrCodeFileName = `${encryptedId}.png`;

    const tmpFilePath = path.join(__dirname, "../tmp", qrCodeFileName);

    const qrCodeImageBuffer = await QRCode.toBuffer(qrCodeData);

    if (!fs.existsSync(path.join(__dirname, "../tmp"))) {
      fs.mkdirSync(path.join(__dirname, "../tmp"));
    }

    fs.writeFileSync(tmpFilePath, qrCodeImageBuffer);

    const uploadImagesServices = new UploadImagesServices();
    await uploadImagesServices.execute({
      path: tmpFilePath,
      filename: qrCodeFileName,
      mimetype: "image/png",
    });

    if (fs.existsSync(tmpFilePath)) {
      fs.unlinkSync(tmpFilePath);
    }

    const bookingCode = await BookingCode.create({
      bookingId: booking.id,
      encryptedId,
      qrCodeImage: qrCodeFileName,
    });

    await Notification.create({
      userId: reqUser.id,
      businessId: business.id,
      message: `Reserva confirmada para ${product.title} no dia ${optionTour.date
        .split("-")
        .reverse()
        .join("/")} para ${ownerName}`,
    });

    await NotificationBusiness.create({
      userId: business.UserId,
      businessId: business.id,
      message: `${business.name} recebeu uma reserva para ${product.title} no dia ${optionTour.date
        .split("-")
        .reverse()
        .join("/")} para ${ownerName}, opção ${optionTour.name}`,
    });

    return res.status(201).json({
      message: "Reserva criada com sucesso!",
      booking,
      bookingCode,
    });
  } catch (error) {
    console.error("Erro ao criar reserva:", error.message);
    return res.status(500).json({
      error: "Erro ao criar a reserva.",
      details: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const reqUser = req.user;

    if (!id) {
      return res.status(400).json({ error: 'O ID da reserva deve ser fornecido.' });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Reserva não encontrada.' });
    }

    const optionTour = await OptionsTour.findByPk(booking.optionTourId);
    if (!optionTour) {
      return res
        .status(404)
        .json({ error: "Opção de passeio não encontrada." });
    }

    const product = await Product.findByPk(optionTour.productId);
    if (!product) {
      return res
        .status(404)
        .json({ error: "Produto associado à opção de passeio não encontrado." });
    }
    
    const business = await Business.findByPk(booking.businessId);
    if (!business) {
      return res.status(404).json({ error: 'Empresa associada à reserva não encontrada.' });
    }

    if (reqUser.id !== business.UserId && reqUser.id !== booking.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar esta reserva.' });
    }
    
    await booking.destroy();

    const notification = await Notification.create({
      userId: reqUser.id,
      businessId: business.id,
      message: `CANCELAMENTO: Sua reserva para ${product.title} para dia ${optionTour.date.split("-").reverse().join("/")} para ${booking.ownerName} foi CANCELADA`,
    });

    const notificationBusiness = await NotificationBusiness.create({
      userId: business.UserId,
      businessId: business.id,
      message: `CANCELAMENTO: ${booking.ownerName} teve uma reserva para ${product.title} no dia ${optionTour.date.split("-").reverse().join("/")} para opção ${optionTour.name} CANCELADA`,
    });


    return res.status(200).json({
      message: 'Reserva deletada com sucesso!',
      deletedBookingId: id,
      notificationBusiness,
      notification,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao deletar a reserva.', details: error.message });
  }
};

const myBookings = async (req, res) => {
  try {
    const reqUser = req.user;

    // Busca todas as reservas do usuário
    const bookings = await Booking.findAll({
      where: { userId: reqUser.id },
      include: [
        {
          model: Product,
          as: "product",
        },
        {
          model: OptionsTour,
          as: "optionTour",
        },
        {
          model: BookingCode,
          as: "bookingCode", // Inclui o BookingCode associado
        },
      ],
    });

    if (!bookings.length) {
      return res
        .status(200)
        .json({ message: "Nenhuma reserva encontrada para o usuário.", bookings: [] });
    }

    // "Agora" em Maceió
    const nowMaceio = moment().tz("America/Maceio");
    console.log("DATA/HORA ATUAL EM MACEIÓ =", nowMaceio.format("YYYY-MM-DD HH:mm:ss"));

    // Processa as reservas para incluir o campo `isValid`
    const bookingData = await Promise.all(
      bookings.map(async (booking) => {
        const product = booking.product;
        const optionTour = booking.optionTour;
        const bookingCode = booking.bookingCode;

        // Busca imagens do produto
        let imageUrls = [];
        if (product) {
          const productImage = await ProductImage.findOne({
            where: { productId: product.id },
          });

          if (productImage) {
            const imageFields = [
              "title_one",
              "title_two",
              "title_three",
              "title_four",
              "title_five",
              "title_six",
            ];

            imageUrls = await Promise.all(
              imageFields
                .filter((field) => productImage[field])
                .map(async (field) => {
                  const params = {
                    Bucket: "reservas-bucket",
                    Key: productImage[field],
                    Expires: 60 * 60, // 1h
                  };
                  return s3.getSignedUrlPromise("getObject", params);
                })
            );
          }
        }

        // Gera uma URL pré-assinada para o QR Code
        let qrCodeUrl = null;
        if (bookingCode && bookingCode.qrCodeImage) {
          const qrCodeParams = {
            Bucket: "reservas-bucket",
            Key: bookingCode.qrCodeImage,
            Expires: 60 * 60, // 1h
          };
          qrCodeUrl = await s3.getSignedUrlPromise("getObject", qrCodeParams);
        }

        // Determina se o ticket ainda é válido
        // (só será válido se existir optionTour e se data/hora >= agora)
        let isValid = false;
        if (optionTour) {
          // Monta o dateTime no fuso de Maceió
          const optionDateTime = moment.tz(
            `${optionTour.date} ${optionTour.startHour}`,
            "YYYY-MM-DD HH:mm",
            "America/Maceio"
          );
          isValid = optionDateTime.isSameOrAfter(nowMaceio);
        }

        return {
          booking: {
            id: booking.id,
            birthDate: booking.birthDate,
            ownerName: booking.ownerName,
            state: booking.state,
            email: booking.email,
            phone: booking.phone,
            cpf: booking.cpf,
            passportNumber: booking.passportNumber,
          },
          product: product
            ? {
                id: product.id,
                name: product.title,
                description: product.description,
                price: product.price,
                category: product.category,
                images: imageUrls, // URLs pré-assinadas
              }
            : null,
          optionTour: optionTour
            ? {
                id: optionTour.id,
                name: optionTour.name,
                date: optionTour.date,
                startHour: optionTour.startHour,
                endHour: optionTour.endHour,
                price: optionTour.price,
                isValid, // TRUE se data/hora >= agora, senão FALSE
              }
            : null,
          bookingCode: bookingCode
            ? {
                encryptedId: bookingCode.encryptedId,
                qrCodeImage: qrCodeUrl, // URL pré-assinada
              }
            : null,
        };
      })
    );

    // Ordena os tickets: válidos primeiro, inválidos depois
    const sortedBookings = bookingData.sort((a, b) => {
      const aIsValid = a.optionTour?.isValid;
      const bIsValid = b.optionTour?.isValid;

      const dateA = new Date(a.optionTour?.date || 0);
      const dateB = new Date(b.optionTour?.date || 0);

      // 1. Se ambos são válidos, ordena por data crescente
      if (aIsValid && bIsValid) {
        return dateA - dateB;
      }
      // 2. Se ambos são inválidos, ordena por data decrescente
      if (!aIsValid && !bIsValid) {
        return dateB - dateA;
      }
      // 3. Válidos vêm antes de inválidos
      return aIsValid ? -1 : 1;
    });

    return res.status(200).json(sortedBookings);
  } catch (error) {
    console.error("Erro ao buscar reservas do usuário:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao buscar as reservas do usuário."] });
  }
};

const ticketConfirmed = async (req, res) => {
  try {
    const reqUser = req.user;
    const { code, optionId } = req.body;

    const bookingCode = await BookingCode.findOne({ where: { encryptedId: code } });
    if (!bookingCode) {
      return res.status(404).json({ errors: ["Ticket não encontrado."] });
    }

    const booking = await Booking.findOne({ where: { id: bookingCode.bookingId } });
    if (!booking) {
      return res.status(404).json({ errors: ["Reserva não encontrada."] });
    }

    if (booking.ticketConfirmed) {
      return res.status(409).json({
        errors: ["Ticket já usado!"],
    });
    }

    const optionTour = await OptionsTour.findByPk(optionId);
    if (!optionTour) {
      return res
        .status(404)
        .json({ errors: ["Opção de passeio pedida pela empresa não encontrada."] });
    }

    if (optionTour.id !== booking.optionTourId) {
      return res
        .status(404)
        .json({ errors: ["Opção de passeio não está na data ou hora correta."] });
    }

    const product = await Product.findByPk(optionTour.productId);
    if (!product) {
      return res
        .status(404)
        .json({ errors: ["Produto associado à opção de passeio não encontrado."] });
    }

    const business = await Business.findByPk(booking.businessId);
    if (!business) {
      return res.status(404).json({ errors: ["Empresa da reserva não encontrada."] });
    }

    if (reqUser.id !== business.UserId) {
      return res.status(403).json({
        errors: ["Você não tem permissão para confirmar esse ticket."],
      });
    }

    booking.ticketConfirmed = true;
    await booking.save();

    const notification = await Notification.create({
      userId: reqUser.id,
      businessId: business.id,
      message: `Seu ticket para ${product.title} foi usado e autorizado pela ${business.name}.`,
    });

    const notificationBusiness = await NotificationBusiness.create({
      userId: business.UserId,
      businessId: business.id,
      message: `Confirmado a autorização e utilização da reserva por ${booking.ownerName} para ${product.title} no dia ${optionTour.date
        .split("-")
        .reverse()
        .join("/")} para opção ${optionTour.name}`,
    });

    return res.status(200).json({
      message: "Ticket confirmado com sucesso!",
      booking,
      notification,
      notificationBusiness,
    });
  } catch (error) {
    console.error("Erro ao confirmar ticket do usuário:", error);
    return res.status(500).json({ errors: ["Erro ao confirmar ticket do usuário."] });
  }
};




const listBookingsByOptionTour = async (req, res) => {
  try {
    const { optionTourId } = req.params;
    const reqUser = req.user; 

    if (!optionTourId) {
      return res.status(400).json({ error: 'O ID da opção de passeio (optionTourId) deve ser fornecido.' });
    }

    const optionTour = await OptionsTour.findByPk(optionTourId);
    if (!optionTour) {
      return res.status(404).json({ error: 'Opção de passeio não encontrada.' });
    }
    
    const product = await Product.findByPk(optionTour.productId);
    if (!product) {
      return res.status(404).json({ error: 'Opção de produto não encontrada.' });
    }

     const business = await Business.findByPk(product.BusinessId);
     if (!business) {
       return res.status(404).json({ error: 'Opção de empresa não encontrada.' });
     }

     if (reqUser.id !== business.UserId) {
      return res.status(403).json({
          errors: ["Você não tem permissão para vizualizar está lista."],
      });
  }

    const bookings = await Booking.findAll({
      where: { optionTourId }});

    const result = bookings.map((booking) => ({
      id: booking.id,
      ownerPurchase: booking.userId,
      ownerName: booking.ownerName,
      cpf: booking.cpf,
      passportNumber: booking.passportNumber,
      phone: booking.phone,
      email: booking.email,
      birthDate: booking.birthDate,
      state: booking.state,
    }));

    

    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    return res.status(500).json({ error: 'Erro ao buscar reservas.', details: error.message });
  }
};

module.exports = {
    registerProduct,
    editProduct,
    deleteProduct,
    perfilProduct,
    perfilClientProduct,
    perfilProductBookings,
    seeOptionsProductBookings,
    promotionHome,
    searchProducts,
    productMulter,
    createAlbum,
    showAlbum,
    getProductsByAlbumId,
    moveAlbum,
    deleteProductImage,
    fetchProducts,
    deleteAlbum,
    recentsProductsHome,
    createOptionsTour,
    editOptionsTour,
    deleteOptionsTour,
    createBooking,
    deleteBooking,
    myBookings,
    ticketConfirmed,
    listBookingsByOptionTour
}

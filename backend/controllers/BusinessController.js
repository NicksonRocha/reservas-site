const User = require('../models/User')
const Booking = require('../models/Booking')
const Product = require('../models/Product')
const Business = require('../models/Business')
const ProductImage = require('../models/ProductImage')
const Album = require('../models/Album')
const OptionsTour = require('../models/OptionsTour');
const Notification = require('../models/Notification');
const NotificationBusiness = require('../models/NotificationBusiness');
const { Op } = require('sequelize');


const DeleteImagesServices = require('../services/DeleteImagesServices');
const UploadImagesServices = require('../services/UploadImagesServices');
const multerConfig = require('../config/multer');
const multer = require('multer');
const upMulter = multer(multerConfig);

const AWS = require('aws-sdk');


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'sa-east-1', 
});


const registerBusiness = async (req, res) => {
    const reqUser = req.user;
    const { name, category, cnpj } = req.body;

    const business = await Business.findOne({ where: { name } });
    if (business) {
        return res.status(422).json({ errors: ["Por favor utilize outro nome."] });
    }

    try {
        let profileImage = null;
        
        if (req.file) {
            const uploadImagesServices = new UploadImagesServices();
            await uploadImagesServices.execute(req.file); 
            profileImage = req.file.filename;
        }

        const newBusiness = await Business.create({        
            name,
            category,
            cnpj,
            profile_image: profileImage,
            UserId: reqUser.id
        });

        if (!newBusiness) {
            return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde"] });
        }

    const notification = await Notification.create({
      userId: reqUser.id,
      message: `Parabéns você criou a empresa ${name}.`,
    });

    const notificationBusiness = await NotificationBusiness.create({
      userId: reqUser.id,
      businessId: newBusiness.id,
      message: `${newBusiness.name} conta criada com sucesso, qualquer dúvida entra em contato com o sac da Reservas.`,
    });


        return res.status(201).json({newBusiness, notification, notificationBusiness});
    } catch (error) {
        console.error("Erro ao registrar negócio:", error);
        return res.status(500).json({ errors: ["Erro no servidor, por favor tente novamente mais tarde."] });
    }
};

const editBusiness = async (req, res) => {
    const { id } = req.params;
    const { name, category } = req.body;
    const reqUser = req.user;

    try {
       
        const business = await Business.findByPk(id);

        
        if (reqUser.id !== business.UserId) {
            return res.status(422).json({ errors: ["Você não pode editar esta empresa."] });
        }

        
        if (name) business.name = name;
        if (category) business.category = category;

        
        if (req.file) {

            if(!business.profile_image) {
            const uploadImagesServices = new UploadImagesServices();

       
            await uploadImagesServices.execute(req.file);

          
            business.profile_image = req.file.filename;
            } else {
                const deleteImagesServices = new DeleteImagesServices();

                await deleteImagesServices.execute(business.profile_image);

                business.profile_image = req.file.filename;

                const uploadImagesServices = new UploadImagesServices();

                
                await uploadImagesServices.execute(req.file);
            
            }
            
        }

        await business.save();

        const notification = await Notification.create({
          userId: reqUser.id,
          message: `Parabéns sua empresa ${business.name} foi editada com sucesso.`,
        });
    
        const notificationBusiness = await NotificationBusiness.create({
          userId: reqUser.id,
          businessId: business.id,
          message: `${business.name} foi editada com sucesso.`,
        });

        return res.status(200).json({business, notification, notificationBusiness});
    } catch (error) {
        console.error('Erro ao editar empresa:', error);
        return res.status(500).json({ error: 'Erro ao editar empresa' });
    }
};

const deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params; 
    const reqUser = req.user; 

    
    const business = await Business.findByPk(id);

    if (!business) {
      return res.status(404).json({ errors: ["Empresa não encontrada."] });
    }

    
    if (reqUser.id !== business.UserId) {
      return res.status(403).json({
        errors: ["Você não tem permissão para deletar esta empresa."],
      });
    }

    
    await Booking.destroy({ where: { businessId: id } });

    
    await NotificationBusiness.destroy({ where: { businessId: id } });
    await Notification.destroy({ where: { businessId: id } });

    
    const albums = await Album.findAll({ where: { BusinessId: id } });
    for (const album of albums) {
      const products = await Product.findAll({ where: { AlbumId: album.id } });

      for (const product of products) {
       
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

        
        await OptionsTour.destroy({ where: { productId: product.id } });

        
        await product.destroy();
      }

      await album.destroy();
    }

    const directProducts = await Product.findAll({ where: { BusinessId: id } });
    for (const product of directProducts) {
      
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

      await OptionsTour.destroy({ where: { productId: product.id } });

      await product.destroy();
    }

    await business.destroy();

    return res.status(200).json({ message: "Empresa e todas as dependências foram deletadas com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar a empresa:", error);
    return res.status(500).json({ errors: ["Erro no servidor, tente novamente mais tarde."] });
  }
};



const deleteBusinessProfileImage = async (req, res) => {
    try {
        const { id } = req.params;
        const reqUser = req.user;

        const business = await Business.findByPk(id);

        if (!business) {
            return res.status(404).json({ errors: ["Empresa não encontrada."] });
        }

        if (reqUser.id !== business.UserId) {
            return res.status(403).json({ errors: ["Você não tem permissão para excluir esta imagem."] });
        }

        if (!business.profile_image) {
            return res.status(400).json({ errors: ["Nenhuma imagem associada à empresa."] });
        }

        const deleteImagesServices = new DeleteImagesServices();
        await deleteImagesServices.execute(business.profile_image);

        business.profile_image = null;
        await business.save();

        return res.status(200).json({ message: "Imagem removida com sucesso." });
    } catch (error) {
        console.error('Erro ao deletar a imagem da empresa:', error);
        return res.status(500).json({ error: 'Erro ao deletar a imagem da empresa.' });
    }
};



const perfilBusiness = async (req, res) => {
    const { id } = req.params;
    const reqUser = req.user;

    try {
        const business = await Business.findByPk(id);

        if (!business) {
            return res.status(422).json({ errors: ["Essa empresa não existe."] });
        }

        if (reqUser.id !== business.UserId) {
            return res.status(422).json({ errors: ["Erro: você não está autorizado a acessar este perfil."] });
        }

        let profileImageUrl = null;
        if (business.profile_image) {
            const params = {
                Bucket: 'reservas-bucket', 
                Key: business.profile_image,
                Expires: 60 * 60, 
            };
            profileImageUrl = await s3.getSignedUrl('getObject', params);
        }

        

        return res.status(200).json({
            ...business.toJSON(),
            profileImageUrl, 
        });
    } catch (error) {
        console.error('Erro ao buscar o perfil da empresa:', error);
        return res.status(500).json({ error: 'Erro ao buscar o perfil da empresa' });
    }
};

const clientSeePerfilBusiness = async (req, res) => {
  const { id } = req.params;

  try {
      const business = await Business.findByPk(id);

      if (!business) {
          return res.status(422).json({ errors: ["Essa empresa não existe."] });
      }

      let profileImageUrl = null;
      if (business.profile_image) {
          const params = {
              Bucket: 'reservas-bucket', 
              Key: business.profile_image, 
              Expires: 60 * 60, 
          };
          profileImageUrl = await s3.getSignedUrl('getObject', params);
      }

      return res.status(200).json({
          ...business.toJSON(),
          profileImageUrl, 
      });
  } catch (error) {
      console.error('Erro ao buscar o perfil da empresa:', error);
      return res.status(500).json({ error: 'Erro ao buscar o perfil da empresa' });
  }
};



const viewProfileBusiness = async (req, res) => {

    const {id} = req.params

    const profile = await Business.findByPk(id)

    res.status(200).json(profile)

}

const myBusiness = async (req, res) => {
  try {
    const reqUser = req.user;

    const businesses = await Business.findAll({ where: { UserId: reqUser.id } });

    if (!businesses || businesses.length === 0) {
      return res.status(200).json({ message: ["Você ainda não tem empresas."] });
    }

    const businessesWithDetails = await Promise.all(
      businesses.map(async (business) => {
        let profileImageUrl = null;

        if (business.profile_image) {
          const params = {
            Bucket: 'reservas-bucket', 
            Key: business.profile_image, 
            Expires: 60 * 60, 
          };
          profileImageUrl = await s3.getSignedUrl('getObject', params);
        }

        const notifications = await NotificationBusiness.findAll({
          where: { businessId: business.id },
        });

        const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

        return {
          ...business.toJSON(),
          profileImageUrl,
          unreadNotificationsCount,
        };
      })
    );

    return res.status(200).json(businessesWithDetails);
  } catch (error) {
    console.error("Erro ao buscar informações das empresas:", error);
    return res.status(500).json({ errors: ["Erro ao realizar a busca, tente novamente mais tarde."] });
  }
};

const getBusinessNotifications = async (req, res) => {
    try {
      const reqUser = req.user; 
      const { id } = req.params; 
        if (!id) {
                return res.status(400).json({
                errors: ["ID da empresa é obrigatório."],
                });
            }

      const business = await Business.findByPk(id);
    if (!business) {
      return res.status(404).json({ error: 'Empresa associada as notificações não encontrada.' });
    }  
        
      if (reqUser.id !== business.UserId) {
        return res.status(403).json({ error: 'Você não tem permissão para ver essas notificações.' });
      }
        
      const businessNotifications = await NotificationBusiness.findAll({
        where: { businessId: business.id }, 
        order: [['createdAt', 'DESC']],
      });
  
      if (!businessNotifications || businessNotifications.length === 0) {
        return res.status(200).json({
          message: "Nenhuma notificação encontrada para esta empresa.",
          notifications: [],
        });
      }
  
      const notificationData = businessNotifications.map((notification) => ({
        id: notification.id,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      }));
  
      return res.status(200).json({
        message: "Notificações carregadas com sucesso.",
        notifications: notificationData,
      });
    } catch (error) {
      console.error("Erro ao buscar notificações da empresa:", error);
      return res.status(500).json({
        errors: ["Erro ao buscar as notificações da empresa."],
      });
    }
  };

  const markNotificationsBusinessAsRead = async (req, res) => {
    try {
      const reqUser = req.user; 

      const { id } = req.params; 
        if (!id) {
                return res.status(400).json({
                errors: ["ID da empresa é obrigatório."],
                });
            }

      const business = await Business.findByPk(id);
    if (!business) {
      return res.status(404).json({ error: 'Empresa associada as notificações não encontrada.' });
    }  
        
      if (reqUser.id !== business.UserId) {
        return res.status(403).json({ error: 'Você não tem permissão para marcar como lido essas notificações.' });
      }
  
      const unreadNotifications = await NotificationBusiness.findAll({
        where: {          
          isRead: false,
          businessId: business.id,
        },
      });
  
      if (!unreadNotifications || unreadNotifications.length === 0) {
        return res.status(200).json({
          message: "Todas as notificações já estão lidas.",
          notifications: [],
        });
      }
  
      await NotificationBusiness.update(
        { isRead: true },
        {
          where: {
            isRead: false,
            businessId: business.id,
          },
        }
      );
  
      return res.status(200).json({
        message: "Notificações não lidas foram marcadas como lidas.",
        updatedNotificationsCount: unreadNotifications.length,
      });
    } catch (error) {
      console.error("Erro ao atualizar notificações para lidas:", error);
      return res.status(500).json({
        errors: ["Erro ao atualizar notificações para lidas."],
      });
    }
  };


const searchBusiness = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ errors: ["O termo de pesquisa não pode estar vazio."] });
        }

        const whereCondition = {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: `%${query}%`
                    }
                },
                {
                    category: {
                        [Op.like]: `%${query}%`
                    }
                }
            ]
        };

        const business = await Business.findAll({
            where: whereCondition,
            order: [['createdAt', 'DESC']]
        });

        if (business.length === 0) {
            return res.status(404).json({ message: "Nenhuma empresa encontrada." });
        }

        return res.status(200).json(business);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ errors: ["Erro ao realizar a busca, tente novamente mais tarde."] });
    }
};


  

module.exports = {
    registerBusiness,
    editBusiness,
    perfilBusiness,
    clientSeePerfilBusiness,
    viewProfileBusiness,
    myBusiness,
    getBusinessNotifications,
    markNotificationsBusinessAsRead,
    searchBusiness,
    upMulter,
    deleteBusinessProfileImage,
    deleteBusiness,
}
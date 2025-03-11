const Business = require('../models/Business')
const Product = require('../models/Product');
const { Op } = require('sequelize');


const searchAll = async (req, res) => {
    try {
        const { query, maxPrice, promotion, category } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ errors: ["O termo de pesquisa não pode estar vazio."] });
        }

        const businessCondition = {
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

        const productCondition = {
            [Op.or]: [
                {
                    title: {
                        [Op.like]: `%${query}%`
                    }
                },
                {
                    description: {
                        [Op.like]: `%${query}%`
                    }
                }
            ]
        };

        if (maxPrice) {
            productCondition.price = {
                [Op.lte]: parseFloat(maxPrice)
            };
        }

        if (promotion !== undefined) {
            productCondition.promotion = promotion === 'true';
        }

        if (category) {
            productCondition.category = category;
        }

        const [businesses, products] = await Promise.all([
            Business.findAll({ where: businessCondition, order: [['createdAt', 'DESC']] }),
            Product.findAll({ where: productCondition, order: [['createdAt', 'DESC']] })
        ]);

        const result = {
            businesses: businesses.length > 0 ? businesses : [],
            products: products.length > 0 ? products : [],
          };

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ errors: ["Erro ao realizar a busca, tente novamente mais tarde."] });
    }
};

module.exports = { searchAll };
const tasksModel = require('../models/tasksModel')
const getAll = async (request, response) => {
    const tasks = await tasksModel.getAll();


    return response.status(200).json({tasks});
};

const getProducts = async (request, response) => {
    const products = await tasksModel.getProducts();
    return response.status(200).json({ products });
  };

module.exports =  {
    getAll,
    getProducts,
};
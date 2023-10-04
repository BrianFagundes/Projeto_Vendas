const { request, response } = require('express');
const tasksModel = require('../models/tasksModel')
const getAll = async (request, response) => {
    const tasks = await tasksModel.getAll();


    return response.status(200).json({tasks});
};

const getProducts = async (request, response) => {
    const products = await tasksModel.getProducts();
    return response.status(200).json({ products });
  };

  const login = async (req, res) => {
    try {
      const { codrep } = req.body;
      const result = await tasksModel.verifyLogin(codrep);
  
      if (result) {
        res.status(200).json({ success: true, message: 'Login bem-sucedido' });
      } else {
        res.status(401).json({ success: false, message: 'Código de representante inválido' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
  };

  const produto = async (req, response) => {
    try {
      const { codpro,numsep } = req.body;
      const result = await tasksModel.verifyProducts(codpro,numsep);
  
      if (result) {
        response.status(200).json({ success: true, message: 'Consulta bem-sucedida', data: result });
      } else {
        response.status(401).json({ success: false, message: 'Código de produto inválido' });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, message: 'Erro no servidor' });
    }
  };

module.exports =  {
    getAll,
    getProducts,
    login,
    produto,
};
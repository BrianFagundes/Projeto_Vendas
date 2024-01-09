const tasksModel = require('../models/tasksModel')

// Adicione no início do seu arquivo ou onde você gerencia as configurações
const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb://127.0.0.1:27017'; // Substitua com suas configurações
const dbName = 'controlelog'; // Substitua com o nome do seu banco de dados
const collectionName = 'log'; // Substitua com

const client = new MongoClient(mongoURI);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
}

connectToMongoDB();

const validateBody = (request, response, next) =>{
    const {result} = request;

        if (result.recordset.length === 1) {
        // Código de representante válido
        res.status(200).json({ success: true, message: 'Login bem-sucedido' });
    } else {
        // Código de representante inválido
        res.status(401).json({ success: false, message: 'Código de representante inválido' });
    }
    next();

};
const validateProduct = (request, res, next) =>{
    const {result} = request;

        if (result.recordset.length === 1) {
        // Código de representante válido
        res.status(200).json({ success: true, message: 'Produto encontrado' });
    } else {
        // Código de representante inválido
        res.status(401).json({ success: false, message: 'Código de produto inválido' });
    }
    next();

};

const logAccess = async (req, res, next) => {
  try {
    const { codrep } = req.body;
    const ipAddress = req.ip;

    // Verificar o login usando a lógica no seu modelo
    const loginSuccessful = await tasksModel.verifyLogin(codrep);

    if (loginSuccessful) {
      // Salvar informações no MongoDB
      await saveAccessLog(codrep, ipAddress);
      
      next();
    } else {
      res.status(401).json({ success: false, message: 'Login inválido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};

  // Função para salvar informações no MongoDB
  const saveAccessLog = async (codrep, ipAddress) => {
    try {
      const db = client.db(dbName);
      const accessLogs = db.collection(collectionName);
  
      const accessLog = {
        codrep: codrep,
        ipAddress: ipAddress,
        timestamp: new Date(),
      };
  
      await accessLogs.insertOne(accessLog);
      console.log('Log de acesso salvo no MongoDB');
    } catch (error) {
      console.error('Erro ao salvar o log de acesso no MongoDB:', error);
    }
  };

  const authenticate = (req, res, next) => {
    if (req.session.user) {
      // Usuário autenticado, permita o acesso
      next();
    } else {
      // Usuário não autenticado, redirecione para a página de login
      res.redirect('/login');
    }
  };
  

module.exports={
    validateBody,
    validateProduct,
    logAccess
}
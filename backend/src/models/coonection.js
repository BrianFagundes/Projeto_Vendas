const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    encrypt: false,
};
const pool = new sql.ConnectionPool(config);

// Abre a conexão a partir da pool
pool.connect()
  .then((pool) => {
    // Executa consultas aqui

    // Após todas as consultas terem sido concluídas, feche a pool
    pool.close()
      .then(() => {
        // A pool está fechada com sucesso aqui
      })
      .catch((err) => {
        // Lidar com erros de fechamento da pool, se necessário
      });
  })
  .catch((err) => {
    // Lidar com erros de conexão
  });

  module.exports ={
    config,
  }
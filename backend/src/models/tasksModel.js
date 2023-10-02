const sql = require('mssql');
const connection = require('./coonection'); // Certifique-se de que o arquivo de conexão esteja configurado corretamente

const getAll = async () => {
  try {
    const pool = await sql.connect(connection.config); // Use a configuração da conexão do seu arquivo de conexão

    const result = await pool.query(`
      SELECT a.codrep, b.nomrep, a.codfil, c.sigfil, c.nomfil, c.usu_codtpr
      FROM e090var a
      INNER JOIN e090rep b ON a.codrep = b.codrep
      INNER JOIN e070fil c ON a.codfil = c.codfil
      WHERE a.codrep = '745'
    `);

    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAll,
};

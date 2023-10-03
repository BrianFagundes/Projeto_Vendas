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

const getProducts = async () => {
  try {
    const pool = await sql.connect(connection.config);

    const result = await pool.query(`
      SELECT DISTINCT
        CONCAT(b.codpro,' - ',b.despro) as Produto,
        b.usu_tspajb as Titulo,
        b.usu_dapajb as Caracteristica,
        CASE
          WHEN b.usu_codseg='2' AND b.usu_moeven='AU' then REPLACE(ROUND(b.usu_preven*678,0),'.',',')
          WHEN b.usu_codseg='1' AND b.usu_moeven='AU' then REPLACE(ROUND(((b.usu_preven*678)+((b.usu_preven*678)/100*10)),0),'.',',')
          WHEN b.usu_codseg='3' AND b.usu_moeven='AU' then REPLACE(ROUND(((b.usu_preven*678)-((b.usu_preven*678)/100*10)),0),'.',',')
          WHEN b.usu_codseg='4' AND b.usu_moeven='AU' then REPLACE(ROUND(((b.usu_preven*678)-((b.usu_preven*678)/100*20)),0),'.',',')
          WHEN b.usu_codseg='5' AND b.usu_moeven='AU' then REPLACE(ROUND(((b.usu_preven*678)-((b.usu_preven*678)/100*30)),0),'.',',')
          WHEN b.usu_codseg='2' AND b.usu_moeven<>'AU' then REPLACE(ROUND(b.usu_preven,0),'.',',')
          WHEN b.usu_codseg='1' AND b.usu_moeven<>'AU' then REPLACE(ROUND(((b.usu_preven)+((b.usu_preven)/100*10)),0),'.',',')
          WHEN b.usu_codseg='3' AND b.usu_moeven<>'AU' then REPLACE(ROUND(((b.usu_preven)-((b.usu_preven)/100*10)),0),'.',',')
          WHEN b.usu_codseg='4' AND b.usu_moeven<>'AU' then REPLACE(ROUND(((b.usu_preven)-((b.usu_preven)/100*20)),0),'.',',')
          WHEN b.usu_codseg='5' AND b.usu_moeven<>'AU' then REPLACE(ROUND(((b.usu_preven)-((b.usu_preven)/100*30)),0),'.',',')
        END AS PRECO,
        CONCAT('http://joias.synergie.com.br/uploads/produtos/',b.codref,'.jpg') as Foto
      FROM e210dls a
      INNER JOIN e075pro b ON a.codpro = b.codpro
      WHERE a.codpro = '9816160a' OR a.numsep = '9816160a'
    `);

    return result.recordset;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const verifyLogin = async (codrep) => {
  try {
    const pool = await sql.connect(connection.config);
    
    const request = pool.request();
    request.input('codrep', sql.VarChar, codrep); // Declare o parâmetro 'codrep'

    const result = await request.query(`
      SELECT a.codrep, b.nomrep
      FROM e090var a
      INNER JOIN e090rep b ON a.codrep = b.codrep
      WHERE a.codrep = @codrep
    `);

    return result.recordset.length === 1;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAll,
  getProducts,
  verifyLogin,
};

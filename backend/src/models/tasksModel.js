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
    select 
    iclis as codrep,
    rclis as nomrep 
    from sljcli 
    where 
    grupos='VENDEDOR' and iclis= @codrep
    `);

    return result.recordset.length === 1;
  } catch (error) {
    throw error;
  }
};

const verifyProducts = async (codpro, numsep) => {
  try {
    const pool = await sql.connect(connection.config);

    const request = pool.request();

    request.input('codpro', sql.VarChar, codpro); // Declare o parâmetro 'codpro'
    request.input('numsep', sql.VarChar, numsep); // Declare o parâmetro 'codpro'

    const result = await request.query(`
    select 
    REPLACE(cpros,' ','') as Produto,
    REPLACE(dpros,' ','') as Titulo,
    REPLACE(colecoes,' ','') as Caracteristica,
    CASE
              WHEN moevs='AU' then REPLACE(ROUND(pvens*678,0),'.',',')
              WHEN moevs<>'AU' then REPLACE(ROUND(pvens,0),'.',',')
    END AS PRECO,
    CONCAT('http://127.0.0.1/ProjetoHTML/Fotos/',REPLACE(cpros,' ',''),'.jpg') as Foto
    from sljpro where cpros=@codpro
    `);

    if (result.recordset.length === 1) {
      // Se houver um único registro, retorne os dados desse registro
      return result.recordset[0];
    } else {
      // Se não houver resultados, retorne null
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const codbar = async (numsep) =>{
  try{
    const pool = await sql.connect(connection.config);
    const request = pool.request();

    request.input('numsep', sql.VarChar, numsep);

    const result = await request.query(`
    
    select distinct cpros from sljeti where cbars = @numsep
    
    `);

    if (result.recordset.length ===  1){
      return result.recordset[0];
    }else {
      return null
    }
  } catch(error){
    console.error(error);
    throw error;
  }
};

const InfoPlus = async (codpro) => {
  try{
    const pool = await sql.connect(connection.config);
    const request = pool.request();

    request.input('codpro', sql.VarChar, codpro);

    const result = await request.query(`
    
    SELECT
    cpros as referencia,
    codcors as cor,
    codtams as tamanho,
    empos as lojas,
    cbars as serie,
    localizas as local,
    qtds as quantidade
    from
    sljeti
    where qtds>0 and grupos='ESTOQUE' and contas='ESTOQUE' and cpros= @codpro
  
    `);

    if (result.recordset){
      return result.recordset;
    }else {
      return null;
    }
  }catch(error){
    console.error(error);
    throw error;
  }
};

const prodSugeridos = async (codpro) => {
  try {
    const pool = await sql.connect(connection.config);
    const request = pool.request();

    request.input('codpro', sql.VarChar, codpro);

    const result = await request.query(`
    select reffs from sljpro where cpros= @codpro

    `);

    if (result.recordset && result.recordset.length > 0) {
      const modifiedResults = result.recordset.map((record) => {
        if (record.usu_profor && record.usu_profor.length > 2) {
          record.usu_profor = record.usu_profor.substring(2, 8);
        }
        return record;
      });

      // Obtendo o resultado manipulado para a próxima consulta
      const resultadoManipulado = modifiedResults.map((record) => record.usu_profor);

      // Consulta usando o resultado manipulado para coletar o campo 'codpro'
      const likeQuery = `select cpros from sljpro where reffs like @resultado`;
      const likeRequest = pool.request();
      likeRequest.input('resultado', sql.VarChar, `%${resultadoManipulado}%`);
      const likeResult = await likeRequest.query(likeQuery);

      if (likeResult.recordset && likeResult.recordset.length > 0) {
        const productsInfo = [];

        for (const item of likeResult.recordset) {
          const productInfo = await verifyProducts(item.codpro); // Substitua 'numsep' pelo valor apropriado

          if (productInfo) {
            productsInfo.push(productInfo);
          }
        }

        if (productsInfo.length > 0) {
          return productsInfo;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};




module.exports = {
  getAll,
  getProducts,
  verifyLogin,
  verifyProducts,
  codbar,
  prodSugeridos,
  InfoPlus
};

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

module.exports={
    validateBody,
    validateProduct,
}
const validateBody = (request, response, next) =>{
    const {body} = request;

    if(body.title == undefined){
        return response.status(400).json({message: 'Erro, usuario não encontrado'})
    }
    if(body.title == ''){
        return response.status(400).json({message: 'Erro, usuario não encontrado'})
    }

    next();

};

module.exports={
    validateBody,
}
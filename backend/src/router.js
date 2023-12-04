const express = require('express');

const router = express.Router();

const tasksController = require('./controllers/tasksController');
const tasksMiddleware = require('./middlewares/tasksMiddleware');


router.get('/tasks', tasksController.getAll);
router.get('/products', tasksController.getProducts);
router.post('/login', tasksMiddleware.logAccess,tasksController.login);
router.post('/produto', tasksController.produto);
router.post('/codbar', tasksController.codbar);
router.post('/info', tasksController.InfoPlus);
router.post('/prodSugeridos', tasksController.prodSugeridos);



module.exports = router;
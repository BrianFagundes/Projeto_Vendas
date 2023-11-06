const express = require('express');

const router = express.Router();

const tasksController = require('./controllers/tasksController');
const tasksMiddleware = require('./middlewares/tasksMiddleware')


router.get('/tasks', tasksController.getAll);
router.get('/products', tasksController.getProducts);
router.post('/login', tasksController.login);
router.post('/produto', tasksController.produto);
router.post('/estoque', tasksController.estoque);



module.exports = router;
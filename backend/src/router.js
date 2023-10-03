const express = require('express');

const router = express.Router();

const tasksController = require('./controllers/tasksController');
const tasksMiddleware = require('./middlewares/tasksMiddleware')


router.get('/tasks', tasksController.getAll);
router.get('/products', tasksController.getProducts);



module.exports = router;
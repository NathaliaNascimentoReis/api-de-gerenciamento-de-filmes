import express from 'express';
import * as controller from '../controllers/moviesController.js';

const router = express.Router();

router.post('/movie', controller.create);
router.get('/movies', controller.getAll);
router.get('/movie/:id', controller.getById);
router.put('/movie/:id', controller.update);
router.delete('/movie/:id', controller.remove);

export default router;
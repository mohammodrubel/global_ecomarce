import { Router } from 'express';

import { advertisementController } from './ad.controller';


const router = Router();

router.route('/')
.post(advertisementController.createAdd)
.get(advertisementController.getAllAdd);

router
  .route('/:id')
  .get(advertisementController.getSingleAdd)
  .put(advertisementController.updateSingleAdd)
  .delete(advertisementController.deleteAdd);

export const advertisementRouter = router;

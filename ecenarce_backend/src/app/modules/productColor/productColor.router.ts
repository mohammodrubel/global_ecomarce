import { Router } from 'express';
import { ProductColorController } from './productColor.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductControllerValidation } from './productColor.validation';

const router = Router();

router
  .route('/')
  .post(
    validateRequest(ProductControllerValidation),
    ProductColorController.createProductColor,
  )
  .get(ProductColorController.getAllProductColors);

router
  .route('/:id')
  .get(ProductColorController.getSingleProductColor)
  .put(
    validateRequest(ProductControllerValidation),
    ProductColorController.updateProductColor,
  )
  .delete(ProductColorController.deleteProductColor);

export const ProductColorRouter = router;

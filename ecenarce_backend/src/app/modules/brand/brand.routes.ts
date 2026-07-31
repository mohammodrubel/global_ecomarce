import { Router } from 'express';
import { BrandController } from './brand.controller';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

router
  .route('/')
  .post(
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    BrandController.createBrand,
  )
  .get(BrandController.getAllBrand);

router
  .route('/:id')
  .get(BrandController.getBrand)
  .put(BrandController.updateBrand)
  .patch(upload.single('file'), BrandController.updateBrandPhoto)
  .delete(BrandController.deleteBrand);

export const brandRouter = router;

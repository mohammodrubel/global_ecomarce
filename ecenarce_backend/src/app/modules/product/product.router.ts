// app/modules/product/product.routes.ts
import { NextFunction, Request, Response, Router } from 'express';
import { ProductController } from './product.controller';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

router
  .route('/')
  .post(
    upload.array('files', 3),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    ProductController.createProduct,
  )
  .get(ProductController.getAllProducts);

router.get('/fetchers-products', ProductController.fetchersProduct);
router.get('/new-products', ProductController.newProduct);
router.get('/bestsellers', ProductController.getBestsellers);
router.get('/related-products/:id', ProductController.relatedCategory);
router.get('/discounted-products', ProductController.getDiscountedProducts);

// Independent product image management (add / replace / remove)
router.patch(
  '/:id/images',
  upload.array('files', 3),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  ProductController.updateProductImages,
);

router
  .route('/:id')
  .get(ProductController.getProduct)
  .put(ProductController.updateProduct)
  .delete(ProductController.deleteProduct);

export const productRouter = router;

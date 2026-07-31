import { NextFunction, Request, Response, Router } from 'express';
import { CategoryController } from './category.controller';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

// Main category routes
router
  .route('/')
  .post(
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    CategoryController.createCategory,
  )
  .get(CategoryController.getCategories);


router.get('/forrelations', CategoryController.getCategoryForRelations);

// Routes for specific category by ID
router
  .route('/:id')
  .get(CategoryController.getCategory)
  .put(CategoryController.updateCategory)
  .delete(CategoryController.deleteCategory);

export const categoryRouter = router;

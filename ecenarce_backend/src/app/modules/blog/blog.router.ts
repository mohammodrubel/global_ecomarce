import { Router } from 'express';

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { upload } from '../../utils/sendImageToCloudinary';
import { blogController } from './blog.controller';

const router = Router();

router
  .route('/')
  .post(
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    blogController.createBlog,
  )
  .get(blogController.getAllBlog);

router
  .route('/:id')
  .get(blogController.getSingleBlog)
  .put(blogController.updateBlog)
  .delete(blogController.deleteBlog);

export const blogRouter = router;

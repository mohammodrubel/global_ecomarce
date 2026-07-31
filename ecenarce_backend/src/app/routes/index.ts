import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { userRouter } from '../modules/user/user.router';
import { categoryRouter } from '../modules/category/category.route';
import { brandRouter } from '../modules/brand/brand.routes';
import { productRouter } from '../modules/product/product.router';
import { SpecialOfferRouter } from '../modules/special-offer/special-offer.router';
import { SliderRouter } from '../modules/slider/slider.router';
import { blogRouter } from '../modules/blog/blog.router';
import { advertisementRouter } from '../modules/AD/add.router';
import { ProductColorRouter } from '../modules/productColor/productColor.router';


const router = express.Router();

type Route = {
  path: string;
  route: express.Router;
};

const routes: Route[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/category',
    route: categoryRouter,
  },
  {
    path: '/brand',
    route: brandRouter,
  },
  {
    path: '/products',
    route: productRouter,
  },
  {
    path: '/special-offer',
    route: SpecialOfferRouter,
  },
  {
    path: '/slider',
    route: SliderRouter,
  },
  {
    path: '/blog',
    route: blogRouter,
  },
  {
    path: '/advertisement',
    route: advertisementRouter,
  },
  {
    path: '/product-color',
    route: ProductColorRouter,
  },
];
;
routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;

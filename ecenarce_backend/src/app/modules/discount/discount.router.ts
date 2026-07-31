// app/modules/discount/discount.routes.ts
import { Router } from 'express';
import { DiscountController } from './discount.controller';

const router = Router();

router.post('/', DiscountController.createDiscount);
router.get('/', DiscountController.getAllDiscounts);
router.get('/active', DiscountController.getActiveDiscounts);
router.get('/product/:productId', DiscountController.getProductDiscounts);
router.get('/:discountId', DiscountController.getDiscountById);
router.patch('/:discountId/deactivate', DiscountController.deactivateDiscount);
router.put('/:discountId', DiscountController.updateDiscount);
router.delete('/:discountId', DiscountController.deleteDiscount);

export const discountRoutes = router;

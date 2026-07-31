import { Router } from 'express';
import SliderController from './slider.controller';

const router = Router();

// ✅ /api/v1/slider
router
  .route('/')
  .post(SliderController.createSlider) // Create a new slider
  .get(SliderController.getAllSliders); // Get all sliders

// ✅ /api/v1/slider/:id
router
  .route('/:id')
  .get(SliderController.getSingleSlider) // Get single slider
  .put(SliderController.updateSlider) // Update slider
  .delete(SliderController.deleteSlider); // Delete slider

export const SliderRouter = router;

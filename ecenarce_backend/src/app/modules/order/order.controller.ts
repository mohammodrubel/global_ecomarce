import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderService } from './order.service';

const CreateOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.CreateOrder(req.user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order placed successfully',
    data: result,
  });
});

const GetMyOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.GetMyOrders(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Your orders retrieved',
    data: result,
  });
});

const GetAllOrders = catchAsync(async (_req: Request, res: Response) => {
  const result = await OrderService.GetAllOrders();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All orders retrieved',
    data: result,
  });
});

const GetOrderById = catchAsync(async (req: Request, res: Response) => {
  const isAdmin = req.user.role === 'ADMIN';
  const result = await OrderService.GetOrderById(
    req.params.id,
    req.user.id,
    isAdmin,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order retrieved',
    data: result,
  });
});

const UpdateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.UpdateOrderStatus(
    req.params.id,
    req.body.status,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order status updated',
    data: result,
  });
});

const CancelOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.CancelOrder(req.params.id, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order cancelled',
    data: result,
  });
});

export const OrderController = {
  CreateOrder,
  GetMyOrders,
  GetAllOrders,
  GetOrderById,
  UpdateOrderStatus,
  CancelOrder,
};

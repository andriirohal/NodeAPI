import type { Request, Response, NextFunction } from "express";

import * as services from "../services/product.service.js";
import type { CreateProductInput, UpdateProductInput } from "../types/product.types.js";

export async function getProductController(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const response = await services.getProduct(id);

    if (!response.success) {
      return res.status(response.status).json(response);
    };

    return res.status(response.status).json(response.data);
  
  } catch(error) {
    next(error);
  };
};

export async function createProductController(req: Request<{}, {}, CreateProductInput>, res: Response, next: NextFunction) {
  try {
    const response = await services.createProduct(req.body);

    if (!response.success) {
      return res.status(response.status).json(response);
    };

    return res.status(response.status).json(response.data);
  
  } catch(error) {
    next(error);
  };
};

export async function deleteProductController(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const response = await services.deleteProduct(id);

    if (!response.success) {
      return res.status(response.status).json(response);
    };

    return res.status(response.status).json(response.data);
  
  } catch(error) {
    next(error);
  };
};

export async function updateProductController(req: Request<{ id: string }, {}, UpdateProductInput>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const response = await services.updateProduct(id, req.body);

    if (!response.success) {
      return res.status(response.status).json(response);
    };

    return res.status(response.status).json(response.data);
  
  } catch(error) {
    next(error);
  };
};

export async function getProductsController(req: Request<{}, {}, {}, { limit: number, offset: number }>, res: Response, next: NextFunction) {
  try {
    const { limit } = req.query;
    const { offset } = req.query;

    const response = await services.getProducts(limit, offset);  

    if (!response.success) {
      return res.status(response.status).json(response);
    };
    
    return res.status(response.status).json(response.data);
  
  } catch(error) {
    next(error);
  };
};
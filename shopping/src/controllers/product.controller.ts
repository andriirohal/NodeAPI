import type { Request, Response, NextFunction } from "express";

import * as services from "../services/product.service.js";
import type { CreateProductInput, UpdateProductInput } from "../types/product.types.js";

export async function getProductController(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const retrievedProduct = await services.getProduct(id);

    if (!retrievedProduct.success) {
      return res.status(retrievedProduct.status).json(retrievedProduct.error);
    };

    return res.status(retrievedProduct.status).json(retrievedProduct.data);
  
  } catch(error) {
    next(error);
  };
};

export async function createProductController(req: Request<{}, {}, CreateProductInput>, res: Response, next: NextFunction) {
  try {
    const createdProduct = await services.createProduct(req.body);

    if (!createdProduct.success) {
      return res.status(createdProduct.status).json(createdProduct.error);
    };

    return res.status(createdProduct.status).json(createdProduct.data);
  
  } catch(error) {
    next(error);
  };
};

export async function deleteProductController(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const deletedProduct = await services.deleteProduct(id);

    if (!deletedProduct.success) {
      return res.status(deletedProduct.status).json(deletedProduct.error);
    };

    return res.status(deletedProduct.status).json(deletedProduct.data);
  
  } catch(error) {
    next(error);
  };
};

export async function updateProductController(req: Request<{ id: string }, {}, UpdateProductInput>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const updatedProduct = await services.updateProduct(id, req.body);

    if (!updatedProduct.success) {
      return res.status(updatedProduct.status).json(updatedProduct.error);
    };

    return res.status(updatedProduct.status).json(updatedProduct.data);
  
  } catch(error) {
    next(error);
  };
};

export async function getProductsController(req: Request<{}, {}, {}, { limit: number, offset: number }>, res: Response, next: NextFunction) {
  try {
    const { limit } = req.query;
    const { offset } = req.query;

    const retrievedProducts = await services.getProducts(limit, offset);  

    if (!retrievedProducts.success) {
      return res.status(retrievedProducts.status).json(retrievedProducts.error);
    };
    
    return res.status(retrievedProducts.status).json(retrievedProducts.data);
  
  } catch(error) {
    next(error);
  };
};
import { Prisma } from "@prisma/client";

import type { Product, CreateProductInput, UpdateProductInput, Result } from "../types/product.types.js";
import { isValidName, isValidPrice, isValidStock, normalizedLimit, normalizedOffset } from "../helpers/product.helper.js";

import { client } from "../prisma/client.js";

export async function createProduct(input: CreateProductInput): Promise<Result<Product>> {
  const { name, price, stock } = input;

  if(!isValidName(name)) {
    return {
      success: false,
      error: "Name cannot be empty",
      status: 400
    };
  };

  if(!isValidPrice(price)) {
    return {
      success: false,
      error: "Price must be greater than 0",
      status: 400
    };
  };

  if(!isValidStock(stock)) {
    return {
      success: false,
      error: "Stock must be positive",
      status: 400
    };
  };

  const product = await client.products.create({
    data: {
      name,
      price,
      stock
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      created_at: true,
      updated_at: true
    }
  });

  const response = {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    stock: product.stock,
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };

  return {
    success: true,
    data: response,
    status: 201
  };
};

export async function deleteProduct(id: string): Promise<Result<Product>> {
  try {
    const product = await client.products.delete({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        created_at: true,
        updated_at: true
      }
    });

    const response = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };

    return {
      success: true,
      data: response,
      status: 200
    };

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return {
        success: false,
        error: "Product not found",
        status: 404
      };
    };

    throw error;
  };
};

export async function getProduct(id: string): Promise<Result<Product>> {
  const product = await client.products.findUnique({
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      created_at: true,
      updated_at: true
    },
    where: {
      id
    }
  });

  if (!product) {
    return {
      success: false,
      error: "Product not found",
      status: 404
    };
  };

  const response = {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    stock: product.stock,
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };

  return {
    success: true,
    data: response,
    status: 200
  };
};

export async function updateProduct(id: string, input: Partial<UpdateProductInput>): Promise<Result<Product>> {
  try {
    const { name, price, stock } = input;
  
    if (input.name != null && !isValidName(name)) {
      return {
        success: false,
        error: "Name cannot be empty",
        status: 400
      };
    };
  
    if (price != null && !isValidPrice(price)) {
      return {
        success: false,
        error: "Price must be greater than 0",
        status: 400
      };
    };
  
    if (stock != null && !isValidStock(stock)) {
      return {
        success: false,
        error: "Stock must be positive",
        status: 400
      };
    };
  
    const product = await client.products.update({
      data: {
        name: name ?? undefined,
        price: price ?? undefined,
        stock: stock ?? undefined
      },
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        created_at: true,
        updated_at: true
      }
    });

    const response = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };

    return {
      success: true,
      data: response,
      status: 200
    };

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return {
        success: false,
        error: "Product not found",
        status: 404
      };
    };

    throw error;
  };
};

export async function getProducts(limit: number, offset: number): Promise<Result<Product[]>> {  
  const products = await client.products.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      created_at: true,
      updated_at: true
    },
    orderBy: {
      name: "asc"
    },
    take: normalizedLimit(limit),
    skip: normalizedOffset(offset)
  });

  const response = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };
  });

  return {
    success: true,
    data: response,
    status: 200
  };
};
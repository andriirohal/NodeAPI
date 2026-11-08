export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductInput = {
  name: string;
  price: number;
  stock: number;
};

export type UpdateProductInput = {
  name: string | null;
  price: number | null;
  stock: number | null;
};

type Success<T> = {
  success: true;
  data: T;
  status: number;
};

type Failure = {
  success: false;
  error: string;
  status: number;
};

export type Result<T> = Success<T> | Failure;
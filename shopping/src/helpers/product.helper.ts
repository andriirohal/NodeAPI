const PRICE_FORMAT = /^\d{1,8}(\.\d{1,2})?$/;
const MAX_STOCK = 2_147_483_647;

export function normalizedLimit(limit: number): number {
  return Number.isInteger(limit) && limit > 0 ? Math.min(100, limit) : 10; 
};

export function normalizedOffset(offset: number): number {
  return Number.isInteger(offset) && offset >= 0 ? offset : 0;
};

export function isValidName(name: unknown): name is string {
  if(typeof name !== "string") {
    return false;
  };

  return name === name.trim() && name.length > 0;
};

export function isValidPrice(price: unknown): price is number {
  if(typeof price !== "number" || !Number.isFinite(price)) {
    return false;
  };
  
  return PRICE_FORMAT.test(String(price)) && price > 0;
};

export function isValidStock(stock: unknown): stock is number {
  if(typeof stock !== "number") {
    return false;
  };

  return Number.isInteger(stock) && stock >= 0 && stock <= MAX_STOCK;
};
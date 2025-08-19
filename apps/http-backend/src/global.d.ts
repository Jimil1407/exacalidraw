
declare global {
    type userId = string;
    namespace Express {
      interface Request {
        userId?: userId;
      }
    }
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userId: userId;
  }
}
export {};
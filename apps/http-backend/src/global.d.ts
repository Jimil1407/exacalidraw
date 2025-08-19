
declare global {
    type userId = object;
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
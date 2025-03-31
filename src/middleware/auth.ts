import { NextFunction, Request, Response } from "express";

const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        next();
    } catch (error: any) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
};

export default isAuth;

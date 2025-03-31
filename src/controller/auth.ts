import { NextFunction, Request, Response } from "express";
import User from "../model/users";
import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");

export const submitLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            const error = new Error("Invalid Username");
            (error as any).status = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user?.dataValues.password);
        if (!isEqual) {
            const error = new Error("Invalid Password");
            (error as any).status = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                username: user?.dataValues.email,
                userId: user?.dataValues.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            token: token,
            id: user?.dataValues.id,
            email: user?.dataValues.email,
            name: user?.dataValues.name,
        });
    } catch (error: any) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
};

export const submitRegister = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
};

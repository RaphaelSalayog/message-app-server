import express from "express";
import { submitLogin, submitRegister } from "../controller/auth";

const authRouter = express.Router();

authRouter.post("/register/submitRegister", submitRegister);
authRouter.post("/login/submitLogin", submitLogin);

export default authRouter;

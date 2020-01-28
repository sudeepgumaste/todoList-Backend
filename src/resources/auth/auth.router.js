import { Router } from "express";
import { register, login, logout, refresh, verifyUser } from "./auth.controller";
import { verifyToken } from "./auth.middleware";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.get("/verify/:token", verifyUser)
authRouter.post("/login", login);
authRouter.delete("/logout", verifyToken, logout );
authRouter.post("/refresh", refresh );

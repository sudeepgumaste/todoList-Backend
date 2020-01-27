import { Router } from "express";
import { authRouter } from "../resources/auth/auth.router";
import {todosRouter} from "../resources/todos/todos.router";

export const router = Router();

router.use("/api/auth", authRouter);
router.use("/api/todos", todosRouter);
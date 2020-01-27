import {Router} from 'express';
import { postTodo, getTodos, deleteTodo, updateTodo} from './todos.controller'

import {verifyToken} from '../auth/auth.middleware';

export const todosRouter = Router();

todosRouter.get('/', verifyToken, getTodos);
todosRouter.post('/',verifyToken, postTodo);
todosRouter.delete('/:id',verifyToken, deleteTodo);
todosRouter.put('/:id',verifyToken, updateTodo)
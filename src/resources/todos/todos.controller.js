import { Todos } from "../../models/todos.model";

export const postTodo = async (req, res) => {
  const newTodo = new Todos({
    ...req.body,
    userId : req.user._id
  });

  try {
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

export const getTodos = async (req, res) => {
  try {
    const allTodos = await Todos.find({userId : req.user._id})
    res.json(allTodos)
  } catch (error) {
    res.sendStatus(500)
    console.log(error);
  }
}

export const deleteTodo = async (req, res) => {
  try{
    const deletedTodo = await Todos.findOneAndDelete({_id : req.params.id})
    res.json(deletedTodo)
  }catch(error){
    res.sendStatus(500)
    console.log(error);
  }
}

export const updateTodo = async (req, res) => {
  // console.log(req.body);
  try{
    const updatedTodo = await Todos.updateOne(
      {_id : req.params.id},
      {
        $set:{ ...req.body }
      }
    );
    res.json(updatedTodo);
  }catch(error){
    res.sendStatus(500);
    console.log(error);
  }
}

export const addSubTask = async (req, res) => {
  try{
    const updatedTodo = await Todos.updateOne(
      {_id : req.params.id},
      {
        $push:{ subTasks : req.body }
      }
    );
    res.json(updatedTodo);
  }catch(error){
    res.sendStatus(500);
    console.log(error);
  }
}
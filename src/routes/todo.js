import express from "express";
import Mongoose from "mongoose";
import jwt from "../lib/jwt-utill.js";
import RootModels from "../models/RootModels.js";
const userModel = RootModels.userModel();

const todoModel = RootModels.todoModel();
const todoRouter = express.Router();

todoRouter.post("/create", function (req, res, next) {
  const {
    body: { token, todo },
  } = req;
  let email = "";
  const result = jwt.verify(token);
  if (result.ok) {
    email = result.email;
  } else {
    res.status(401).send({ status: 401, msg: result.message });
  }
  userModel
    .findOne({ email })
    .then((r) => {
      console.log("유저 오브젝트 아이디", r._id.toString());
      //   new Mongoose.Types.ObjectId()
      const Todo = new todoModel({
        creator: r._id,
        todo,
      });
      Todo.save().then((rr) => {
        console.log("앙저장", rr);
        userModel
          .updateOne(
            { _id: r._id },
            { $push: { todos: { todoId: rr._id, todo: rr.todo } } }
          )
          .then((asd) => {
            console.log("실행왈료", asd);
          })
          .catch((ee) => console.log("ㅇ이ㅣ이잉", ee));
        res.send("저장띠");
        next();
      });
    })
    .catch((e) => {
      console.log(e);
    });
  //   const Todo = new todoModel({
  //     creator,
  //     todo,
  //   });
  //   Todo.save().then((r) => {
  //     console.log(r);
  //     res.send(r);
  //   });
});

export default todoRouter;

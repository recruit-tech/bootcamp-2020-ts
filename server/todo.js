"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const todoList = [];
class Todo {
    constructor(id, name, done) {
        this.id = id;
        this.name = name;
        this.done = done;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            done: this.done,
        };
    }
}
router.post("/", (req, res, next) => {
    const id = todoList.length ? todoList[todoList.length - 1].id + 1 : 0;
    const item = new Todo(id, req.body.name, false);
    todoList.push(item);
    return res.status(201).send(item);
});
router.get("/", (req, res, next) => {
    return res.send({ todoList: todoList });
});
router.patch("/:id", (req, res, next) => {
    const id = parseInt(req.params.id);
    const todo = todoList.find((todo) => todo.id == id);
    const { name, done } = req.body;
    if (todo == undefined)
        return res.status(500).send();
    todo.name = name;
    todo.done = done;
    return res.status(201).send(todo);
});
router.delete("/:id", (req, res, next) => {
    const id = parseInt(req.params.id);
    const index = todoList.findIndex((todo) => todo.id == id);
    todoList.splice(index, 1);
    return res.status(204).send("done");
});
exports.default = router;

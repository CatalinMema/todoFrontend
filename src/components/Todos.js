import React from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import { ALL } from "../utils/constants";
const Todos = ({
  search,
  todos,
  removeTodo,
  setEdit,
  completeTodo,
  dateOfTodo,
}) => {
  const todosList = todos.map((todo, index) => (
    <div className={todo.done ? "todo-row complete" : "todo-row"} key={index}>
      <div
        className="todo_text"
        key={todo._id}
        onClick={() => completeTodo(todo._id, todo.done)}
      >
        {/* <h4> {truncate(todo.todo_text,40)}</h4> */}

        {todo.text.length > 54 ? (
          <h4 className="txt_todo">{todo.text}</h4>
        ) : (
          <div className="todo_text_container">
            <h4 className={todo.done ? "completeLine" : null}>{todo.text} </h4>
            {!search && dateOfTodo !== ALL ? (
              <></>
            ) : (
              <> {todo.date.slice(5, 10).split("-").reverse().join("/")}</>
            )}
          </div>
        )}
      </div>
      <div className="icons">
        <RiCloseCircleLine
          onClick={() => removeTodo(todo._id)}
          className="delete-icon"
        />
        <TiEdit
          onClick={() => setEdit({ id: todo._id, value: todo.text })}
          className="edit-icon"
        />
      </div>
    </div>
  ));
  return <div>{todosList}</div>;
};

export default Todos;

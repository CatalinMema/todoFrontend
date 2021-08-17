import React, { useEffect, useRef } from "react";
import { SEARCH_TODO, TODO_NOT_FOUND } from "../utils/constants";
import Todos from "./Todos";

const SearchTodos = ({
  input,
  handleChange,
  searchTodos,
  removeTodo,
  setEdit,
  completeTodoSearch,
  dateOfTodo,
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef?.current?.focus();
  }, [input]);
  return (
    <div>
      <h1>{SEARCH_TODO}</h1>
      <form className="todo-form">
        <input
          autoComplete="off"
          placeholder={SEARCH_TODO}
          value={input}
          onChange={handleChange}
          name="text"
          ref={inputRef}
          className="todo-input-search-page"
        />
      </form>

      {searchTodos.length > 0 ? (
        <Todos
          search={true}
          todos={searchTodos}
          removeTodo={removeTodo}
          setEdit={setEdit}
          completeTodo={completeTodoSearch}
          dateOfTodo={dateOfTodo}
        />
      ) : (
        <div className="not_found">
          <p>{TODO_NOT_FOUND}</p>
        </div>
      )}
    </div>
  );
};

export default SearchTodos;

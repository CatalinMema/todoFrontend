import React, { useEffect, useRef, useState } from "react";
import TodoForm from "./TodoForm";
import axios from "../axios";
import {
  ADD_SOME,
  ALL,
  NEXT,
  NOTHING_PLANNED,
  PREV,
  SEARCH_TODO,
  SHOW_ALL,
  SKIPS,
  TITLE,
  TODAY,
  UPDATE_TODO,
} from "../utils/constants";
import Todos from "./Todos";
import SearchTodos from "./SearchTodos";
const TodoList = () => {
  const currentDate = new Date();
  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  let today = undefined;
  if (currentMonth < 10) {
    today =
      currentYear + "-" + 0 + (currentMonth + 1) + "-" + currentDayOfMonth;
  } else {
    today = currentYear + "-" + (currentMonth + 1) + "-" + currentDayOfMonth;
  }
  const [todos, setTodos] = useState([]);
  const [nrSkips, setNrSkips] = useState(0);
  const [todosNumber, setTodosNumber] = useState(0);
  const [input, setInput] = useState("");
  const [searchTodos, setSearchTodos] = useState([]);
  const [dateOfTodo, setDateOfTodo] = useState(today);
  const [updated, setUpdated] = useState(false);
  const [edit, setEdit] = useState({
    id: null,
    value: "",
  });
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/todos/search/${input}/${nrSkips}`);
      setSearchTodos(res.data);
    };
    if (input) fetchData();
  }, [input, nrSkips]);

  const getSearchTodo = async (search) => {
    const res = await axios.get(`/todos/search/${search}/${nrSkips}`);
    setSearchTodos(res.data);
  };
  const showAll = () => {
    setDateOfTodo(ALL);
    setNrSkips(0);
  };
  const showToday = () => {
    setDateOfTodo(today);
    setNrSkips(0);
  };
  const onChangeDate = (todo) => {
    setNrSkips(0);
    setDateOfTodo(todo);
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    if (e.target.value) {
      setNrSkips(0);
    } else {
      setSearchTodos([]);
    }
  };

  const submitUpdate = (value) => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: "",
    });
  };

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }
    axios.post("/todos", {
      text: todo.text,
      date: todo.date,
      done: todo.done,
    });
    setUpdated(!updated);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/todos/${dateOfTodo}`);
      setTodosNumber(res.data);
    };
    const fetchDataAll = async () => {
      const res = await axios.get(`/todos`);
      setTodosNumber(res.data);
    };
    if (dateOfTodo !== ALL) {
      fetchData();
    } else if (dateOfTodo === ALL) {
      fetchDataAll();
    }
  }, [dateOfTodo, todos.length, nrSkips, updated]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/todos/${dateOfTodo}/${nrSkips}`);
      setTodos(res.data);
    };
    const fetchDataAll = async () => {
      const res = await axios.get(`/todos/page/${nrSkips}`);
      setTodos(res.data);
    };
    if (dateOfTodo !== ALL) {
      fetchData();
    } else if (dateOfTodo === ALL) {
      fetchDataAll();
    }
  }, [todos.length, dateOfTodo, nrSkips, updated]);

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }
    axios.put(`/todos/${todoId}/${newValue.text}`);
    setUpdated(!updated);
    if (input) {
      getSearchTodo(input);
    }
  };

  const removeTodo = async (id) => {
    const removedArr = [...todos].filter((todo) => todo._id !== id);
    await axios.delete(`/todos/${id}`);
    if (input) {
      getSearchTodo(input);
    }
    if (todosNumber.length >= SKIPS && todosNumber.length - 1 === nrSkips) {
      setNrSkips(nrSkips - SKIPS);
    }
    setTodos(removedArr);
  };

  const completeTodo = async (id, completed) => {
    let updatedTodos = todos.map((todo) => {
      if (todo._id === id) {
        todo.done = !todo.done;
        completed = todo.done;
      }
      return todo;
    });
    await axios.put(`/completed/${id}/${completed}`);
    setTodos(updatedTodos);
  };

  const completeTodoSearch = async (id, completed) => {
    let updatedTodos = searchTodos.map((todo) => {
      if (todo._id === id) {
        todo.done = !todo.done;
        completed = todo.done;
      }
      return todo;
    });
    await axios.put(`/completed/${id}/${completed}`);
    setTodos(updatedTodos);
    setSearchTodos(updatedTodos);
  };

  const newPage = (direction) => {
    if (direction === NEXT) {
      setNrSkips(nrSkips + SKIPS);
    } else if (direction === PREV) {
      setNrSkips(nrSkips - SKIPS);
    }
  };

  if (edit.id) {
    return (
      <>
        <h1>{UPDATE_TODO}</h1>
        <TodoForm
          onChangeDate={onChangeDate}
          dateOfTodo={dateOfTodo}
          edit={edit}
          sendData={submitUpdate}
        />
      </>
    );
  }

  if (input) {
    return (
      <>
        <SearchTodos
          input={input}
          handleChange={handleChange}
          searchTodos={searchTodos}
          removeTodo={removeTodo}
          setEdit={setEdit}
          completeTodoSearch={completeTodoSearch}
          dateOfTodo={dateOfTodo}
        />
        <div className="navigation_buttons">
          {/* {nrSkips >= SKIPS ? ( <button
      className='todo-button'
            onClick={()=>newPage(PREV)}
            //className="button__page"
            style={{
                minWidth: '7vw',
                marginTop:'15px',
                marginLeft:'26px',
                marginBottom:'15px',
                }}
            >Prev 
            </button>) : (<button
      className='todo-button'
            onClick={()=>newPage(PREV)}
            //className="button__page"
            style={{
                minWidth: '7vw',
                marginTop:'15px',
                marginLeft:'26px',
                marginBottom:'15px',
                opacity: '0'
                }}
            >{PREV} 
            </button>) }
            {nrSkips<todosNumber.length-SKIPS ? (<button
            style={{
                //backgroundColor:'white',
                marginTop:'15px',
                marginRight:'26px',
                marginBottom:'15px',
                color:'white',
                minWidth:'7vw',
                     }}
            onClick={()=>newPage(NEXT)}
            className='todo-button'
            >{NEXT} 
            </button>) : (null) } */}
        </div>
      </>
    );
  }

  return (
    <>
      <h1>{TITLE}</h1>
      <TodoForm
        dateOfTodo={dateOfTodo}
        onChangeDate={onChangeDate}
        sendData={addTodo}
      />
      <div className="search_reset_container">
        <div>
          <input
            autoComplete="off"
            placeholder={SEARCH_TODO}
            value={input}
            onChange={handleChange}
            name="text"
            ref={inputRef}
            className="todo-input-search"
          />
        </div>
        <div>
          {dateOfTodo !== ALL ? (
            <button onClick={showAll} className="todo-button">
              {SHOW_ALL}
            </button>
          ) : (
            <button onClick={showToday} className="todo-button">
              {TODAY}
            </button>
          )}
        </div>
      </div>
      <div className="todos_container">
        {todos.length === 0 ? (
          <div className="nothing_planned">
            <h1>{NOTHING_PLANNED}</h1>
            <p>{ADD_SOME}</p>
          </div>
        ) : (
          <Todos
            todos={todos}
            removeTodo={removeTodo}
            setEdit={setEdit}
            completeTodo={completeTodo}
            dateOfTodo={dateOfTodo}
          />
        )}
      </div>
      <div className="navigation_buttons">
        {nrSkips >= SKIPS ? (
          <button className="todo-button prev" onClick={() => newPage(PREV)}>
            {PREV}
          </button>
        ) : (
          <button
            className="todo-button prev opacity0"
            onClick={() => newPage(PREV)}
          >
            {PREV}
          </button>
        )}
        {nrSkips < todosNumber.length - SKIPS ? (
          <button onClick={() => newPage(NEXT)} className="todo-button next">
            {NEXT}
          </button>
        ) : null}
      </div>
    </>
  );
};

export default TodoList;

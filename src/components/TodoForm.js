import React, { useState, useEffect } from "react";
import { ADD_TODO, UPDATE, UPDATE_TODO } from "../utils/constants";
import { useForm } from "react-hook-form";
const TodoForm = ({ edit, onChangeDate, sendData, dateOfTodo }) => {
  // const [input, setInput] = useState(edit ? edit.value : "");
  const [inputDate, setInputDate] = useState(dateOfTodo);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setInputDate(dateOfTodo);
  }, [dateOfTodo]);

  // const handleChange = (e) => {
  //   setInput(e.target.value);
  // };

  const handleDateChange = (e) => {
    setInputDate(e.target.value);
    onChangeDate(e.target.value);
  };

  const handleSubmitForm = (formData) => {
    sendData({
      text: formData.text_todo,
      date: inputDate,
      done: false,
    });
    reset();
  };

  return (
    <form className="todo-form">
      {edit ? (
        <>
          <input
            placeholder={errors.text_todo ? "Text is required" : UPDATE_TODO}
            name="text_todo"
            className="todo-input-update edit"
            {...register("text_todo", { required: true })}
          />
          <button
            onClick={handleSubmit(handleSubmitForm)}
            className="todo-button edit"
          >
            {UPDATE}
          </button>
        </>
      ) : (
        <div className="add_todo_container">
          <div>
            <textarea
              placeholder={errors.text_todo ? "Text is required" : ADD_TODO}
              name="text_todo"
              className="todo-input"
              maxLength="81"
              {...register("text_todo", { required: true })}
            />

            {/* {errors.text_todo && <p> Text is required! </p>} */}
          </div>
          <div className="todo_buttons">
            {/* <button className='todo-button'>
            {DATE}
          </button> */}
            <input
              type="date"
              className="date_input"
              value={inputDate}
              onChange={handleDateChange}
            />
            <br />
            <button
              onClick={handleSubmit(handleSubmitForm)}
              className="todo-button"
            >
              {ADD_TODO}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoForm;

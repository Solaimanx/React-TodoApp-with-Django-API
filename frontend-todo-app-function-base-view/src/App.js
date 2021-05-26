import React, { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [editing, setEditing] = useState(false);
  const [activeItem, setActiveItem] = useState({
    id: null,
    title: "",
    completed: false,
  });

  const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    await fetch("http://127.0.0.1:8000/api/task-list/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTodoList(data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    var crsftoken = getCookie("crsftoken");

    var url = "http://127.0.0.1:8000/api/task-create/";
    {
      editing
        ? ( url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`)
        : (  url = "http://127.0.0.1:8000/api/task-create/");
    }
    

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": crsftoken,
      },
      body: JSON.stringify(activeItem),
    }).then((res) => {
      fetchTask();
      setActiveItem({ ...activeItem, title: "" });
    });
  };

  const handleChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    console.log(value);
    setActiveItem({
      ...activeItem,
      title: value,
    });
  };

  const deleteItem = (todo) => {
    var url = `http://127.0.0.1:8000/api/task-delete/${todo.id}/`;

    var crsftoken = getCookie("crsftoken");

    var option = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": crsftoken,
      },
    };
    fetch(url, option).then((res) => {
      console.log(res);
      fetchTask();
    });
  };

  const strikeunstrikeItem = (todo) => {
    var completed = !todo.completed;

    var url = `http://127.0.0.1:8000/api/task-update/${todo.id}/`;

    var crsftoken = getCookie("crsftoken");

    var option = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": crsftoken,
      },
      body: JSON.stringify({
        title: todo.title,
        id: todo.id,
        completed: completed,
      }),
    };

    fetch(url, option).then((res) => {
      fetchTask();
    });
  };

  const EditItem = (todo) => {
    setActiveItem(todo);
    setEditing(true);
  };

  return (
    <div className="container">
      <div id="task-container">
        <div id="form-wrapper">
          <form onSubmit={handleSubmit} id="form">
            <div className="flex-wrapper">
              <div style={{ flex: 6 }}>
                <input
                  onChange={handleChange}
                  value={activeItem.title}
                  className="form-control"
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Add Task"
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  className="btn btn-warning"
                  id="submit"
                  type="submit"
                  name="title"
                />
              </div>
            </div>
          </form>
        </div>
        <div id="list-wrapper"></div>
        {todoList.map((todo, index) => (
          <div key={index} className="task-wrapper flex-wrapper">
            <div onClick={() => strikeunstrikeItem(todo)} style={{ flex: 7 }}>
              {todo.completed ? (
                <strike>{todo.title}</strike>
              ) : (
                <span>{todo.title}</span>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <button
                onClick={() => EditItem(todo)}
                className="btn btn-sm btn-outline-info"
              >
                Edit
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <button
                onClick={() => deleteItem(todo)}
                className="btn btn-sm btn-outline-info"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: "",
        completed: false,
      },
      editing: false,
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
  }

  getCookie(name) {
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
  }

  componentWillMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    console.log("featching");

    fetch("http://127.0.0.1:8000/api/task-list/")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ todoList: data });
      });
  }

  handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("name", name);
    console.log("value", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("Item", this.state.activeItem.id);

    var crsftoken = this.getCookie("crsftoken");

    var url = "http://127.0.0.1:8000/api/task-create/";

    if (this.state.editing === true) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;
      this.setState({
        editing: false,
      });
    } else{
      
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": crsftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((res) => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
          },
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  startEdit(task) {
    this.setState({
      activeItem: task,
      editing: true,
    });
  }

  deleteItem(task) {
    var crsftoken = this.getCookie("crsftoken");

    var url = `http://127.0.0.1:8000/api/task-delete/${task.id}/`;
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": crsftoken,
      },
    }).then((res) => {
      this.fetchTasks();
    });
  }

  strikeItem(task) {
    console.log(task);

    var crsftoken = this.getCookie("crsftoken");

    var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`;

    var newCompleted = !task.completed

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": crsftoken,
      },
      body: JSON.stringify({'completed': newCompleted,'title': task.title}),
    }).then(() => {
      this.fetchTasks();
    });
  }

  render() {
    var tasks = this.state.todoList;
    var self = this;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    value={this.state.activeItem.title}
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
          <div id="list-wrapper">
            {tasks.map((task, index) => {
              return (
                <div key={index} className="task-wrapper flex-wrapper">
                  <div
                    onClick={() => self.strikeItem(task)}
                    style={{ flex: 7 }}
                  >
                    {task.completed === true ? (
                      <strike>{task.title}</strike>
                    ) : (
                      <span>{task.title}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.startEdit(task)}
                      className="btn btn-sm btn-outline-info "
                    >
                      Edit
                    </button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.deleteItem(task)}
                      className="btn btn-sm btn-outline-info "
                    >
                      X
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

// sentence one =
// [
// "היי שמי ערן. מה שמך?",
// " ",
// "היי ריצ'רד, אתה חדש בחברה?",
// " ",
// "נהדר! איפה אתה עובד?",
// " ",
// "אני עובד במחלקת השיווק. איך אתה מגיע לעבודה?",
// " ",
// "אני בא ברכבת. כמה זמן לוקח לך לעבוד?",
// " ",
// "לא הרבה זמן בסביבות 25 דקות." ,
// " ",
// ];

// sentence Two =
// [
// " ",
// "Hi Eran, I’m Richard",
// " ",
// "Yes, I just started working here last week. ",
// " ",
// "I work in the sales department, and you?",
// " ",
// "I come by car to work.  And you?",
// " ",
// "It usually takes me 45 minutes to get to work, because of heavy traffic. And you?",
// " ",
// "Wow that’s great!" ,
// ];

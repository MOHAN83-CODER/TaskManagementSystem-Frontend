import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import TaskChart from "./TaskChart";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Work");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [todayTaskCount, setTodayTaskCount] = useState(0);

  // Dashboard
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === "Pending").length;
  const completedTasks = tasks.filter(task => task.status === "Completed").length;
  const completionPercentage =
  totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);
  
 useEffect(() => {
  if (currentUser) {
    loadTasks();
  }
}, [currentUser, loadTasks]);


  // Load Tasks
  const loadTasks = React.useCallback(() => {

  if (!currentUser) return;

 axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/${currentUser.id}`)
    .then((response) => {

  setTasks(response.data);

  const today = new Date().toISOString().split("T")[0];

  const dueToday = response.data.filter(
    task =>
      task.dueDate === today &&
      task.status === "Pending"
  );

  setTodayTaskCount(dueToday.length);

})
    .catch((error) => {
      toast.error("Failed to load tasks!");
      console.error(error);
    });

}, [currentUser]);

  // Add Task
  const addTask = () => {

    if (title.trim() === "" || description.trim() === "") {
      toast.warning("Please enter Title and Description");
      return;
    }

    const newTask = {
  title,
  description,
  status,
  priority,
  category,
  dueDate,
  userId: currentUser.id,
};

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/tasks`, newTask)
      .then(() => {
        toast.success("Task Added Successfully!");

        loadTasks();

        setTitle("");
        setDescription("");
        setStatus("Pending");
        setPriority("Medium");
        setDueDate("");
      })
      .catch((error) => {
        toast.error("Failed to add task!");
        console.error(error);
      });
  };

  // Edit
  const editTask = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority || "Medium");
    setCategory(task.category || "Work");
    setDueDate(task.dueDate || "");
  };

  // Update
  const updateTask = () => {

   const updatedTask = {
  title,
  description,
  status,
  priority,
  category,
  dueDate,
};

    axios
      .put(`${process.env.REACT_APP_API_URL}/api/tasks/${editingId}`, updatedTask)
      .then(() => {

        toast.success("Task Updated!");

        loadTasks();

        setEditingId(null);
        setTitle("");
        setDescription("");
        setStatus("Pending");
        setPriority("Medium");
        setDueDate("");
      })
      .catch((error) => {
        toast.error("Update Failed!");
        console.error(error);
      });
  };

  // Delete
  const deleteTask = (id) => {

    if (!window.confirm("Delete this task?")) return;

    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`)
      .then(() => {
        toast.success("Task Deleted!");
        loadTasks();
      })
      .catch((error) => {
        toast.error("Delete Failed!");
        console.error(error);
      });
  };
 useEffect(() => {
  if (currentUser) {
    loadTasks();
  }
}, [currentUser, loadTasks]);
const loginSuccess = (user) => {
  setCurrentUser(user);
};


const logout = () => {
  setCurrentUser(null);
};

const openSignup = () => {
  setShowSignup(true);
};
const openForgotPassword = () => {
  setShowForgotPassword(true);
  setShowSignup(false);
};

const openLogin = () => {
  setShowSignup(false);
  setShowForgotPassword(false);
};
  // Export PDF
const exportPDF = () => {

  const doc = new jsPDF();

  const today = new Date();

  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);
  doc.text("TASK MANAGEMENT SYSTEM", 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(0);

  doc.text(
    `Generated: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
    14,
    30
  );

  doc.text(`Total Tasks : ${totalTasks}`, 14, 42);
  doc.text(`Pending Tasks : ${pendingTasks}`, 14, 50);
  doc.text(`Completed Tasks : ${completedTasks}`, 14, 58);

  autoTable(doc, {
  startY: 70,
  head: [[
    "ID",
    "Title",
    "Description",
    "Status",
    "Priority",
    "Category",
    "Due Date"
  ]],

  body: tasks.map(task => [
    task.id,
    task.title,
    task.description,
    task.status,
    task.priority,
    task.category,
    task.dueDate || "-"
  ])
});

  doc.save("Task_Report.pdf");
};
if (!currentUser) {

  if (showSignup) {
    return (
      <Signup
        openLogin={openLogin}
      />
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPassword
        openLogin={openLogin}
      />
    );
  }

  return (
    <Login
      loginSuccess={loginSuccess}
      openSignup={openSignup}
      openForgotPassword={openForgotPassword}
    />
  );
}
  return (
    <div className="App">

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="colored"
      />

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
    color: "white",
    marginBottom: "25px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  }}
>
  <div>
    <h1
  style={{
    margin: 0,
    color: "white",
    fontSize: "40px",
    fontWeight: "700"
  }}
>
  📋 Task Management Dashboard
</h1>
    <p
  style={{
    margin: "8px 0 0 0",
    color: "white",
    fontSize: "20px"
  }}
>
  Welcome back, <strong>{currentUser.name}</strong>
</p>
  </div>

  <button
    onClick={logout}
    style={{
      background: "#dc2626",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    Logout
  </button>
</div>
      <h2>{editingId ? "Update Task" : "Add New Task"}</h2>

      <div style={{ marginBottom: "20px" }}>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option>Pending</option>
          <option>Completed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  style={{ marginLeft: "10px" }}
>
  <option>Work</option>
  <option>Personal</option>
  <option>Study</option>
  <option>Shopping</option>
</select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={editingId ? updateTask : addTask}
          style={{ marginLeft: "10px" }}
        >
          {editingId ? "Update Task" : "Add Task"}
        </button>

      </div>

      {/* Dashboard */}

      <h2>Dashboard</h2>
      {todayTaskCount > 0 && (
  <div
    style={{
      background: "#fef3c7",
      color: "#92400e",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontWeight: "bold",
      border: "1px solid #f59e0b"
    }}
  >
    🔔 You have <b>{todayTaskCount}</b> task(s) due today.
  </div>
)}

      <div className="dashboard">

       <div className="card">
  <h3>📋 Total Tasks</h3>
  <h1>{totalTasks}</h1>
</div>

<div className="card">
  <h3>🟡 Pending Tasks</h3>
  <h1>{pendingTasks}</h1>
</div>

<div className="card">
  <h3>🟢 Completed Tasks</h3>
  <h1>{completedTasks}</h1>
</div>

      </div>

      <h2>Task Analytics</h2>

      <TaskChart
        pending={pendingTasks}
        completed={completedTasks}
      />
      <h2 style={{ marginTop: "30px" }}>Task Completion Progress</h2>

<div
  style={{
    width: "100%",
    height: "25px",
    background: "#e5e7eb",
    borderRadius: "20px",
    overflow: "hidden",
    marginTop: "10px"
  }}
>
  <div
    style={{
      width: `${completionPercentage}%`,
      height: "100%",
      background: "#22c55e",
      transition: "0.5s"
    }}
  ></div>
</div>

<p
  style={{
    fontWeight: "bold",
    marginTop: "10px",
    fontSize: "16px"
  }}
>
  {completionPercentage}% Completed ({completedTasks}/{totalTasks} Tasks)
</p>

      <h2>Task List</h2>
      <div style={{ marginBottom: "20px" }}>
  <button
    onClick={exportPDF}
    style={{
      background: "#0f766e",
      marginBottom: "15px"
    }}
  >
    📄 Export PDF
  </button>
</div>
      <div style={{ marginBottom: "20px" }}>
  {/* <button onClick={exportPDF}>
    Export PDF
  </button> */}
</div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "300px",
          padding: "8px",
          marginBottom: "15px"
        }}
      />
<div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "15px"
  }}
>
  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
  >
    <option value="All">All Tasks</option>
    <option value="Pending">Pending</option>
    <option value="Completed">Completed</option>
  </select>

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="Latest">Latest</option>
    <option value="Oldest">Oldest</option>
    <option value="High">High Priority</option>
    <option value="Medium">Medium Priority</option>
    <option value="Low">Low Priority</option>
    <option value="DueDate">Due Date</option>
  </select>
</div>

      <div className="table-container">
    <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {tasks

            .filter(task =>
              task.title.toLowerCase().includes(search.toLowerCase())
            )

            .filter(task =>
              filterStatus === "All"
                ? true
                : task.status === filterStatus
            )

           .sort((a, b) => {

  if (sortBy === "Latest") {
    return b.id - a.id;
  }

  if (sortBy === "Oldest") {
    return a.id - b.id;
  }

  if (sortBy === "High") {
    const order = { High: 1, Medium: 2, Low: 3 };
    return order[a.priority] - order[b.priority];
  }

  if (sortBy === "Medium") {
    const order = { Medium: 1, High: 2, Low: 3 };
    return order[a.priority] - order[b.priority];
  }

  if (sortBy === "Low") {
    const order = { Low: 1, Medium: 2, High: 3 };
    return order[a.priority] - order[b.priority];
  }

  if (sortBy === "DueDate") {
    return new Date(a.dueDate) - new Date(b.dueDate);
  }

  return 0;

})

            .map((task) => {

              const overdue =
                task.dueDate &&
                task.status === "Pending" &&
                new Date(task.dueDate) < new Date();

              return (

                <tr
                  key={task.id}
                  className={overdue ? "overdue" : ""}
                >

                  <td>{task.id}</td>

                  <td>{task.title}</td>

                  <td>{task.description}</td>

                  <td>{task.status}</td>

                  <td>

                   <span
  className={
    task.priority === "High"
      ? "priority-high"
      : task.priority === "Medium"
      ? "priority-medium"
      : "priority-low"
  }
>
  {task.priority}
</span>

                  </td>
                  <td>{task.category}</td>
                  <td>{task.dueDate || "-"}</td>

                  <td>

                    <button
                      onClick={() => editTask(task)}
                      style={{ marginRight: "8px" }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              );

            })}

        </tbody>

      </table>
      </div>
    </div>
    
  );
}

export default App;
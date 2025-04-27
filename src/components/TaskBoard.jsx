import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaTasks, FaCalendarAlt, FaPlusCircle, FaListUl, FaSignOutAlt } from "react-icons/fa";

function TaskBoard() {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("To Do");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const navigate = useNavigate();

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasksData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setTasks(tasksData);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!title || !assignedTo) {
      alert("Fill all fields");
      return;
    }
    await addDoc(collection(db, "tasks"), { title, assignedTo, status });
    setTitle("");
    setAssignedTo("");
    setStatus("To Do");
    fetchTasks();
  };

  const handleStatusChange = async (id, newStatus) => {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { status: newStatus });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setAssignedTo(task.assignedTo);
    setIsEditing(true);
    setEditingTaskId(task.id);
  };

  const handleUpdate = async () => {
    const taskRef = doc(db, "tasks", editingTaskId);
    await updateDoc(taskRef, { title, assignedTo });
    setTitle("");
    setAssignedTo("");
    setIsEditing(false);
    setEditingTaskId(null);
    fetchTasks();
  };

  const handleOnDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    // Check if the task was dropped in a different column (status change)
    if (destination.droppableId !== source.droppableId) {
      await handleStatusChange(draggableId, destination.droppableId);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col justify-between py-8 px-6 shadow-2xl rounded-r-3xl">
        <div>
          <h2 className="text-3xl font-bold mb-12 text-center">Task Manager</h2>
          <nav className="space-y-6">
            <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl">
              <FaTasks />
              <span className="font-semibold text-lg">Today's Task</span>
            </div>
            <div className="flex items-center gap-4 hover:bg-white/10 p-3 rounded-xl cursor-pointer transition-all">
              <FaPlusCircle />
              <span className="font-medium">Add Task</span>
            </div>
            <div className="flex items-center gap-4 hover:bg-white/10 p-3 rounded-xl cursor-pointer transition-all">
              <FaListUl />
              <span className="font-medium">Task List</span>
            </div>
            <div className="flex items-center gap-4 hover:bg-white/10 p-3 rounded-xl cursor-pointer transition-all">
              <FaCalendarAlt />
              <span className="font-medium">Calendar</span>
            </div>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full bg-gradient-to-r from-red-600 to-red-700 py-3 rounded-xl mt-8 text-white font-semibold flex items-center justify-center gap-3 transition-all">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        {/* Add New Task Section */}
        <div className="bg-white/90 p-6 sm:p-8 rounded-2xl shadow-md mb-8 sm:mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-2">Today's Summary</h1>
            <p className="text-gray-500">Keep tracking your tasks 🚀</p>
          </div>
          <div className="text-center sm:text-right">
            <h2 className="text-xl sm:text-2xl font-bold text-pink-500">{tasks.length} Tasks</h2>
          </div>
        </div>

        {/* Task Addition */}
        <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-xl mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold mb-4 sm:mb-6 text-gray-700 text-center sm:text-left">Add New Task</h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <input
              className="p-4 border rounded-2xl bg-white flex-1 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-pink-300"
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="p-4 border rounded-2xl bg-white flex-1 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-pink-300"
              type="text"
              placeholder="Assigned To"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
            {!isEditing ? (
              <button
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl shadow-lg font-semibold transition-all w-full sm:w-auto"
                onClick={handleAddTask}
              >
                Add Task
              </button>
            ) : (
              <button
                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-8 py-4 rounded-2xl shadow-lg font-semibold transition-all w-full sm:w-auto"
                onClick={handleUpdate}
              >
                Update Task
              </button>
            )}
          </div>
        </div>

        {/* Drag and Drop Tasks */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["To Do", "In Progress", "Done"].map((colStatus) => (
              <Droppable droppableId={colStatus} key={colStatus}>
                {(provided) => (
                  <div
                    className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl min-h-[400px] shadow-lg transition-all"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3 className="text-2xl font-bold mb-6 text-gray-700">{colStatus}</h3>
                    {tasks
                      .filter((task) => task.status === colStatus)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              className="bg-white p-4 rounded-2xl shadow-md mb-4 hover:shadow-lg transition-all"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h4 className="font-bold text-lg mb-2">{task.title}</h4>
                              <p className="text-gray-500 text-sm mb-4">Assigned: {task.assignedTo}</p>
                              <div className="flex flex-wrap gap-2">
                                {colStatus === "To Do" && (
                                  <button
                                    className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all"
                                    onClick={() => handleStatusChange(task.id, "In Progress")}
                                  >
                                    Move to In Progress
                                  </button>
                                )}
                                {colStatus === "In Progress" && (
                                  <button
                                    className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all"
                                    onClick={() => handleStatusChange(task.id, "Done")}
                                  >
                                    Move to Done
                                  </button>
                                )}
                                {colStatus !== "Done" && (
                                  <>
                                    <button
                                      className="bg-purple-400 hover:bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all"
                                      onClick={() => handleEdit(task)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all"
                                      onClick={() => handleDelete(task.id)}
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default TaskBoard;

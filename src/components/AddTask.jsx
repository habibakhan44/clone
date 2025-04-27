import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase"; // Apne firebase.js ka sahi path dena

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

  const handleAddTask = async () => {
    try {
      await addDoc(collection(db, "tasks"), {
        title: title,
        description: description,
        assignedUser: assignedUser,
        status: "To Do"  // Default status jab new task banta hai
      });
      alert("Task Added Successfully!");
      // Clear form
      setTitle("");
      setDescription("");
      setAssignedUser("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="p-4">
      <input
        className="border p-2 m-2 w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2 m-2 w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="border p-2 m-2 w-full"
        placeholder="Assigned User"
        value={assignedUser}
        onChange={(e) => setAssignedUser(e.target.value)}
      />
      <button
        onClick={handleAddTask}
        className="bg-blue-500 text-white p-2 rounded m-2"
      >
        Add Task
      </button>
    </div>
  );
}

export default AddTask;

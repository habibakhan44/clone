import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful!");
      navigate("/tasks");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-600 via-purple-100 to-blue-100">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-300">
        <h1 className="text-4xl font-bold text-gray-700 mb-8 text-center">Welcome Back To Task Manager!</h1>
        <input
          type="email"
          placeholder="Email Address"
          className="p-4 mb-4 w-full rounded-xl bg-pink-50 text-gray-700 placeholder-gray-400 border-2 border-pink-200 focus:outline-none focus:border-pink-400 transition-all duration-300"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-4 mb-6 w-full rounded-xl bg-purple-50 text-gray-700 placeholder-gray-400 border-2 border-purple-200 focus:outline-none focus:border-purple-400 transition-all duration-300"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl w-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
        >
          Login
        </button>
        <p className="text-gray-500 text-center mt-6 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-pink-500 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;

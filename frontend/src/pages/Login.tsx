import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${window.config.backendUrl}/auth/login`, {
        email,
        password,
      });

      const data = response.data;

      // Save token
      localStorage.setItem("token", data.token);

      // Save user info (IMPORTANT for navbar)
      localStorage.setItem("user", JSON.stringify(data));

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed");
    }
  };



  return (
    <div className="page-wrapper">
      <Navbar isLoggedIn={false} />

      <main className="page-container flex justify-center items-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-4xl font-bold text-text-dark mt-20 mb-10">
            Login
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="border p-3 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
            >
              Login
            </button>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
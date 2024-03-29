import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLoginOrRegister === "register" ? "register" : "login";  
    const {data , status} = await axios.post(url, {username,password})
    if (status != 200) {
      alert(data);
    }
    setLoggedInUsername(username);
    setId(data.id);
    
  };
  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form onSubmit={handleSubmit} className="w-64 mx-auto mb-12">
      <input
        type="text"
        value={username}
        className="block w-full rounded-sm p-2 mb-2 border"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        value={password}
        className="block w-full rounded-sm p-2 mb-2 border"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white block w-full rounded-sm p-2">
        {isLoginOrRegister === "register" ? "Register" : "Login"}
      </button>
      <div className="text-center mt-2">
        {isLoginOrRegister === "register" && (
          <div>
            Already a member ?{" "}
            <button
              className="ml-1"
              onClick={() => {
                setIsLoginOrRegister("login");
              }}
            >
              login here
            </button>
          </div>
        )}

        {isLoginOrRegister === "login" && (
          <div>
            Don't have an account ?{" "}
            <button
              className="ml-1"
              onClick={() => {
                setIsLoginOrRegister("register");
              }}
            >
              Register
            </button>
          </div>
        )}
      </div>
      </form>
    </div>
  );
};

export default RegisterAndLoginForm;
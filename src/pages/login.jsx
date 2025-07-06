import React, { useState,useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Usercontext from "../context/context";
const Login = () => {
   const [isRegister, setisRegister] = useState(false);
  const navigate = useNavigate();
  const { setcurrentUser } = useContext(Usercontext); // 👈 use setter
  const [passwordType, setPasswordType] = useState("password");

  const handleToggle = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const endpoint = isRegister ? "register" : "login";

    try {
      const res = await fetch(`http://localhost:3000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        alert(result.message);
        return;
      }

      alert(result.message);

      // ✅ Save to React Context (not localStorage)
      setcurrentUser(data.username);

      navigate("/app");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };
  return (
    <>
      {isSubmitting && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <h1 className="text-green-800 font-semibold">Loading...</h1>
          </div>
        </div>
      )}

      <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(132,238,174,0.5)_100%)]"></div>

      <div className="w-screen h-screen flex items-center justify-center bg-transparent">
        <div className="w-[80%] sm:w-[33vw] h-[70vh] border border-green-200 rounded-2xl bg-white bg-opacity-40 backdrop-blur-md shadow-2xl p-6 flex flex-col justify-between">
          <div className="h-[15%] w-full flex justify-center items-center animate-bounce ">
            <div className="text-3xl font-bold text-black">
              <span className="text-green-600">&lt;</span>
              <span>VAULTI</span>
              <span className="text-green-700">FY</span>
              <span className="text-green-600">/&gt;</span>
            </div>
          </div>

          <div className="flex items-center my-3">
            <div className="flex-grow h-px bg-gradient-to-r from-green-400 via-green-200 to-green-400"></div>
            <span className="mx-3 text-green-700 font-semibold text-sm tracking-wider">
              {isRegister ? "REGISTER" : "LOGIN"} TO CONTINUE
            </span>
            <div className="flex-grow h-px bg-gradient-to-l from-green-400 via-green-200 to-green-400"></div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 flex flex-col justify-center items-center gap-4 text-black"
          >
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: true })}
              className="w-[80%] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white bg-opacity-60"
            />
             <div className="relative w-[80%]">
              <input
                type={passwordType}
                placeholder="Password"
                {...register("password", {
                  required: true,
                  minLength: { value: 8, message: "Min 8 characters" },
                })}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white bg-opacity-60"
              />
              <button
                onClick={handleToggle}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/dicvhxpz.json"
                  trigger="hover"
                  stroke="bold"
                  colors="primary:#121331,secondary:#000000"
                  style={{ width: "22px", height: "22px" }}
                ></lord-icon>
              </button>
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            {isRegister ? "Already" : "Don't"} have an account?{" "}
            <span
              className="text-green-700 cursor-pointer hover:underline"
              onClick={() => setisRegister(!isRegister)}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
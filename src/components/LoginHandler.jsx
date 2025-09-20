import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function LoginHandler({ closeModal }) {
  const { api, setToken, setUser } = useContext(AuthContext);
  const [loginData, setLoginData] = useState({
    password: "",
    email: "",
  });

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const [registrationData, setRegistrationData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginValidation, setLoginValidation] = useState({
    password: true,
    email: true,
  });

  const [registrationValidation, setRegistrationValidation] = useState({
    username: true,
    email: true,
    password: true,
    confirmPassword: true,
  });

  ////////////////////////////////////////////
  ////////////login data logic////////////////
  ////////////////////////////////////////////
  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (loginData.email === "" || loginData.password === "") return; //set up toastify response here

    try {
      const response = await api.post(
        "users/login",
        {
          email: loginData.email,
          password: loginData.password,
        },
        {
          withCredentials: true,
        }
      );

      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setLoginData({
        password: "",
        email: "",
      });

      closeModal();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleLoginBlur = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setLoginValidation((prev) => ({
        ...prev,
        email: emailRegex.test(value),
      }));
    }
    if (name === "password") {
      setLoginValidation((prev) => ({ ...prev, password: value !== 0 }));
    }
  };

  ////////////////////////////////////////////
  ///////////registration logic///////////////
  ////////////////////////////////////////////

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();

    if (
      registrationData.email === "" ||
      registrationData.password.length < 8 ||
      registrationData.confirmPassword.length < 8 ||
      registrationData.username.length < 6
    )
      return; //toastify here

    if (!emailRegex.test(registrationData.email)) return; //toastify here

    if (!passwordRegex.test(registrationData.password)) return; //toastify

    if (!registrationData.password === registrationData.confirmPassword) return; //toastify

    try {
      const response = await api.post(`users/register`, {
        username: registrationData.username,
        email: registrationData.email,
        password: registrationData.password,
      });
      console.log(response);

      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegistrationChange = (event) => {
    const { name, value } = event.target;
    setRegistrationData((prev) => ({ ...prev, [name]: value }));
    if (name === "confirmPassword") {
      setRegistrationValidation((prev) => ({
        ...prev,
        confirmPassword: registrationData.password === value,
      }));
    }
  };

  const handleRegistrationBlur = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setRegistrationValidation((prev) => ({
        ...prev,
        email: emailRegex.test(value),
      }));
    }

    if (name === "username") {
      setRegistrationValidation((prev) => ({
        ...prev,
        username: value.length >= 6,
      }));
    }

    if (name === "password") {
      setRegistrationValidation((prev) => ({
        ...prev,
        password: passwordRegex.test(value),
        confirmPassword: registrationData.confirmPassword === value,
      }));
    }
    if (name === "confirmPassword") {
      setRegistrationValidation((prev) => ({
        ...prev,
        confirmPassword: registrationData.password === value,
      }));
    }
  };
  ////////////////////////////////
  ////////////oauth///////////////
  ////////////////////////////////

  const navigate = useNavigate();

  //creates an event listener for any open windows, runs close
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== import.meta.env.VITE_ORIGIN_URL) return;

      const { type, token, userId } = event.data;

      if (!type || type !== "oauthSuccess") return;

      try {
        const response = await api.get(`/users/find/${userId}`);

        const user = response.data;

        setToken(token);
        setUser(user);
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [api, closeModal, navigate, setToken, setUser]);

  const handleOauth = async () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/users/auth/github`,
      "Github Oauth"
    );
  };

  const inputStyles = "flex-1 shadow-md border border-gray-200 max-h-7 bg-gray-100";
  const inputDivStyles = "flex flex-row gap-2 w-100 max-w-xs md:max-w-100";
  const badInputStyles = "text-center text-red-600";
  const formStyles = "flex flex-col gap-3 items-center";
  const buttonStyles = "bg-emerald-200 w-50 shadow-md rounded-md px-4 py-2 shrink-0 hover:bg-emerald-300 hover:cursor-pointer"

  return (
    <div className="flex flex-col justify-center items-center content-center">
      <button
        onClick={handleOauth}
        className="flex flex-row content-center bg-emerald-200 px-4 py-2 rounded-md shadow-md gap-4 hover:bg-emerald-300 hover:cursor-pointer"
      >
        <FaGithub className="w-6 h-6" />
        Login with Github
      </button>
      <h2 className="font-bold">Log In Here</h2>
      <form className={formStyles} onSubmit={handleLoginSubmit}>
        <div className={inputDivStyles}>
          <label htmlFor="email">Email: </label>
          <input
            className={inputStyles}
            type="text"
            name="email"
            onBlur={handleLoginBlur}
            value={loginData.email}
            onChange={handleLoginChange}
          />
        </div>
        {!loginValidation.email && (
          <span className={badInputStyles}>Email not a valid email</span>
        )}
        <div className={inputDivStyles}>
          <label htmlFor="password">Password: </label>
          <input
            className={inputStyles}
            type="password"
            name="password"
            onBlur={handleLoginBlur}
            value={loginData.password}
            onChange={handleLoginChange}
          />
        </div>
        {!loginValidation.password && (
          <span className={badInputStyles}>Password cannot be blank</span>
        )}
        <button
          className={buttonStyles}
          type="submit"
        >
          Log In
        </button>
      </form>
      <h2 className="font-bold">Register here!</h2>
      <form className={formStyles} onSubmit={handleRegistrationSubmit}>
        <div className={inputDivStyles}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            className={inputStyles}
            value={registrationData.username}
            onChange={handleRegistrationChange}
            onBlur={handleRegistrationBlur}
          />
        </div>
        {!registrationValidation.username && (
          <span className={badInputStyles}>
            Username must be at least 6 characters long
          </span>
        )}
        <div className={inputDivStyles}>
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            name="email"
            className={inputStyles}
            value={registrationData.email}
            onChange={handleRegistrationChange}
            onBlur={handleRegistrationBlur}
          />
        </div>
        {!registrationValidation.email && (
          <span className={badInputStyles}>Email not a valid email</span>
        )}
        <div className={inputDivStyles}>
          <label htmlFor="password" name="password">
            Password:{" "}
          </label>
          <input
            type="text"
            name="password"
            className={inputStyles}
            value={registrationData.password}
            onChange={handleRegistrationChange}
            onBlur={handleRegistrationBlur}
          />
        </div>
        {!registrationValidation.password && (
          <span className={badInputStyles}>
            Password must contain at least one capital letter, one number, and
            one special character{" "}
          </span>
        )}
        <div className={inputDivStyles}>
          <label htmlFor="confirmPassword">confirm password:</label>
          <input
            type="text"
            name="confirmPassword"
            className={inputStyles}
            value={registrationData.confirmPassword}
            onChange={handleRegistrationChange}
            onBlur={handleRegistrationBlur}
          />
        </div>
        {!registrationValidation.confirmPassword && (
          <span className={badInputStyles}>passwords do not match</span>
        )}
        <button type="submit" className={buttonStyles}>Register</button>
      </form>
    </div>
  );
}

import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function LoginHandler({ closeModal }) {
  const { api } = useContext(AuthContext);
  const { setToken, setUser } = useContext(AuthContext);
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
      const response = await api.post("users/login", {
        email: loginData.email,
        password: loginData.password,
      });

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
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegistrationChange = (event) => {
    const { name, value } = event.target;
    setRegistrationData((prev) => ({ ...prev, [name]: value }));
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

  return (
    <>
      <h2>Already a member? Login here!</h2>
      <form onSubmit={handleLoginSubmit}>
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          name="email"
          onBlur={handleLoginBlur}
          value={loginData.email}
          onChange={handleLoginChange}
        />
        {!loginValidation.email && <span>Email not a valid email</span>}
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          onBlur={handleLoginBlur}
          value={loginData.password}
          onChange={handleLoginChange}
        />
        {!loginValidation.password && <span>Password cannot be blank</span>}
        <button type="submit">Log In</button>
      </form>
      <h2>Register here!</h2>
      <form onSubmit={handleRegistrationSubmit}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          name="username"
          value={registrationData.username}
          onChange={handleRegistrationChange}
          onBlur={handleRegistrationBlur}
        />
        {!registrationValidation.username && (
          <span>Username must be at least 6 characters long</span>
        )}
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          name="email"
          value={registrationData.email}
          onChange={handleRegistrationChange}
          onBlur={handleRegistrationBlur}
        />
        {!registrationValidation.email && <span>Email not a valid email</span>}
        <label htmlFor="password" name="password">
          Password:{" "}
        </label>
        <input
          type="password"
          name="password"
          value={registrationData.password}
          onChange={handleRegistrationChange}
          onBlur={handleRegistrationBlur}
        />
        {!registrationValidation.password && (
          <span>
            Password must contain at least one capital letter, one number, and
            one special character{" "}
          </span>
        )}
        <label htmlFor="confirmPassword">confirm password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={registrationData.confirmPassword}
          onChange={handleRegistrationChange}
          onBlur={handleRegistrationBlur}
        />
        {!registrationValidation.confirmPassword && <span>passwords do not match</span>}
        <button type="submit">Register</button>
      </form>
    </>
  );
}

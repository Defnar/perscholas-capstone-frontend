import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";

export default function LoginHandler({ closeModal }) {
  const { api } = useContext(AuthContext);
  const { setToken, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });

  const [validation, setValidation] = useState({
    password: true,
    email: true,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    console.log(value.length);
    if (name === "email") {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      setValidation((prev) => ({ ...prev, email: emailRegex.test(value) }));
    }
    if (name === "password") {
      setValidation((prev) => ({ ...prev, password: value.length !== 0 }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validation.email || !validation.password) return; //set up toastify response here

    try {
      const response = await api.post("users/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setFormData({
        password: "",
        email: "",
      });

      closeModal();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email: </label>
      <input
        type="text"
        name="email"
        onBlur={handleBlur}
        value={formData.email}
        onChange={handleChange}
      />
      {!validation.email && <span>Email not a valid email</span>}
      <label htmlFor="password">Password: </label>
      <input
        type="password"
        name="password"
        onBlur={handleBlur}
        value={formData.password}
        onChange={handleChange}
      />
      {!validation.password && <span>Password cannot be blank</span>}
      <button type="submit">Log In</button>
      <button type="button" onClick={closeModal}>
        cancel
      </button>
    </form>
  );
}

import { Bounce, toast } from "react-toastify";

export default function toastMessage(message) {
    toast(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,})
}
import { useState } from "react";
import Header from "../components/Header";
import ProjectList from "../components/ProjectList";

export default function Home() {
    const [isPrivate, setIsPrivate] = useState(false);

    return (
        <>
        <button onClick={() => setIsPrivate(prev => !prev)}>toggle Private</button>
        <ProjectList privateProject={isPrivate}/>
        </>
    )
}
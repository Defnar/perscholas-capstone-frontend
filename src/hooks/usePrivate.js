import { useState } from "react";

export default function usePrivate() {
    const [privateProject, setPrivateProject] = useState(false);

    return {privateProject, setPrivateProject};
}
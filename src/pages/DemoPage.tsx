import LogoutButton from "./components/LogoutButton.tsx";
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
    sub: string; // or 'email' or 'id' depending on your token
    role?: string;
    exp?: number;
}

const Demo = () => {

    const token = localStorage.getItem('jwt');
    let userEmail;
    if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        userEmail = decoded.sub;
    }

    return (
        <>
            <h1>Hello World!</h1>
            <h1>Current User: {userEmail}</h1>
            <LogoutButton/>
        </>
    );
}

export default Demo;


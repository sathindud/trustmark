import React, {JSX} from 'react';
import { Navigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";

interface Props {
    children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
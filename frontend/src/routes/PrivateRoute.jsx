import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {

    const {
        loading,
        isAuthenticated
    } = useAuth();

    // Esperar a que el contexto cargue
    if (loading) {

        return <div>Cargando...</div>;

    }

    // Si no hay sesión, enviar al login
    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    return children;

}
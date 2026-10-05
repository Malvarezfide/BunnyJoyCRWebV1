import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const savedToken = localStorage.getItem("admin_token");
        const savedUser = localStorage.getItem("admin_user");

        if (savedToken) {
            setToken(savedToken);
        }

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        setLoading(false);

    }, []);

    function login(data) {

        localStorage.setItem(
            "admin_token",
            data.token
        );

        localStorage.setItem(
            "admin_user",
            JSON.stringify(data.user)
        );

        setToken(data.token);
        setUser(data.user);

    }

    function logout() {

        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");

        setToken(null);
        setUser(null);

    }

    return (

        <AuthContext.Provider
            value={{

                user,

                token,

                loading,

                login,

                logout,

                isAuthenticated: !!token

            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}

import React, { useState } from "react"

const AuthContext = React.createContext()

function AuthProvider({ children }) {
    const [hasAuthenticated, setHasAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    const storeAccessToken = (token) => {
        setAccessToken(token);
        localStorage.setItem("accessToken", token)
    }

    const logout = () => {
        localStorage.removeItem("accessToken")
        setHasAuthenticated(false)
    }

    const getAccessToken = () => {
        if (accessToken) {
            return accessToken
        }

        return localStorage.getItem("accessToken")
    }

    const checkIfUserAuthenticated = () => {
        if (hasAuthenticated) {
            return true;
        }

        const accessToken = getAccessToken();
        if (accessToken && accessToken.length > 0) {
            return true
        }

        return false
    }

    return (
        <AuthContext.Provider value={{ 
            hasAuthenticated,
            accessToken, storeAccessToken,
            getAccessToken, checkIfUserAuthenticated,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthContext, AuthProvider
}
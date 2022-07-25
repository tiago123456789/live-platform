import React, { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../providers/Auth"

export default () => {
    const navigate = useNavigate();
    const { logout: logoutUserAuthenticated } = useContext(AuthContext)
    
    const logout = (event) => {
        event.preventDefault()
        logoutUserAuthenticated();
        navigate("/login")
    }

    return (
        <nav
            className="navbar navbar-expand-lg bg-light"
            style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
        >
            <div className="container-fluid">
                <Link className="navbar-brand text-dark" to="/lives">
                    LivePlatform
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <button onClick={logout} style={{ position: "fixed", "right": "5px" }} className="btn btn-default">Logout</button>
                </div>
            </div>
        </nav>
    )
}
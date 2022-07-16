import React from "react"
import { Link } from "react-router-dom"

export default () => {
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
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    </ul>
                </div>
            </div>
        </nav>
    )
}
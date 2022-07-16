import React from "react"

export default ({ message, username, postedAt }) => {
    return (
        <div className="message">
            <span className="">
                <strong>{username}</strong>
                <small style={{ float: "right", marginRight: "5px" }}>{postedAt}</small>
            </span>
            <p>
                {message}
            </p>
        </div>
    )
}
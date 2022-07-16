import React from "react"

export default ({ viewer }) => {
    return (
        <div id="live" className="col-md-8">
            <video controls style={{ width: "100%" }} />
            <div className="btn btn-primary">
                {viewer} Watching
            </div>
        </div>
    )
}
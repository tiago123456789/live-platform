import React from "react"

export default ({ remoteRef, viewer }) => {
    return (
        <div id="live" className="col-md-8">
            <video ref={remoteRef} style={{ width: "100%" }} />
            <div className="btn btn-primary">
                {viewer} Watching
            </div>
        </div>
    )
}
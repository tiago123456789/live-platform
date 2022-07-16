import Header from "../components/Header"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getOnlineChannels } from "../services/Channel"

export default () => {
    const username = localStorage.getItem("username")
    const [lives, setLives] = useState([])

    useEffect(() => {
        (async () => {
            const onlineChannels = await getOnlineChannels();
            setLives(onlineChannels)
        })()
    }, [])

    return (
        <>
            <Header />
            <div className="container mt-2">
                <div className="row mb-2">
                    <Link to={`/channel/${username}`}>
                        <button className="col-md-12 btn btn-block btn-primary">Access your channel</button>
                    </Link>
                </div>
                <div className="row">
                    <h3 className="text-center">Online</h3>
                </div>
                <div className="row offset-md-2">
                    {
                        lives.map((live, index) => {
                            return (
                                <Link style={{ margin: "5px", "textDecoration": "none" }}
                                    className="card col-md-4" 
                                    key={index} to={`/channel/${live.id}/live`}>
                                    <div>
                                        <div className="card-body">
                                            <img src={live.avatarUrl} className="col-md-12" />
                                            <h5 className="card-title mt-2 text-center">{live.channelName}</h5>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}
import { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header"
import { get as getAccessToken, getValueByKey } from "../services/Token";
import { finishChannelStream, startChannelStream, createChannel } from "../services/Channel";
import { Link } from "react-router-dom";
import webSocket from "../services/Websocket"
import { ChannelContext } from "../providers/Channel";
import { getUserCameraAndAudio, getUserScreen, replaceVideoStream, startStreamNewUser, stopStream } from "../utils/Stream";

const socket = webSocket()

export default () => {
    let peers = [];
    let videoRef = useRef()

    const [localStream, setLocalStream] = useState()
    const [localScreen, setLocalScreen] = useState()
    const { hasChannel, setHasChannel } = useContext(ChannelContext)
    const [channel, setChannel] = useState(null)
    const [description, setDescription] = useState("")
    const userId = getValueByKey("userId", getAccessToken())

    const start = async () => {
        const stream = await getUserCameraAndAudio();
        setLocalStream(stream)
        replaceVideoStream(peers, stream)
        await startChannelStream(
            userId
        )

        videoRef.current.srcObject = stream;
    }

    const shareScreen = async () => {
        const screenStream = await getUserScreen()
        replaceVideoStream(peers, screenStream)
        setLocalScreen(screenStream)
        await startChannelStream(
            userId
        )
        videoRef.current.srcObject = screenStream;
    }

    const stop = async (event) => {
        event.preventDefault();
        stopStream(localScreen)
        stopStream(localStream)
        await finishChannelStream(
            userId
        )
        videoRef.current.srcObject = null;
    }

    const create = async (event) => {
        event.preventDefault()
        await createChannel({ description })
        setChannel({ description })
        setHasChannel(true)
    }

    useEffect(() => {
        if (localStream != undefined || localScreen != undefined) {
            const userId = getValueByKey("userId", getAccessToken())

            socket.on(`new-viewer-${userId}`, async (data) => {
                await startStreamNewUser(
                    data, peers, localScreen, localStream, socket 
                )
            })

            socket.on("made-answer", async (data) => {
                if (peers[data.from]) {
                    await peers[data.from].setRemoteDescription(data.answer)
                }
            })

            socket.on("ice-candidates", async (data) => {
                if (data.candidate && !data.onicecandidate) {
                    await peers[data.sender].addIceCandidate(new RTCIceCandidate(data.candidate))
                }
            })
        }
    }, [localScreen, localStream])

    return (
        <>
            <Header />
            <section className="container">
                { hasChannel === false &&
                    <div className="row">
                        <form className="col-md-11">
                            <h3>Data for create channel</h3>
                            <div className="form-group">
                                <label>Description:</label>
                                <input className="form-control"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    onClick={create}
                                    className="btn btn-primary mt-1">Create</button>
                            </div>
                        </form>
                    </div>
                }

                <br />
                <div className="row mt-1 bg-gray" >
                    <video
                        ref={videoRef}
                        style={{
                            border: "1px solid rgba(0, 0, 0, .2)",
                            height: "75vh",
                        }} className="col-md-11" autoPlay></video>
                    <div className="mt-1">
                        <button className="btn btn-primary" onClick={() => start()}>Start live</button>&nbsp;
                        <button className="btn btn-danger" onClick={stop}>Stop live</button>&nbsp;
                        <button className="btn btn-primary" onClick={() => shareScreen()}>Share screen</button>
                        &nbsp;<Link
                            className="btn btn-primary"
                            to={`/channel/${userId}/bot-commands`}>
                            Bot commands
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
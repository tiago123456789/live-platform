import { useEffect, useRef, useState } from "react";
import Header from "../components/Header"
import { get, get as getAccessToken, getValueByKey } from "../services/Token";
import api from "../services/Api"
import { finishChannelStream, startChannelStream } from "../services/Channel";
import { Link } from "react-router-dom";
import webSocket from "../services/Websocket"

const socket = webSocket()

export default () => {
    let peers = [];
    let videoRef = useRef()

    const [localStream, setLocalStream] = useState()
    const [localScreen, setLocalScreen] = useState()
    const [channel, setChannel] = useState(null)
    const [description, setDescription] = useState("")
    const userId = getValueByKey("userId", getAccessToken())

    const start = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true, video: true
        });

        setLocalStream(stream)
        await startChannelStream(
            userId
        )

        videoRef.current.srcObject = stream;
    }

    const shareScreen = async () => {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                mediaSource: "screen",
                cursor: "always",
                width: { ideal: 1920, max: 1920 },
                height: { ideal: 1080, max: 1080 }
            },
            audio: true
        })
        setLocalScreen(screenStream)
        videoRef.current.srcObject = screenStream;
    }

    const stop = async (event) => {
        event.preventDefault();
        if (localScreen) {
            localScreen.getTracks().forEach(track => track.stop())
        } else if (localStream) {
            localStream.getTracks().forEach(track => track.stop())
        }

        await finishChannelStream(
            userId
        )
        videoRef.current.srcObject = null;
    }

    const create = async (event) => {
        event.preventDefault()
        await api.post(`http://localhost:3001/channels`, { description })
        setChannel({ description })
    }

    const getChannel = async () => {
        try {
            const userId = getValueByKey("userId", getAccessToken())
            const response = await api.get(`http://localhost:3001/channels/${userId}`)
            setChannel(response.data)
        } catch (error) {
            setChannel(null)
        }

    }

    useEffect(() => {
        getChannel();

    }, [])

    useEffect(() => {
        if (localStream != undefined || localScreen != undefined) {
            const userId = getValueByKey("userId", getAccessToken())

            socket.on(`new-viewer-${userId}`, async (data) => {
                peers[data.socketId] = new RTCPeerConnection({})

                if (localScreen) {
                    localScreen.getTracks().forEach(track => {
                        peers[data.socketId].addTrack(track, localScreen)
                    })
                    peers[data.socketId].addStream(localScreen);
                }

                if (localStream) {
                    localStream.getTracks().forEach(track => {
                        peers[data.socketId].addTrack(track, localStream)
                    })
                    peers[data.socketId].addStream(localStream);
                }

                peers[data.socketId].onicecandidate = ({ candidate }) => {
                    socket.emit('ice-candidates', { candidate: candidate, to: data.socketId, sender: socket.id });
                };

                peers[data.socketId].onconnectionstatechange = ev => {
                    switch (peers[data.socketId].connectionState) {
                        case "disconnected":
                        case "closed":
                        case "failed":
                            peers[data.socketId].close()
                            break;
                    }
                }

                peers[data.socketId].onsignalingstatechange = () => {
                    switch (peers[data.socketId].signalingState) {
                        case 'closed':
                            peers[data.socketId].close()
                            break;
                    }
                };

                const offer = await peers[data.socketId].createOffer()
                await peers[data.socketId].setLocalDescription(offer);
                socket.emit("create-offer", { to: data.socketId, from: socket.id, offer })
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
                {channel == null &&
                    <button className="btn btn-primary mt-3 mb-2">Create channel</button>
                }

                {channel == null &&
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
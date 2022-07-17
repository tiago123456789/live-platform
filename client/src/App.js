import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import "./assets/style.css"
import Chat from "./components/Chat";
import Header from "./components/Header";
import VideoLive from "./components/VideoLive";
import webSocket from "./services/Websocket"
import { get, getValueByKey } from "./services/Token";

const socket = webSocket()

function App() {
  const params = useParams()
  const remoteRef = useRef()
  let [peerConnection, setPeerConnection] = useState()
  let [viewers, setViewer] = useState([])

  const incrementViewer = (totalViewers) => {
    setViewer(totalViewers)
  }

  const trackStream = (event) => {
    remoteRef.current.srcObject = event.streams[0];
    remoteRef.current.autoplay = true
  }


  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("new-user", {
        userId: getValueByKey("userId", get()),
        channelId: params.channel,
        socketId: webSocket.id
      })

      socket.on("made-offer", async (data) => {
        peerConnection = new RTCPeerConnection({ })

        peerConnection.ontrack = trackStream

        peerConnection.onicecandidate = ({ candidate }) => {
          socket.emit('ice-candidates', { candidate: candidate, to: data.from, sender: socket.id });
        };

        peerConnection.setRemoteDescription(data.offer)
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer)
        socket.emit("create-answer", { to: data.from, from: socket.id, answer })
      })

      socket.on("ice-candidates", async (data) => {
        if (data.candidate && !data.onicecandidate) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      })
    })
  }, [])

  return (
    <>
      <Header />
      <section className="container-fluid mt-2">
        <div className="row">
          <VideoLive remoteRef={remoteRef} viewer={viewers} />
          <Chat incrementViewer={incrementViewer} />
        </div>
      </section>
    </>

  );
}

export default App;

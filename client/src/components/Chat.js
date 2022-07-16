import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import webSocket from "../services/Websocket"

const socket = webSocket()

export default ({ incrementViewer }) => {
  const params = useParams()
  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const username = localStorage.getItem("username") || `Username ${Math.random()}`

  const sendMessage = (event) => {
    event.preventDefault()
    socket.emit("messages", { channelId: params.channel, room, username, message: message, postedAt: new Date().toLocaleTimeString() })
    const data = { room, username: "You", message, postedAt: new Date().toLocaleTimeString() }
    setMessages([data, ...messages])
    setMessage("")
  }

  const addNewMessageAnotherUser = (data) => {
    setMessages((previous) => {
      const lastMessage = previous[(previous.length - 1)]
      if (
        lastMessage &&
        lastMessage.username == data.username && 
        lastMessage.message == data.message
      ) {
        return [...previous];
      }

      return [data, ...previous] 
    })
  }

  useEffect(() => {
    const room = `room_${params.channel}`; 
    setRoom(room)

    socket.on("connect", () => {
      socket.on('reply_bot_command', addNewMessageAnotherUser)
      socket.on("newMessage", addNewMessageAnotherUser)
      socket.on("newViewer", (data) => {
        incrementViewer(data.totalViewers)
      })

      socket.emit("subscribe", { room })
    })

    return () => socket.close()
  },[])

  return (
    <div id="chat" className="col-md-4">
      <div className="card" style={{ width: "100%", height: "89vh" }}>
        <div className="card-body">
          <div>
            <div id="chat-messages">
              {messages.map((message, index) => {
                return <ChatMessage key={index}
                  postedAt={message.postedAt}
                  username={message.username}
                  message={message.message} />
              })
              }
            </div>
            <div className="input-group mt-4">
              <input
                onChange={(event) => setMessage(event.target.value)}
                type="text"
                value={message}
                className="form-control"
                placeholder="Type any message here"
                aria-describedby="button-addon2"
              />
              <button
                onClick={sendMessage}
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
              >
                Send
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
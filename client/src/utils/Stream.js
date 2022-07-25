const CONSTRAINTS_CAPTURE_CAMERA_AND_SCREEN = {
    audio: true, 
    video: {
        mediaSource: "screen",
        cursor: "always",
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 }
    }
}

export const replaceVideoStream = (peers, streamVideoToReplace) => {
    let videoTrack = streamVideoToReplace.getVideoTracks()[0];
    for (let p in peers) {
        let pc = peers[p];
        let sender = pc.getSenders ? pc.getSenders().find(s => s.track && s.track.kind === "video") : false;
        sender.replaceTrack(videoTrack);
    }
}

export const stopStream = (stream) => {
    if (stream)
        stream.getTracks().forEach(track => track.stop())
}

export const getUserScreen = () => {
    return navigator.mediaDevices
        .getDisplayMedia(CONSTRAINTS_CAPTURE_CAMERA_AND_SCREEN)
}

export const getUserCameraAndAudio = () => {
    return navigator.mediaDevices
        .getUserMedia(CONSTRAINTS_CAPTURE_CAMERA_AND_SCREEN);
}

export const receiveAnswer = () => {

}

export const startStreamNewUser = async (
    data, peers, localScreen, localStream, socket
) => {
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
}


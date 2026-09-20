import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import styles from "../styles/videoMeetCss.module.css";
import server from "../environment";

const server_url = server;
const peerConfigConnections = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export default function VideoMeetComponent() {
    const socketRef = useRef(null);
    const socketIdRef = useRef(null);
    const localVideoref = useRef(null);
    const videoRef = useRef([]);
    const connectionsRef = useRef({});
    const localStreamRef = useRef(null);
    const cameraTrackRef = useRef(null);
    const microphoneTrackRef = useRef(null);
    const screenTrackRef = useRef(null);
    const mountedRef = useRef(true);

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [video, setVideo] = useState(false);
    const [audio, setAudio] = useState(false);
    const [screen, setScreen] = useState(false);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [showModal, setModal] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [videos, setVideos] = useState([]);
    const [mediaReady, setMediaReady] = useState(false);

    useEffect(() => {
        mountedRef.current = true;
        initializePreview();
        setScreenAvailable(!!navigator.mediaDevices?.getDisplayMedia);

        return () => {
            mountedRef.current = false;
            try { socketRef.current?.disconnect(); } catch (e) { console.log(e); }
            Object.values(connectionsRef.current).forEach((connection) => {
                try { connection.close(); } catch (e) { console.log(e); }
            });
            try { localStreamRef.current?.getTracks().forEach((track) => track.stop()); } catch (e) { console.log(e); }
            try { screenTrackRef.current?.stop(); } catch (e) { console.log(e); }
            localStreamRef.current = null;
            window.localStream = null;
        };
    }, []);

    const initializePreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            window.localStream = stream;

            const cameraTrack = stream.getVideoTracks()[0] || null;
            const microphoneTrack = stream.getAudioTracks()[0] || null;
            cameraTrackRef.current = cameraTrack;
            microphoneTrackRef.current = microphoneTrack;

            if (cameraTrack) {
                cameraTrack.enabled = true;
                setVideoAvailable(true);
                setVideo(true);
                cameraTrack.onended = () => {
                    if (mountedRef.current) setVideo(false);
                };
            } else {
                setVideoAvailable(false);
                setVideo(false);
            }

            if (microphoneTrack) {
                microphoneTrack.enabled = true;
                setAudioAvailable(true);
                setAudio(true);
                microphoneTrack.onended = () => {
                    if (mountedRef.current) setAudio(false);
                };
            } else {
                setAudioAvailable(false);
                setAudio(false);
            }

            if (localVideoref.current) localVideoref.current.srcObject = stream;
            setMediaReady(true);
        } catch (error) {
            console.error("Camera/Microphone permission error:", error);
            setMediaReady(false);
            try {
                const test = await navigator.mediaDevices.getUserMedia({ video: true });
                setVideoAvailable(true);
                test.getTracks().forEach((track) => track.stop());
            } catch (e) { setVideoAvailable(false); }
            try {
                const test = await navigator.mediaDevices.getUserMedia({ audio: true });
                setAudioAvailable(true);
                test.getTracks().forEach((track) => track.stop());
            } catch (e) { setAudioAvailable(false); }
        }
    };

    const getVideoTrack = () => cameraTrackRef.current || localStreamRef.current?.getVideoTracks()[0] || null;
    const getAudioTrack = () => microphoneTrackRef.current || localStreamRef.current?.getAudioTracks()[0] || null;

    const handleVideo = () => {
        const track = getVideoTrack();
        if (!track) return console.log("Camera track not available");
        track.enabled = !track.enabled;
        setVideo(track.enabled);
    };

    const handleAudio = () => {
        const track = getAudioTrack();
        if (!track) return console.log("Microphone track not available");
        track.enabled = !track.enabled;
        setAudio(track.enabled);
    };

    const replacePeerVideoTrack = async (newTrack) => {
        await Promise.all(Object.values(connectionsRef.current).map(async (connection) => {
            try {
                const sender = connection.getSenders().find((item) => item.track?.kind === "video");
                if (sender) await sender.replaceTrack(newTrack);
            } catch (error) { console.error("replaceTrack error:", error); }
        }));
    };

    const startScreenShare = async () => {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            const displayTrack = displayStream.getVideoTracks()[0];
            if (!displayTrack) return setScreen(false);
            screenTrackRef.current = displayTrack;
            await replacePeerVideoTrack(displayTrack);

            const previewStream = new MediaStream([displayTrack]);
            const mic = getAudioTrack();
            if (mic) previewStream.addTrack(mic);
            if (localVideoref.current) localVideoref.current.srcObject = previewStream;

            displayTrack.onended = () => stopScreenShare();
        } catch (error) {
            console.log("Screen share cancelled/error:", error);
            setScreen(false);
        }
    };

    const stopScreenShare = async () => {
        const cameraTrack = getVideoTrack();
        if (cameraTrack) {
            await replacePeerVideoTrack(cameraTrack);
            if (localVideoref.current) localVideoref.current.srcObject = localStreamRef.current;
        }
        try { screenTrackRef.current?.stop(); } catch (e) { console.log(e); }
        screenTrackRef.current = null;
        setScreen(false);
    };

    useEffect(() => {
        if (screen) startScreenShare();
        else if (screenTrackRef.current) stopScreenShare();
    }, [screen]);

    const createPeerConnection = (remoteId) => {
        const connection = new RTCPeerConnection(peerConfigConnections);

        connection.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.emit("signal", remoteId, JSON.stringify({ ice: event.candidate }));
            }
        };

        connection.ontrack = (event) => {
            const stream = event.streams?.[0];
            if (!stream) return;
            setVideos((current) => {
                const exists = current.some((item) => item.socketId === remoteId);
                const updated = exists
                    ? current.map((item) => item.socketId === remoteId ? { ...item, stream } : item)
                    : [...current, { socketId: remoteId, stream }];
                videoRef.current = updated;
                return updated;
            });
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => connection.addTrack(track, localStreamRef.current));
        }
        connectionsRef.current[remoteId] = connection;
        return connection;
    };

    const makeOffer = async (remoteId) => {
        const connection = connectionsRef.current[remoteId];
        if (!connection || !socketRef.current) return;
        try {
            const offer = await connection.createOffer();
            await connection.setLocalDescription(offer);
            socketRef.current.emit("signal", remoteId, JSON.stringify({ sdp: connection.localDescription }));
        } catch (error) { console.error("Offer error:", error); }
    };

    const gotMessageFromServer = async (fromId, messageData) => {
        if (fromId === socketIdRef.current) return;
        const signal = JSON.parse(messageData);
        const connection = connectionsRef.current[fromId];
        if (!connection) return;
        try {
            if (signal.sdp) {
                await connection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                if (signal.sdp.type === "offer") {
                    const answer = await connection.createAnswer();
                    await connection.setLocalDescription(answer);
                    socketRef.current.emit("signal", fromId, JSON.stringify({ sdp: connection.localDescription }));
                }
            }
            if (signal.ice) await connection.addIceCandidate(new RTCIceCandidate(signal.ice));
        } catch (error) { console.error("Signal/WebRTC error:", error); }
    };

    const connectToSocketServer = () => {
        if (socketRef.current) return;
        socketRef.current = io.connect(server_url, { secure: false });
        socketRef.current.on("signal", gotMessageFromServer);

        socketRef.current.on("connect", () => {
            socketIdRef.current = socketRef.current.id;
            socketRef.current.emit("join-call", window.location.href);
            socketRef.current.on("chat-message", addMessage);

            socketRef.current.on("user-left", (id) => {
                setVideos((current) => {
                    const updated = current.filter((item) => item.socketId !== id);
                    videoRef.current = updated;
                    return updated;
                });
                try { connectionsRef.current[id]?.close(); } catch (e) { console.log(e); }
                delete connectionsRef.current[id];
            });

            socketRef.current.on("user-joined", async (id, clients) => {
                for (const remoteId of clients) {
                    if (remoteId === socketIdRef.current || connectionsRef.current[remoteId]) continue;
                    createPeerConnection(remoteId);
                }
                if (id === socketIdRef.current) {
                    for (const remoteId of clients) {
                        if (remoteId !== socketIdRef.current) await makeOffer(remoteId);
                    }
                } else if (!connectionsRef.current[id]) {
                    createPeerConnection(id);
                }
            });
        });

        socketRef.current.on("connect_error", (error) => console.error("Socket connection error:", error));
    };

    const connect = async () => {
        if (!username.trim()) return alert("Please enter your name.");
        if (!localStreamRef.current) {
            await initializePreview();
            if (!localStreamRef.current) return alert("Please allow camera and microphone permission before joining.");
        }
        setAskForUsername(false);
        setModal(false);
        connectToSocketServer();
    };

    const handleEndCall = () => {
        try { screenTrackRef.current?.stop(); } catch (e) { console.log(e); }
        try { localStreamRef.current?.getTracks().forEach((track) => track.stop()); } catch (e) { console.log(e); }
        Object.values(connectionsRef.current).forEach((connection) => { try { connection.close(); } catch (e) { console.log(e); } });
        try { socketRef.current?.disconnect(); } catch (e) { console.log(e); }
        window.localStream = null;
        window.location.href = "/";
    };

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prev) => [...prev, { sender, data }]);
        if (socketIdSender !== socketIdRef.current) setNewMessages((prev) => prev + 1);
    };

    const sendMessage = () => {
        if (!message.trim() || !socketRef.current) return;
        socketRef.current.emit("chat-message", message, username);
        setMessage("");
    };

    return (
        <div className={styles.meetPage}>
            {askForUsername ? (
                <div className={styles.lobbyPage}>
                    <div className={styles.lobbyCard}>
                        <div className={styles.lobbyHeader}>
                            <span className={styles.lobbyBadge}>DEVMEET</span>
                            <h1>Join your meeting</h1>
                            <p>Enter your name and check your camera and microphone before joining.</p>
                        </div>

                        <div className={styles.previewBox}>
                            <video ref={localVideoref} className={styles.previewVideo} autoPlay muted playsInline />
                            {!video && <div className={styles.cameraOffOverlay}><VideocamOffIcon /><span>Camera is off</span></div>}
                            {!mediaReady && <div className={styles.permissionOverlay}><span>Requesting camera & microphone...</span></div>}
                        </div>

                        <div className={styles.previewControls}>
                            <button type="button" className={`${styles.previewControl} ${video ? styles.activeControl : styles.offControl}`} onClick={handleVideo} disabled={!videoAvailable}>
                                {video ? <VideocamIcon /> : <VideocamOffIcon />}<span>{video ? "Camera On" : "Camera Off"}</span>
                            </button>
                            <button type="button" className={`${styles.previewControl} ${audio ? styles.activeControl : styles.offControl}`} onClick={handleAudio} disabled={!audioAvailable}>
                                {audio ? <MicIcon /> : <MicOffIcon />}<span>{audio ? "Mic On" : "Mic Off"}</span>
                            </button>
                        </div>

                        <TextField fullWidth label="Your name" value={username} onChange={(e) => setUsername(e.target.value)} variant="outlined" className={styles.nameInput} onKeyDown={(e) => e.key === "Enter" && connect()} />
                        <Button variant="contained" onClick={connect} className={styles.joinButton}>Join Meeting</Button>
                        <p className={styles.permissionHint}>You can turn your camera or microphone on/off before joining.</p>
                    </div>
                </div>
            ) : (
                <div className={styles.meetVideoContainer}>
                    {showModal && (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <div className={styles.chatHeader}>
                                    <div><h2>Meeting Chat</h2><span>{username}</span></div>
                                    <button type="button" className={styles.closeChatButton} onClick={() => setModal(false)}>×</button>
                                </div>
                                <div className={styles.chattingDisplay}>
                                    {messages.length ? messages.map((item, index) => (
                                        <div className={styles.messageItem} key={index}><p className={styles.messageSender}>{item.sender}</p><p className={styles.messageText}>{item.data}</p></div>
                                    )) : <div className={styles.emptyChat}><ChatIcon /><p>No messages yet</p></div>}
                                </div>
                                <div className={styles.chattingArea}>
                                    <TextField fullWidth value={message} onChange={(e) => setMessage(e.target.value)} label="Type a message" variant="outlined" onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
                                    <Button variant="contained" onClick={sendMessage}>Send</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.topBar}>
                        <div className={styles.meetingBrand}><span>DEVMEET</span><small>{username}</small></div>
                        <div className={styles.topBarStatus}><span className={styles.statusDot}></span>Live meeting</div>
                    </div>

                   <div className={styles.videoStage}>

    <div className={styles.conferenceView}>

        <div className={styles.localVideoCard}>
            <video
                className={styles.meetUserVideo}
                ref={localVideoref}
                autoPlay
                muted
                playsInline
            />

            {!video && (
                <div className={styles.videoOffOverlay}>
                    <VideocamOffIcon />
                    <span>Camera Off</span>
                </div>
            )}

            <div className={styles.localNameTag}>
                You · {username}
            </div>
        </div>

        {videos.map((videoItem) => (
            <div
                className={styles.remoteVideoCard}
                key={videoItem.socketId}
            >
                <video
                    data-socket={videoItem.socketId}
                    ref={(ref) => {
                        if (ref && videoItem.stream) {
                            ref.srcObject = videoItem.stream;
                        }
                    }}
                    autoPlay
                    playsInline
                />
            </div>
        ))}

        {videos.length === 0 && (
            <div className={styles.waitingCard}>
                <div className={styles.waitingIcon}>
                    <VideocamIcon />
                </div>

                <h2>Waiting for others to join</h2>

                <p>
                    Share your meeting link with the participant
                    you want to interview.
                </p>
            </div>
        )}

    </div>

</div>

                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} className={`${styles.meetingControl} ${video ? styles.controlOn : styles.controlOff}`} title={video ? "Turn camera off" : "Turn camera on"}>{video ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton>
                        <IconButton onClick={handleEndCall} className={`${styles.meetingControl} ${styles.endCallControl}`} title="Leave meeting"><CallEndIcon /></IconButton>
                        <IconButton onClick={handleAudio} className={`${styles.meetingControl} ${audio ? styles.controlOn : styles.controlOff}`} title={audio ? "Mute microphone" : "Unmute microphone"}>{audio ? <MicIcon /> : <MicOffIcon />}</IconButton>
                        {screenAvailable && <IconButton onClick={() => setScreen((prev) => !prev)} className={`${styles.meetingControl} ${screen ? styles.controlOn : styles.controlOff}`} title={screen ? "Stop sharing" : "Share screen"}>{screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}</IconButton>}
                        <Badge badgeContent={newMessages} max={999} color="error" overlap="circular"><IconButton onClick={() => { setModal((prev) => !prev); setNewMessages(0); }} className={`${styles.meetingControl} ${styles.controlOn}`} title="Open chat"><ChatIcon /></IconButton></Badge>
                    </div>
                </div>
            )}
        </div>
    );
}

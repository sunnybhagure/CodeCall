import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const peerConfigConnections = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export function useWebRTC(serverUrl, username) {
    const socketRef = useRef(null);
    const socketIdRef = useRef(null);
    const localStreamRef = useRef(null);
    const cameraTrackRef = useRef(null);
    const microphoneTrackRef = useRef(null);
    const screenTrackRef = useRef(null);
    const connectionsRef = useRef({});
    
    const [videos, setVideos] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState(0);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);
    const [screenAvailable, setScreenAvailable] = useState(false);

    useEffect(() => {
        setScreenAvailable(!!navigator.mediaDevices?.getDisplayMedia);
        
        socketRef.current = io.connect(serverUrl, { secure: false });
        
        socketRef.current.on("connect", () => {
            socketIdRef.current = socketRef.current.id;
            socketRef.current.emit("join-call", window.location.href);
            socketRef.current.on("chat-message", addMessage);
            socketRef.current.on("signal", gotMessageFromServer);

            socketRef.current.on("user-left", (id) => {
                setVideos((current) => current.filter((item) => item.socketId !== id));
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

        return () => {
            try { socketRef.current?.disconnect(); } catch (e) { console.log(e); }
            Object.values(connectionsRef.current).forEach((conn) => {
                try { conn.close(); } catch (e) { console.log(e); }
            });
        };
    }, []);

    const setInitialStream = (stream) => {
        localStreamRef.current = stream;
        window.localStream = stream;
        cameraTrackRef.current = stream.getVideoTracks()[0] || null;
        microphoneTrackRef.current = stream.getAudioTracks()[0] || null;
    };

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
                return exists
                    ? current.map((item) => item.socketId === remoteId ? { ...item, stream } : item)
                    : [...current, { socketId: remoteId, stream }];
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
        } catch (error) { console.error("Signal error:", error); }
    };

    const handleVideo = () => {
        const track = cameraTrackRef.current || localStreamRef.current?.getVideoTracks()[0];
        if (!track) return;
        track.enabled = !track.enabled;
        setVideo(track.enabled);
    };

    const handleAudio = () => {
        const track = microphoneTrackRef.current || localStreamRef.current?.getAudioTracks()[0];
        if (!track) return;
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

    const toggleScreenShare = async () => {
        try {
            if (!screen) {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                const displayTrack = displayStream.getVideoTracks()[0];
                if (!displayTrack) return;
                screenTrackRef.current = displayTrack;
                await replacePeerVideoTrack(displayTrack);
                setScreen(true);
                displayTrack.onended = () => toggleScreenShare();
            } else {
                const cameraTrack = cameraTrackRef.current || localStreamRef.current?.getVideoTracks()[0];
                if (cameraTrack) await replacePeerVideoTrack(cameraTrack);
                screenTrackRef.current?.stop();
                screenTrackRef.current = null;
                setScreen(false);
            }
        } catch (error) {
            console.log("Screen share error:", error);
            setScreen(false);
        }
    };

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prev) => [...prev, { sender, data }]);
        if (socketIdSender !== socketIdRef.current) setNewMessages((prev) => prev + 1);
    };

    const sendMessage = (messageText) => {
        if (!messageText.trim() || !socketRef.current) return;
        socketRef.current.emit("chat-message", messageText, username);
    };

    return {
        videos,
        messages,
        newMessages,
        setNewMessages,
        video,
        audio,
        screen,
        screenAvailable,
        handleVideo,
        handleAudio,
        toggleScreenShare,
        sendMessage,
        setInitialStream,
        localStreamRef,
        socketIdRef
    };
}
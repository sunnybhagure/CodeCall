import React, { useEffect, useRef, useState } from "react";
import LobbyPage from "../pages/LobbyPage";
import MeetingRoomPage from "../pages/MeetingRoomPage";
import { useWebRTC } from "../hooks/useWebRTC";
import server from "../environment";
import styles from "../styles/videoMeetCss.module.css";

const server_url = server;

export default function VideoMeetComponent() {
    const localVideoref = useRef(null);
    const mountedRef = useRef(true);

    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [mediaReady, setMediaReady] = useState(false);

    const {
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
        setInitialStream
    } = useWebRTC(server_url, username);

    useEffect(() => {
        mountedRef.current = true;
        initializePreview();

        return () => {
            mountedRef.current = false;
            try { window.localStream?.getTracks().forEach((track) => track.stop()); } catch (e) { console.log(e); }
        };
    }, []);

    const initializePreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setInitialStream(stream);
            if (localVideoref.current) localVideoref.current.srcObject = stream;
            setMediaReady(true);
        } catch (error) {
            console.error("Camera/Microphone permission error:", error);
            setMediaReady(false);
            try {
                const testV = await navigator.mediaDevices.getUserMedia({ video: true });
                setVideoAvailable(true);
                testV.getTracks().forEach((t) => t.stop());
            } catch (e) { setVideoAvailable(false); }
            try {
                const testA = await navigator.mediaDevices.getUserMedia({ audio: true });
                setAudioAvailable(true);
                testA.getTracks().forEach((t) => t.stop());
            } catch (e) { setAudioAvailable(false); }
        }
    };

    const connect = async () => {
        if (!username.trim()) return alert("Please enter your name.");
        if (!window.localStream) {
            await initializePreview();
            if (!window.localStream) return alert("Please allow camera and microphone permission before joining.");
        }
        setAskForUsername(false);
    };

    const handleEndCall = () => {
        try { window.localStream?.getTracks().forEach((track) => track.stop()); } catch (e) { console.log(e); }
        window.localStream = null;
        window.location.href = "/";
    };

    return (
        <div className={styles.meetPage}>
            {askForUsername ? (
                <LobbyPage
                    username={username}
                    setUsername={setUsername}
                    video={video}
                    audio={audio}
                    videoAvailable={videoAvailable}
                    audioAvailable={audioAvailable}
                    mediaReady={mediaReady}
                    localVideoref={localVideoref}
                    handleVideo={handleVideo}
                    handleAudio={handleAudio}
                    connect={connect}
                />
            ) : (
                <MeetingRoomPage
                    username={username}
                    videos={videos}
                    messages={messages}
                    newMessages={newMessages}
                    setNewMessages={setNewMessages}
                    video={video}
                    audio={audio}
                    screen={screen}
                    screenAvailable={screenAvailable}
                    localVideoref={localVideoref}
                    handleVideo={handleVideo}
                    handleAudio={handleAudio}
                    toggleScreenShare={toggleScreenShare}
                    sendMessage={sendMessage}
                    handleEndCall={handleEndCall}
                />
            )}
        </div>
    );
}
import React from "react";
import { TextField, Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PreviewMediaBox from "../Components/PreviewMediaBox";
import styles from "../styles/videoMeetCss.module.css";

export default function LobbyPage({
    username,
    setUsername,
    video,
    audio,
    videoAvailable,
    audioAvailable,
    mediaReady,
    localVideoref,
    handleVideo,
    handleAudio,
    connect
}) {
    return (
        <div className={styles.lobbyPage}>
            <div className={styles.lobbyCard}>
                <div className={styles.lobbyHeader}>
                    <span className={styles.lobbyBadge}>DEVMEET</span>
                    <h1>Join your meeting</h1>
                    <p>Enter your name and check your camera and microphone before joining.</p>
                </div>

                <PreviewMediaBox localVideoref={localVideoref} video={video} mediaReady={mediaReady} />

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
    );
}
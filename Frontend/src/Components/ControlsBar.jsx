import React from "react";
import { IconButton, Badge } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import styles from "../styles/videoMeetCss.module.css";

export default function ControlsBar({
    video,
    audio,
    screen,
    screenAvailable,
    newMessages,
    handleVideo,
    handleAudio,
    toggleScreenShare,
    toggleChat,
    handleEndCall
}) {
    return (
        <div className={styles.buttonContainers}>
            <IconButton onClick={handleVideo} className={`${styles.meetingControl} ${video ? styles.controlOn : styles.controlOff}`}>
                {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleEndCall} className={`${styles.meetingControl} ${styles.endCallControl}`}>
                <CallEndIcon />
            </IconButton>
            <IconButton onClick={handleAudio} className={`${styles.meetingControl} ${audio ? styles.controlOn : styles.controlOff}`}>
                {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            {screenAvailable && (
                <IconButton onClick={toggleScreenShare} className={`${styles.meetingControl} ${screen ? styles.controlOn : styles.controlOff}`}>
                    {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                </IconButton>
            )}
            <Badge badgeContent={newMessages} max={999} color="error" overlap="circular">
                <IconButton onClick={toggleChat} className={`${styles.meetingControl} ${styles.controlOn}`}>
                    <ChatIcon />
                </IconButton>
            </Badge>
        </div>
    );
}
import React from "react";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import styles from "../styles/videoMeetCss.module.css";

export default function VideoCard({ stream, isLocal, username, videoEnabled, muted }) {
    return (
        <div className={isLocal ? styles.localVideoCard : styles.remoteVideoCard}>
            <video
                ref={(ref) => {
                    if (ref && stream) ref.srcObject = stream;
                }}
                className={isLocal ? styles.meetUserVideo : ""}
                autoPlay
                muted={isLocal || muted}
                playsInline
            />
            {isLocal && !videoEnabled && (
                <div className={styles.videoOffOverlay}>
                    <VideocamOffIcon />
                    <span>Camera Off</span>
                </div>
            )}
            <div className={isLocal ? styles.localNameTag : styles.remoteNameTag}>
                {isLocal ? `You · ${username}` : username}
            </div>
        </div>
    );
}
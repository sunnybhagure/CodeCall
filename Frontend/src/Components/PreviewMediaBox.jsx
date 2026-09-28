import React from "react";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import styles from "../styles/videoMeetCss.module.css";

export default function PreviewMediaBox({ localVideoref, video, mediaReady }) {
    return (
        <div className={styles.previewBox}>
            <video ref={localVideoref} className={styles.previewVideo} autoPlay muted playsInline />
            {!video && (
                <div className={styles.cameraOffOverlay}>
                    <VideocamOffIcon />
                    <span>Camera is off</span>
                </div>
            )}
            {!mediaReady && (
                <div className={styles.permissionOverlay}>
                    <span>Requesting camera & microphone...</span>
                </div>
            )}
        </div>
    );
}
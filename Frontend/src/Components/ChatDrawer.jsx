import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import styles from "../styles/videoMeetCss.module.css";

export default function ChatDrawer({ messages, username, onClose, onSendMessage }) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim()) return;
        onSendMessage(message);
        setMessage("");
    };

    return (
        <div className={styles.chatRoom}>
            <div className={styles.chatContainer}>
                <div className={styles.chatHeader}>
                    <div><h2>Meeting Chat</h2><span>{username}</span></div>
                    <button type="button" className={styles.closeChatButton} onClick={onClose}>×</button>
                </div>
                <div className={styles.chattingDisplay}>
                    {messages.length ? messages.map((item, index) => (
                        <div className={styles.messageItem} key={index}>
                            <p className={styles.messageSender}>{item.sender}</p>
                            <p className={styles.messageText}>{item.data}</p>
                        </div>
                    )) : (
                        <div className={styles.emptyChat}><ChatIcon /><p>No messages yet</p></div>
                    )}
                </div>
                <div className={styles.chattingArea}>
                    <TextField fullWidth value={message} onChange={(e) => setMessage(e.target.value)} label="Type a message" variant="outlined" onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                    <Button variant="contained" onClick={handleSend}>Send</Button>
                </div>
            </div>
        </div>
    );
}
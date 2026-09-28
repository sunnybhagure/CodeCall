import React, { useState } from "react";
import VideoCard from "../Components/VideoCard";
import ControlsBar from "../Components/ControlsBar";
import ChatDrawer from "../Components/ChatDrawer";
import VideocamIcon from "@mui/icons-material/Videocam";
import styles from "../styles/videoMeetCss.module.css";

export default function MeetingRoomPage({
    username,
    videos,
    messages,
    newMessages,
    setNewMessages,
    video,
    audio,
    screen,
    screenAvailable,
    localVideoref,
    handleVideo,
    handleAudio,
    toggleScreenShare,
    sendMessage,
    handleEndCall
}) {
    const [showModal, setModal] = useState(false);

    return (
        <div className={styles.meetVideoContainer}>
            {showModal && (
                <ChatDrawer
                    messages={messages}
                    username={username}
                    onClose={() => setModal(false)}
                    onSendMessage={sendMessage}
                />
            )}

            <div className={styles.topBar}>
                <div className={styles.meetingBrand}><span>DEVMEET</span><small>{username}</small></div>
                <div className={styles.topBarStatus}><span className={styles.statusDot}></span>Live meeting</div>
            </div>

            <div className={styles.videoStage}>
                <div className={styles.conferenceView}>
                    <VideoCard stream={localVideoref.current?.srcObject} isLocal={true} username={username} videoEnabled={video} />

                    {videos.map((videoItem) => (
                        <VideoCard key={videoItem.socketId} stream={videoItem.stream} isLocal={false} username="Participant" />
                    ))}

                    {videos.length === 0 && (
                        <div className={styles.waitingCard}>
                            <div className={styles.waitingIcon}><VideocamIcon /></div>
                            <h2>Waiting for others to join</h2>
                            <p>Share your meeting link with the participant you want to interview.</p>
                        </div>
                    )}
                </div>
            </div>

            <ControlsBar
                video={video}
                audio={audio}
                screen={screen}
                screenAvailable={screenAvailable}
                newMessages={newMessages}
                handleVideo={handleVideo}
                handleAudio={handleAudio}
                toggleScreenShare={toggleScreenShare}
                toggleChat={() => { setModal((prev) => !prev); setNewMessages(0); }}
                handleEndCall={handleEndCall}
            />
        </div>
    );
}
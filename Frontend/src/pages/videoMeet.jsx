import '../App.css';
import React, { useRef, useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import "../styles/videoMeetCss.css"

var connections = {}

const peerConnectionConfig = {
  'iceServers': [
    { 'urls': 'stun:stun.l.google.com:19302' }
  ]
}

export default function VideoMeet() {

    var socketRef = useRef();
    let socketIdref = useRef();

    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video , setVideo] = useState();

    let [audio , setAudio] = useState();

    let [scenShareAvailable, setScreenShareAvailable] = useState();

    let [showModel, setShowModel] = useState();

    let [screenAvailable, setScreenAvailable] = useState();

    let [ message, setMessage] = useState();

    let [messages, setMessages] = useState([]);

    let [newMessage, setNewMessage] = useState();

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState();

    const videoRef = useRef();

    let [videos, setVideos] = useState([]);


    const getPermissions = async () => {
      try {
        const videoPermission  = await navigator.mediaDevices.getUserMedia({ video: true });
        if(videoPermission) {
          setVideoAvailable(true);
        }else {
          setVideoAvailable(false);
        } 

        const audioPermission = await navigator.mediaDevices.getUserMedia({  audio: true });
        if(audioPermission) {
          setAudioAvailable(true);
        }else {
          setAudioAvailable(false);
        } 

        if( navigator.mediaDevices.getDisplayMedia) {
          setScreenShareAvailable(true);
        }else {
          setScreenShareAvailable(false);
        }

        if(videoAvailable && audioAvailable) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
          
          if(userMediaStream) {
            window.localStream = userMediaStream;
            if(localVideoRef.current) {
              localVideoRef.current.srcObject = userMediaStream;
            }
          }
        }

      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };
    useEffect(() => {
      getPermissions();
    }, []);

  return (
    <div>
        {askForUsername === true ? 
        <div> 
            <h2>Enter your username</h2>
            <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Button variant="contained">Connect</Button>

            <div>
              <video ref={localVideoRef} autoPlay muted></video>
              </div>

        </div> : <>   </>

        }
    </div>
  )
}

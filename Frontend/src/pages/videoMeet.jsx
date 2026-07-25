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


    


    useEffect(() => {
      getPermissions();
    }, []);

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
      if(video !== undefined && audio !== undefined) {
        getUserMedia();
      }
    }, [video, audio]);


    let connectToSocketServer = () => {
      scocketRef.current = io.connect(server_url, { secure : false});
      socket.current.on('signal', gotMessageFromServer);
      socket.current.on('connect', () => {
        socketIdref.current = socket.current.id;

        socketRef.current.on("chat-message", addMessage);

        socketRef.current.on("user-left", (id) => {
          setVideo((videos)=> videos.filter((video) => video.id !== id));
        })

        socketRef.current.on("user-joined", (id, client) => {
          client.forEach((socketListId) => {
            if(socketListId !== socketIdref.current) {
              const peerConnection = new RTCPeerConnection(peerConnectionConfig);
              connections[socketListId] = peerConnection;
            }
          })
        })
      })
    }

     let getmedia = () => {
      setVideo(videoAvailable);
      setAudio(audioAvailable);
      // connectToSocketServer();
    }

    let connect = () => {
    }

    let getUserMediaSucess = (stream) => {

    }

    const getUserMedia = async () => {
      if ((video || audio) && (videoAvailable || audioAvailable)) {
        navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
          .then(() => { })
          .then((stream) => {})
          .catch((error) => {
            console.error('Error accessing media devices.', error);
          });
      }else {
        try {
          let tracks = localVideoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        } catch (err) {
          console.error('Error stopping media tracks.', err);
        }
      }
    }

   

  return (
    <div>
        {askForUsername === true ? 
        <div> 
            <h2>Enter your username</h2>
            <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Button variant="contained" onClick={connect}>Connect</Button>

            <div>
              <video ref={localVideoRef} autoPlay muted></video>
              </div>

        </div> : <>   </>

        }
    </div>
  )
}

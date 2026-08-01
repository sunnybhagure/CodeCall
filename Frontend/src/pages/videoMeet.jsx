import '../App.css';
import React, { useRef, useState, useEffect } from 'react'
import io from "socket.io-client";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import "../styles/videoMeetCss.css"
import server from '../environment.js';

const server_url = server;

var connections = {}

const peerConnectionConfig = {
  'iceServers': [
    { 'urls': 'stun:stun.l.google.com:19302' }
  ]
}

export default function VideoMeet() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video , setVideo] = useState();

    let [audio , setAudio] = useState();

    let [scenShareAvailable, setScreenShareAvailable] = useState();

    let [showModel, setShowModel] = useState();

    let [screenAvailable, setScreenAvailable] = useState();

    let [ message, setMessage] = useState('');

    let [messages, setMessages] = useState([]);

    let [newMessage, setNewMessage] = useState('');

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState('');

    const videoRef = useRef();

    let [videos, setVideos] = useState([]);


    


    useEffect(() => {
      getPermissions();
    }, []);

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
      try {
        // Request both video and audio in a single call to avoid multiple prompts
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        // If successful, mark available and attach to local video
        setVideoAvailable(true);
        setAudioAvailable(true);
        if (navigator.mediaDevices.getDisplayMedia) setScreenShareAvailable(true);

        if (stream) {
          window.localStream = stream;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices.', err);
        // If failed, mark availability appropriately
        setVideoAvailable(false);
        setAudioAvailable(false);
        setScreenShareAvailable(!!navigator.mediaDevices.getDisplayMedia);
      }
    };

    useEffect(() => {
      if(video !== undefined && audio !== undefined) {
        getUserMedia();
      }
    }, [video, audio]);

    let getMedia = () => {
      setVideo(videoAvailable);
      setAudio(audioAvailable);
      connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
          } catch (e) { console.log(e) }

          let blackSilence = (...args) => new MediaStream([black(...args), silence()])
          window.localStream = blackSilence()
          localVideoRef.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    const getUserMedia = async () => {
      if ((video || audio) && (videoAvailable || audioAvailable)) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: video, audio: audio });
          if (stream) getUserMediaSuccess(stream);
        } catch (error) {
          console.error('Error accessing media devices.', error);
        }
      } else {
        try {
          if (localVideoRef.current && localVideoRef.current.srcObject) {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
          }
        } catch (err) {
          console.error('Error stopping media tracks.', err);
        }
      }
    }

    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
          setScreenAvailable(false)

            try {
              let tracks = localVideoRef.current.srcObject.getTracks()
              tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            getUserMedia()

        })
    }



    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
      socketRef.current = io.connect(server_url, { secure : false});
      socketRef.current.on('signal', gotMessageFromServer);
      socketRef.current.on('connect', () => {
        socketIdRef.current = socketRef.current.id;

        // Join a default room so server can notify peers. Replace with proper room/path if available.
        try {
          const room = window.location.pathname || 'default';
          socketRef.current.emit('join-call', room);
        } catch (e) { console.log('join-call emit failed', e) }

        socketRef.current.on("chat-message", addMessage);

        socketRef.current.on("user-left", (id) => {
          setVideos((videos)=> videos.filter((video) => video.id !== id));
        })

        socketRef.current.on("user-joined", (joinedId, clientsArray) => {
          // clientsArray is an array of socket ids currently in the room
          if (!Array.isArray(clientsArray)) return;

          clientsArray.forEach((socketListId) => {
            // Skip ourselves
            if (socketListId === socketIdRef.current) return;

            // Only create a new connection if we don't already have one
            if (connections[socketListId]) return;

            const pc = new RTCPeerConnection(peerConnectionConfig);
            connections[socketListId] = pc;

            // ICE candidates -> send to peer
            pc.onicecandidate = function (event) {
              if (event.candidate != null) {
                socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
              }
            };

            // When remote track(s) arrive, attach to a video element
            // Prefer ontrack but keep onaddstream for backwards compatibility
            pc.ontrack = (event) => {
              const remoteStream = event.streams && event.streams[0];
              if (!remoteStream) return;

              let videoExists = (videoRef.current || []).find(v => v.socketId === socketListId);

              if (videoExists) {
                setVideos(videos => {
                  const updated = videos.map(v => v.socketId === socketListId ? { ...v, stream: remoteStream } : v);
                  videoRef.current = updated;
                  return updated;
                });
              } else {
                const newVideo = { socketId: socketListId, stream: remoteStream, autoplay: true, playsinline: true };
                setVideos(videos => {
                  const updated = [...videos, newVideo];
                  videoRef.current = updated;
                  return updated;
                });
              }
            };

            pc.onaddstream = (event) => {
              // fallback for older browsers
              const remoteStream = event.stream;
              let videoExists = (videoRef.current || []).find(v => v.socketId === socketListId);
              if (videoExists) {
                setVideos(videos => {
                  const updated = videos.map(v => v.socketId === socketListId ? { ...v, stream: remoteStream } : v);
                  videoRef.current = updated;
                  return updated;
                });
              } else {
                const newVideo = { socketId: socketListId, stream: remoteStream, autoplay: true, playsinline: true };
                setVideos(videos => {
                  const updated = [...videos, newVideo];
                  videoRef.current = updated;
                  return updated;
                });
              }
            };

            // Add local tracks instead of addStream (more reliable/live)
            if (window.localStream && window.localStream.getTracks) {
              try {
                window.localStream.getTracks().forEach(track => pc.addTrack(track, window.localStream));
              } catch (e) {
                // fallback to addStream if addTrack fails
                if (pc.addStream) pc.addStream(window.localStream);
              }
            } else {
              // fallback black/silence stream
              try {
                let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                window.localStream = blackSilence();
                if (pc.addStream) pc.addStream(window.localStream);
              } catch (e) { console.log(e) }
            }

            // Create an offer to this peer
            pc.createOffer().then((description) => {
              pc.setLocalDescription(description).then(() => {
                socketRef.current.emit('signal', socketListId, JSON.stringify({ 'sdp': pc.localDescription }));
              }).catch(e => console.log(e));
            }).catch(e => console.log(e));
          });
        })
        })
      
    
    }

     

    let connect = () => {
      if (!username) return;
      setAskForUsername(false);

      // If we already have a stream from permissions, attach it immediately
      if (window.localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = window.localStream;
      }

      getMedia();
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
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

        </div> : <>
            <video ref={localVideoRef} autoPlay muted></video>
            {videos.map((video) => (
                            <div key={video.socketId}>
                                <video

                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                            </div>

                        ))}
  

           </>

        }
    </div>
  )
} 
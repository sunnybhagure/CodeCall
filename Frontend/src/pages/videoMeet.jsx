import React from 'react'
import { useRef } from 'react'
import "../styles/videoMeetCss.css"

var connections = {}

const peerConnectionConfig = {
  'iceServers': [
    { 'urls': 'stun:stun.l.google.com:19302' }
  ]
}

export default function videoMeet() {

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
    }, []);

  return (
    <div>
        {askForUsername === true ? 
        <div> 
            <h2>Enter your username</h2>

        </div> : <>   </>

        }
    </div>
  )
}

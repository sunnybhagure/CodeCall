import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Stack } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

export default function InterviewLobby() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [username, setUsername] = useState("");
    const [code, setCode] = useState(roomId || "");
    const [videoOn, setVideoOn] = useState(true);
    const [micOn, setMicOn] = useState(true);

    const handleJoin = () => {
        if (!username.trim() || !code.trim()) {
            return alert("Krupaya tumche naav ani Room Code enter kara.");
        }
        navigate(`/interview-room/${code}`, { state: { username, videoOn, micOn } });
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#080d17", p: 2 }}>
            <Paper elevation={0} sx={{ bgcolor: "#101827", border: "1px solid rgba(255,255,255,.08)", p: 4, borderRadius: 3, width: "100%", maxWidth: "420px", color: "#fff", textAlign: "center" }}>
                <Typography fontSize={22} fontWeight={800} mb={1}>Interview Lobby</Typography>
                <Typography fontSize={13} color="#8f9bae" mb={3}>Enter your details before entering the live interview room.</Typography>

                <Box sx={{ width: "100%", aspectRatio: "16 / 9", bgcolor: "#1b2432", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", mb: 3, border: "1px solid rgba(255,255,255,.1)" }}>
                    {videoOn ? <Typography fontSize={13} color="#7f8ba0">Camera Preview Active</Typography> : <Stack direction="row" spacing={1} alignItems="center" color="#ea4335"><VideocamOffIcon /><Typography fontSize={13}>Camera is Off</Typography></Stack>}
                </Box>

                <Stack direction="row" justifyContent="center" spacing={2} mb={3}>
                    <Button variant="outlined" size="small" startIcon={videoOn ? <VideocamIcon /> : <VideocamOffIcon />} onClick={() => setVideoOn(!videoOn)} sx={{ color: "#fff", borderColor: "rgba(255,255,255,.2)", textTransform: "none" }}>{videoOn ? "Video On" : "Video Off"}</Button>
                    <Button variant="outlined" size="small" startIcon={micOn ? <MicIcon /> : <MicOffIcon />} onClick={() => setMicOn(!micOn)} sx={{ color: "#fff", borderColor: "rgba(255,255,255,.2)", textTransform: "none" }}>{micOn ? "Mic On" : "Mic Off"}</Button>
                </Stack>

                <TextField fullWidth label="Your Name" variant="outlined" size="small" value={username} onChange={(e) => setUsername(e.target.value)} sx={{ mb: 2, "& .MuiInputBase-root": { color: "#fff", bgcolor: "#0b111c" }, "& label": { color: "#8f9bae" }, "& fieldset": { borderColor: "rgba(255,255,255,.15)" } }} />
                <TextField fullWidth label="Interview / Room Code" variant="outlined" size="small" value={code} onChange={(e) => setCode(e.target.value)} sx={{ mb: 3, "& .MuiInputBase-root": { color: "#fff", bgcolor: "#0b111c" }, "& label": { color: "#8f9bae" }, "& fieldset": { borderColor: "rgba(255,255,255,.15)" } }} />

                <Button fullWidth variant="contained" onClick={handleJoin} sx={{ py: 1.2, bgcolor: "#4f46e5", fontWeight: 700, textTransform: "none", borderRadius: 2, "&:hover": { bgcolor: "#4338ca" } }}>
                    Join Interview Room
                </Button>
            </Paper>
        </Box>
    );
}
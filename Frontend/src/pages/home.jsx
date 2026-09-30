import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import {
    Button,
    IconButton,
    TextField,
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Chip,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

import RestoreIcon from "@mui/icons-material/Restore";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CodeIcon from "@mui/icons-material/Code";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { AuthContext } from "../contexts/AuthContext";
import server from "../environment";

function HomeComponent() {
    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    // Create Interview Modal States
    const [openModal, setOpenModal] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [jobRole, setJobRole] = useState("");
    const [createdRoomData, setCreatedRoomData] = useState(null);

    const handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;
        await addToUserHistory(meetingCode);
        navigate(`/interview/${meetingCode}`);
    };

   const handleCreateInterviewAPI = async () => {
    try {
        const token = localStorage.getItem("token");
        
        // Remove trailing slash from server URL if present to avoid double slashes
        const baseUrl = server.endsWith("/") ? server.slice(0, -1) : server;
        
        const response = await fetch(`${baseUrl}/api/v1/interview/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, companyName, jobRole }),
        });

        // Check if response is actually JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textResponse = await response.text();
            console.error("Non-JSON response received:", textResponse);
            alert("Server error: Endpoint not found or invalid server route (404).");
            return;
        }

        const data = await response.json();
        if (response.ok) {
            setCreatedRoomData(data.interview);
        } else {
            alert(data.message || "Failed to create interview");
        }
    } catch (error) {
        console.error("Error creating interview:", error);
        alert("Network or Server error occurred.");
    }
};

    return (
        <Box sx={{ minHeight: "100vh", width: "100%", background: "#ffffff", color: "#111827" }}>
            {/* Top Navigation */}
            <Box sx={{ height: "72px", px: { xs: 2, sm: 3, md: 5 }, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb" }}>
                <Typography sx={{ fontSize: { xs: "20px", sm: "23px" }, fontWeight: 800, color: "#111827" }}>
                    Apna Video Call
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={() => navigate("/history")} sx={{ color: "#374151" }}>
                        <RestoreIcon />
                    </IconButton>
                    <Typography sx={{ display: { xs: "none", sm: "block" }, mr: 1, fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                        History
                    </Typography>
                    <Button onClick={() => { localStorage.removeItem("token"); navigate("/auth"); }} variant="outlined" sx={{ textTransform: "none", borderRadius: "9px", fontWeight: 700, borderColor: "#d1d5db", color: "#374151" }}>
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto", px: { xs: 2, sm: 3, md: 5 }, py: { xs: 4, md: 6 } }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: { xs: 4, md: 7 }, alignItems: "center" }}>
                    <Box>
                        <Chip icon={<VideoCameraFrontIcon />} label="Video Meetings" sx={{ mb: 2, background: "#eef2ff", color: "#4338ca", fontWeight: 700 }} />
                        <Typography sx={{ fontSize: { xs: "30px", sm: "38px", md: "44px" }, lineHeight: 1.12, fontWeight: 800, color: "#111827", mb: 2 }}>
                            Providing Quality <br /> Video Calls
                        </Typography>
                        <Typography sx={{ maxWidth: "550px", color: "#6b7280", fontSize: "15px", lineHeight: 1.7, mb: 3 }}>
                            Connect with your friends, teammates and interviewers through high-quality video meetings.
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1.5, width: "100%", maxWidth: "520px", flexDirection: { xs: "column", sm: "row" } }}>
                            <TextField fullWidth size="small" value={meetingCode} onChange={(e) => setMeetingCode(e.target.value)} label="Meeting Code" placeholder="Enter meeting code" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
                            <Button onClick={handleJoinVideoCall} variant="contained" endIcon={<ArrowForwardIcon />} sx={{ minWidth: { xs: "100%", sm: "120px" }, borderRadius: "10px", textTransform: "none", fontWeight: 700, background: "#111827" }}>
                                Join
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Box component="img" src="/logo3.png" alt="Video Meeting" sx={{ width: "100%", maxWidth: "420px", height: "auto", objectFit: "contain" }} />
                    </Box>
                </Box>

                <Divider sx={{ my: { xs: 5, md: 7 } }} />

                {/* Interview Feature Card */}
                <Card elevation={0} sx={{ width: "100%", borderRadius: "20px", border: "1px solid #e5e7eb", background: "linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #f5f7ff 100%)" }}>
                    <Box sx={{ height: "5px", width: "100%", background: "linear-gradient(90deg, #4f46e5, #7c3aed, #2563eb)" }} />
                    <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 4 }}>
                            <Box sx={{ flex: 1 }}>
                                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                                    <Chip icon={<PersonSearchIcon />} label="Interview Platform" size="small" sx={{ background: "#eef2ff", color: "#4338ca", fontWeight: 700 }} />
                                    <Chip icon={<CodeIcon />} label="Live Coding" size="small" variant="outlined" sx={{ fontWeight: 600, borderColor: "#d1d5db", color: "#4b5563" }} />
                                </Stack>
                                <Typography sx={{ fontSize: { xs: "26px", sm: "30px" }, fontWeight: 800, color: "#111827", mb: 1 }}>
                                    Technical Interview
                                </Typography>
                                <Typography sx={{ maxWidth: "700px", color: "#6b7280", fontSize: "14px", lineHeight: 1.7, mb: 3 }}>
                                    Conduct or attend technical interviews with live video, real-time coding, question assigning, and collaborative tools.
                                </Typography>
                            </Box>
                            <Box sx={{ minWidth: { xs: "100%", md: "230px" }, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                <Button variant="contained" size="large" startIcon={<PersonSearchIcon />} onClick={() => navigate("/interview/lobby")} sx={{ width: "100%", minHeight: "50px", borderRadius: "11px", textTransform: "none", fontWeight: 800, background: "#4f46e5" }}>
                                    Take Interview
                                </Button>
                                <Button variant="outlined" size="large" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={() => setOpenModal(true)} sx={{ width: "100%", minHeight: "50px", borderRadius: "11px", textTransform: "none", fontWeight: 700, borderColor: "#c7d2fe", color: "#4338ca" }}>
                                    Create Interview
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Create Interview Dialog / Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Schedule Technical Interview</DialogTitle>
                <DialogContent>
                    {!createdRoomData ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                            <TextField fullWidth label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                            <TextField fullWidth label="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
                        </Box>
                    ) : (
                        <Box sx={{ mt: 2, p: 2, bgcolor: "#f3f4f6", borderRadius: 2 }}>
                            <Typography fontWeight={700} color="success.main" mb={1}>Interview Created Successfully!</Typography>
                            <Typography fontSize={13} color="#4b5563">Room / Interview ID:</Typography>
                            <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                                <Chip label={createdRoomData.roomId} color="primary" />
                                <IconButton size="small" onClick={() => navigator.clipboard.writeText(createdRoomData.roomId)}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenModal(false)} sx={{ textTransform: "none" }}>Cancel</Button>
                    {!createdRoomData ? (
                        <Button variant="contained" onClick={handleCreateInterviewAPI} sx={{ textTransform: "none", bgcolor: "#4f46e5" }}>Generate Code</Button>
                    ) : (
                        <Button variant="contained" onClick={() => { setOpenModal(false); navigate(`/interview/${createdRoomData.roomId}`); }} sx={{ textTransform: "none", bgcolor: "#4f46e5" }}>Enter Room</Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default withAuth(HomeComponent);
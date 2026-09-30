import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Paper,
    Button,
    IconButton,
    Chip,
    Divider,
    Avatar,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tooltip,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

import {
    Videocam,
    VideocamOff,
    Mic,
    MicOff,
    CallEnd,
    Code,
    Chat,
    People,
    PlayArrow,
    Send,
    ContentCopy,
    AccessTime,
    Assignment,
} from "@mui/icons-material";

import Editor from "@monaco-editor/react";
import server from "../environment";

const InterviewRoom = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const username = location.state?.username || "Guest User";
    const [videoOn, setVideoOn] = useState(location.state?.videoOn ?? true);
    const [micOn, setMicOn] = useState(location.state?.micOn ?? true);
    const [activePanel, setActivePanel] = useState("question");

    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(`function solution() {\n    // Write your code here\n}`);
    const [output, setOutput] = useState("");
    const [chatMessage, setChatMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [time, setTime] = useState(0);

    // Assign Question Modal State (for Interviewer)
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [questionsList, setQuestionsList] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        title: "Two Sum",
        description: "Given an array of integers and a target value, return the indices of two numbers that add up to the target.",
        difficulty: "Easy",
        examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }],
        constraints: ["2 <= nums.length <= 10000"]
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = () => {
        const minutes = Math.floor(time / 60).toString().padStart(2, "0");
        const seconds = (time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const fetchQuestions = async () => {
        try {
            const res = await fetch(`${server}/api/v1/questions`);
            const data = await res.json();
            if (res.ok) setQuestionsList(data.questions || []);
        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    };

    const handleOpenAssign = () => {
        fetchQuestions();
        setOpenAssignModal(true);
    };

    const handleSelectQuestion = (q) => {
        setCurrentQuestion(q);
        if (q.starterCode) setCode(q.starterCode);
        setOpenAssignModal(false);
    };

    const handleRunCode = async () => {
        setOutput("Running code and executing test cases...");
        // Simulated execution or API call to run code endpoint
        setTimeout(() => {
            setOutput(`Test Case 1 Passed ✓\nTest Case 2 Passed ✓\nAll tests completed successfully!`);
        }, 1000);
    };

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        setMessages((prev) => [...prev, { sender: username, message: chatMessage }]);
        setChatMessage("");
    };

    const handleEndInterview = () => {
        if (window.confirm("Are you sure you want to end this interview?")) {
            navigate("/");
        }
    };

    return (
        <Box sx={{ height: "100vh", width: "100%", bgcolor: "#080d17", color: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Top Bar */}
            <AppBar position="static" elevation={0} sx={{ bgcolor: "#0d1422", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                <Toolbar sx={{ minHeight: "62px !important", px: { xs: 1.5, md: 3 }, display: "flex", justifyContent: "space-between" }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: "#263a67", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Code />
                        </Box>
                        <Box>
                            <Typography fontWeight={800} fontSize={15}>CodeCall Interview</Typography>
                            <Typography fontSize={11} color="#7f8ba0">Live Coding & Evaluation</Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip icon={<Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#35d98a" }} />} label="LIVE" size="small" sx={{ bgcolor: "rgba(53,217,138,.12)", color: "#55e8a0", fontWeight: 800 }} />
                        <Chip icon={<AccessTime sx={{ fontSize: 15 }} />} label={formatTime()} size="small" sx={{ bgcolor: "#172132", color: "#b9c4d7" }} />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ display: { xs: "none", sm: "block" }, color: "#8d99ad", fontSize: 12 }}>Room</Typography>
                        <Chip label={roomId || "DEV-ROOM"} onClick={() => navigator.clipboard.writeText(roomId || "")} icon={<ContentCopy sx={{ fontSize: 14 }} />} size="small" sx={{ bgcolor: "#151e2d", color: "#cbd4e4", cursor: "pointer" }} />
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Main Content Grid */}
            <Box sx={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: { xs: "1fr", md: "32% 68%" }, gap: 1, p: 1 }}>
                {/* Left Side: Question Panel */}
                <Box sx={{ minHeight: 0, display: "flex", flexDirection: "column", gap: 1, overflow: "hidden" }}>
                    <Paper elevation={0} sx={{ flex: 1, minHeight: 0, bgcolor: "#101827", color: "#fff", border: "1px solid rgba(255,255,255,.07)", borderRadius: 2, overflow: "auto", p: { xs: 1.5, md: 2 } }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box>
                                <Typography fontSize={11} color="#7f8ba0" fontWeight={700} textTransform="uppercase">Coding Question</Typography>
                                <Typography fontSize={20} fontWeight={800} mt={0.5}>{currentQuestion.title}</Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <Chip label={currentQuestion.difficulty} size="small" sx={{ bgcolor: "rgba(53,217,138,.12)", color: "#55e8a0", fontWeight: 700 }} />
                                <Button variant="outlined" size="small" startIcon={<Assignment />} onClick={handleOpenAssign} sx={{ textTransform: "none", fontSize: 11, borderColor: "rgba(255,255,255,.2)", color: "#fff" }}>
                                    Assign Task
                                </Button>
                            </Stack>
                        </Stack>
                        <Typography fontSize={13} color="#b4bfce" lineHeight={1.7}>{currentQuestion.description}</Typography>
                        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,.07)" }} />
                        <Typography fontWeight={700} fontSize={14} mb={1}>Example</Typography>
                        <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: "#0a101b", fontFamily: "monospace", fontSize: 12, color: "#c8d2e2" }}>
                            <div>Input: {currentQuestion.examples?.[0]?.input}</div>
                            <div style={{ marginTop: 6 }}>Output: {currentQuestion.examples?.[0]?.output}</div>
                        </Box>
                    </Paper>

                    {/* Participants */}
                    <Paper elevation={0} sx={{ bgcolor: "#101827", border: "1px solid rgba(255,255,255,.07)", borderRadius: 2, p: 1.5, color: "#fff" }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                            <People sx={{ color: "#8293ff", fontSize: 19 }} />
                            <Typography fontSize={13} fontWeight={700}>Participants in Room</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 34, height: 34, bgcolor: "#66504b", fontSize: 13 }}>{username[0]?.toUpperCase()}</Avatar>
                            <Box>
                                <Typography fontSize={12} fontWeight={700}>{username}</Typography>
                                <Typography fontSize={10} color="#6f7c91">Active Participant</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Box>

                {/* Right Side: Video & Code Editor */}
                <Box sx={{ minHeight: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                    {/* Video Area */}
                    <Paper elevation={0} sx={{ height: { xs: "220px", md: "30%" }, minHeight: 170, bgcolor: "#05080e", border: "1px solid rgba(255,255,255,.07)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                        <Box sx={{ position: "absolute", inset: 0, bgcolor: "#111722", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Avatar sx={{ width: 70, height: 70, bgcolor: "#334979", fontSize: 25 }}>P</Avatar>
                            <Box sx={{ position: "absolute", left: 12, bottom: 10 }}>
                                <Chip label="Participant • Live" size="small" sx={{ bgcolor: "rgba(0,0,0,.65)", color: "#fff", fontSize: 11 }} />
                            </Box>
                        </Box>
                        {/* Local Self Video box */}
                        <Box sx={{ position: "absolute", right: 12, bottom: 12, width: { xs: 120, md: 160 }, height: { xs: 82, md: 105 }, bgcolor: "#1b2432", borderRadius: 1.5, border: "2px solid rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Avatar sx={{ width: 35, height: 35, bgcolor: "#425c96", fontSize: 13 }}>{username[0]?.toUpperCase()}</Avatar>
                            <Typography sx={{ position: "absolute", bottom: 5, left: 7, fontSize: 9, color: "#fff" }}>You ({username})</Typography>
                        </Box>
                    </Paper>

                    {/* Code Editor */}
                    <Paper elevation={0} sx={{ flex: 1, minHeight: 0, bgcolor: "#0b111c", border: "1px solid rgba(255,255,255,.07)", borderRadius: 2, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                        <Box sx={{ minHeight: 48, px: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#111927", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Code sx={{ color: "#8495ff", fontSize: 20 }} />
                                <Typography fontSize={13} fontWeight={700}>Coding Environment</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <FormControl size="small" sx={{ minWidth: 115, "& .MuiOutlinedInput-root": { color: "#fff", fontSize: 12 }, "& fieldset": { borderColor: "rgba(255,255,255,.12)" } }}>
                                    <InputLabel sx={{ color: "#8b97aa" }}>Language</InputLabel>
                                    <Select value={language} label="Language" onChange={(e) => setLanguage(e.target.value)}>
                                        <MenuItem value="javascript">JavaScript</MenuItem>
                                        <MenuItem value="java">Java</MenuItem>
                                        <MenuItem value="python">Python</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button variant="contained" size="small" startIcon={<PlayArrow />} onClick={handleRunCode} sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5, bgcolor: "#4f46e5" }}>
                                    Run
                                </Button>
                            </Stack>
                        </Box>

                        <Box sx={{ flex: 1, minHeight: 0 }}>
                            <Editor height="100%" language={language} theme="vs-dark" value={code} onChange={(val) => setCode(val || "")} options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }} />
                        </Box>

                        {output && (
                            <Box sx={{ height: 120, bgcolor: "#070c14", borderTop: "1px solid rgba(255,255,255,.08)", p: 1.5, overflow: "auto" }}>
                                <Typography fontSize={11} color="#7f8ba0" mb={0.7}>OUTPUT / TEST RESULTS</Typography>
                                <Typography component="pre" sx={{ margin: 0, color: "#b9c7d9", fontSize: 11, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{output}</Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>

            {/* Bottom Control Bar */}
            <Box sx={{ height: 64, flexShrink: 0, bgcolor: "#0d1422", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <Tooltip title={videoOn ? "Turn off camera" : "Turn on camera"}><IconButton onClick={() => setVideoOn(!videoOn)} sx={{ width: 44, height: 44, color: "#fff", bgcolor: videoOn ? "#263247" : "#572b35" }}>{videoOn ? <Videocam /> : <VideocamOff />}</IconButton></Tooltip>
                <Tooltip title={micOn ? "Mute microphone" : "Unmute microphone"}><IconButton onClick={() => setMicOn(!micOn)} sx={{ width: 44, height: 44, color: "#fff", bgcolor: micOn ? "#263247" : "#572b35" }}>{micOn ? <Mic /> : <MicOff />}</IconButton></Tooltip>
                <Tooltip title="Chat"><IconButton onClick={() => setActivePanel(activePanel === "chat" ? "question" : "chat")} sx={{ width: 44, height: 44, color: "#fff", bgcolor: activePanel === "chat" ? "#344a7d" : "#263247" }}><Chat /></IconButton></Tooltip>
                <Tooltip title="End interview"><IconButton onClick={handleEndInterview} sx={{ width: 48, height: 48, ml: 1, color: "#fff", bgcolor: "#d93645", "&:hover": { bgcolor: "#b82b38" } }}><CallEnd /></IconButton></Tooltip>
            </Box>

            {/* Chat Drawer */}
            {activePanel === "chat" && (
                <Paper elevation={10} sx={{ position: "fixed", right: 16, bottom: 76, width: { xs: "calc(100vw - 32px)", sm: 340 }, height: 420, bgcolor: "#111927", color: "#fff", border: "1px solid rgba(255,255,255,.1)", borderRadius: 2, zIndex: 100, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                        <Typography fontWeight={800} fontSize={14}>Interview Chat</Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 1.5, overflow: "auto" }}>
                        {messages.length === 0 ? (
                            <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#69768b" }}><Typography fontSize={12}>No messages yet</Typography></Box>
                        ) : (
                            messages.map((m, idx) => (
                                <Box key={idx} sx={{ mb: 1, p: 1, borderRadius: 1.5, bgcolor: "#1a2535" }}>
                                    <Typography fontSize={10} color="#8ea1ff" fontWeight={700}>{m.sender}</Typography>
                                    <Typography fontSize={12} mt={0.3}>{m.message}</Typography>
                                </Box>
                            ))
                        )}
                    </Box>
                    <Box sx={{ p: 1, display: "flex", gap: 1, borderTop: "1px solid rgba(255,255,255,.08)" }}>
                        <TextField fullWidth size="small" placeholder="Type a message..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} sx={{ "& .MuiInputBase-root": { color: "#fff", bgcolor: "#0b111c" } }} />
                        <IconButton onClick={handleSendMessage} sx={{ color: "#fff", bgcolor: "#304a91", borderRadius: 1.5 }}><Send /></IconButton>
                    </Box>
                </Paper>
            )}

            {/* Assign Question Dialog */}
            <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Select Coding Question to Assign</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        {questionsList.length === 0 ? (
                            <Typography fontSize={13} color="text.secondary">No questions found in database. You can add default ones or create via API.</Typography>
                        ) : (
                            questionsList.map((q) => (
                                <Paper key={q._id} elevation={0} onClick={() => handleSelectQuestion(q)} sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2, cursor: "pointer", "&:hover": { bgcolor: "#f9fafb" } }}>
                                    <Typography fontWeight={700}>{q.title}</Typography>
                                    <Chip label={q.difficulty} size="small" sx={{ mt: 1 }} />
                                </Paper>
                            ))
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAssignModal(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InterviewRoom;
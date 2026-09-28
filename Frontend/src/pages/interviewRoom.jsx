
import React, { useEffect, useState } from "react";
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
    CheckCircle,
    AccessTime,
} from "@mui/icons-material";

import Editor from "@monaco-editor/react";


const InterviewRoom = () => {

    const [videoOn, setVideoOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [activePanel, setActivePanel] = useState("question");

    const [language, setLanguage] = useState("javascript");

    const [code, setCode] = useState(
`function twoSum(nums, target) {
    // Write your code here
}`
    );

    const [output, setOutput] = useState("");
    const [chatMessage, setChatMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const [time, setTime] = useState(0);


    /* ================================
       INTERVIEW TIMER
    ================================= */

    useEffect(() => {

        const interval = setInterval(() => {
            setTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);

    }, []);


    const formatTime = () => {

        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");

        const seconds = (time % 60)
            .toString()
            .padStart(2, "0");

        return `${minutes}:${seconds}`;
    };


    /* ================================
       RUN CODE
    ================================= */

    const handleRunCode = () => {

        setOutput(
`Running code...

Test Case 1
Input: [2,7,11,15], 9
Expected: [0,1]

✓ Test case passed`
        );
    };


    /* ================================
       SEND CHAT
    ================================= */

    const handleSendMessage = () => {

        if (!chatMessage.trim()) return;

        setMessages((prev) => [
            ...prev,
            {
                sender: "You",
                message: chatMessage,
            },
        ]);

        setChatMessage("");
    };


    /* ================================
       END INTERVIEW
    ================================= */

    const handleEndInterview = () => {

        const confirmEnd = window.confirm(
            "Are you sure you want to end this interview?"
        );

        if (!confirmEnd) return;

        console.log("Interview ended");
    };


    return (
        <Box
            sx={{
                height: "100vh",
                width: "100%",
                bgcolor: "#080d17",
                color: "#fff",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >

            {/* =========================================
                TOP BAR
            ========================================== */}

            <AppBar
                position="static"
                elevation={0}
                sx={{
                    bgcolor: "#0d1422",
                    borderBottom: "1px solid rgba(255,255,255,.08)",
                }}
            >

                <Toolbar
                    sx={{
                        minHeight: "62px !important",
                        px: { xs: 1.5, md: 3 },
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >

                    {/* LEFT */}

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                    >

                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2,
                                bgcolor: "#263a67",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Code />
                        </Box>

                        <Box>

                            <Typography
                                fontWeight={800}
                                fontSize={15}
                            >
                                CodeCall Interview
                            </Typography>

                            <Typography
                                fontSize={11}
                                color="#7f8ba0"
                            >
                                Live Coding Interview
                            </Typography>

                        </Box>

                    </Stack>


                    {/* CENTER */}

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >

                        <Chip
                            icon={
                                <Box
                                    sx={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: "50%",
                                        bgcolor: "#35d98a",
                                    }}
                                />
                            }
                            label="LIVE"
                            size="small"
                            sx={{
                                bgcolor: "rgba(53,217,138,.12)",
                                color: "#55e8a0",
                                fontWeight: 800,
                            }}
                        />

                        <Chip
                            icon={<AccessTime sx={{ fontSize: 15 }} />}
                            label={formatTime()}
                            size="small"
                            sx={{
                                bgcolor: "#172132",
                                color: "#b9c4d7",
                            }}
                        />

                    </Stack>


                    {/* RIGHT */}

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >

                        <Typography
                            sx={{
                                display: { xs: "none", sm: "block" },
                                color: "#8d99ad",
                                fontSize: 12,
                            }}
                        >
                            Room
                        </Typography>

                        <Chip
                            label="DEV-4BF77702"
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    "DEV-4BF77702"
                                )
                            }
                            icon={<ContentCopy sx={{ fontSize: 14 }} />}
                            size="small"
                            sx={{
                                bgcolor: "#151e2d",
                                color: "#cbd4e4",
                                cursor: "pointer",
                            }}
                        />

                    </Stack>

                </Toolbar>

            </AppBar>


            {/* =========================================
                MAIN CONTENT
            ========================================== */}

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "32% 68%",
                    },
                    gap: 1,
                    p: 1,
                }}
            >


                {/* =====================================
                    LEFT SIDE
                ====================================== */}

                <Box
                    sx={{
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        overflow: "hidden",
                    }}
                >


                    {/* QUESTION */}

                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            bgcolor: "#101827",
                            color: "#fff",
                            border:
                                "1px solid rgba(255,255,255,.07)",
                            borderRadius: 2,
                            overflow: "auto",
                            p: { xs: 1.5, md: 2 },
                        }}
                    >

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >

                            <Box>

                                <Typography
                                    fontSize={11}
                                    color="#7f8ba0"
                                    fontWeight={700}
                                    textTransform="uppercase"
                                >
                                    Coding Question
                                </Typography>

                                <Typography
                                    fontSize={20}
                                    fontWeight={800}
                                    mt={0.5}
                                >
                                    Two Sum
                                </Typography>

                            </Box>

                            <Chip
                                label="Easy"
                                size="small"
                                sx={{
                                    bgcolor:
                                        "rgba(53,217,138,.12)",
                                    color: "#55e8a0",
                                    fontWeight: 700,
                                }}
                            />

                        </Stack>


                        <Typography
                            fontSize={13}
                            color="#b4bfce"
                            lineHeight={1.7}
                        >
                            Given an array of integers and a target
                            value, return the indices of two numbers
                            that add up to the target.
                        </Typography>


                        <Divider
                            sx={{
                                my: 2,
                                borderColor:
                                    "rgba(255,255,255,.07)",
                            }}
                        />


                        <Typography
                            fontWeight={700}
                            fontSize={14}
                            mb={1}
                        >
                            Example
                        </Typography>


                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 1.5,
                                bgcolor: "#0a101b",
                                fontFamily: "monospace",
                                fontSize: 12,
                                color: "#c8d2e2",
                            }}
                        >

                            <div>
                                Input: nums = [2,7,11,15],
                                target = 9
                            </div>

                            <div style={{ marginTop: 6 }}>
                                Output: [0,1]
                            </div>

                        </Box>


                        <Typography
                            fontWeight={700}
                            fontSize={14}
                            mt={2}
                            mb={1}
                        >
                            Constraints
                        </Typography>


                        <Box
                            component="ul"
                            sx={{
                                mt: 0,
                                pl: 2.5,
                                color: "#8f9bae",
                                fontSize: 12,
                                lineHeight: 1.8,
                            }}
                        >

                            <li>
                                2 ≤ nums.length ≤ 10000
                            </li>

                            <li>
                                Each input has exactly one solution
                            </li>

                            <li>
                                Do not use the same element twice
                            </li>

                        </Box>

                    </Paper>


                    {/* PARTICIPANTS */}

                    <Paper
                        elevation={0}
                        sx={{
                            bgcolor: "#101827",
                            border:
                                "1px solid rgba(255,255,255,.07)",
                            borderRadius: 2,
                            p: 1.5,
                            color: "#fff",
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            mb={1.5}
                        >

                            <People
                                sx={{
                                    color: "#8293ff",
                                    fontSize: 19,
                                }}
                            />

                            <Typography
                                fontSize={13}
                                fontWeight={700}
                            >
                                Participants
                            </Typography>

                        </Stack>


                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >

                            <Avatar
                                sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: "#354a83",
                                    fontSize: 13,
                                }}
                            >
                                S
                            </Avatar>

                            <Box>

                                <Typography
                                    fontSize={12}
                                    fontWeight={700}
                                >
                                    Saee
                                </Typography>

                                <Typography
                                    fontSize={10}
                                    color="#6f7c91"
                                >
                                    Interviewer
                                </Typography>

                            </Box>

                        </Stack>


                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            mt={1.5}
                        >

                            <Avatar
                                sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: "#66504b",
                                    fontSize: 13,
                                }}
                            >
                                N
                            </Avatar>

                            <Box>

                                <Typography
                                    fontSize={12}
                                    fontWeight={700}
                                >
                                    Nani
                                </Typography>

                                <Typography
                                    fontSize={10}
                                    color="#6f7c91"
                                >
                                    Candidate
                                </Typography>

                            </Box>

                        </Stack>

                    </Paper>

                </Box>


                {/* =====================================
                    RIGHT SIDE
                ====================================== */}

                <Box
                    sx={{
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                >


                    {/* VIDEO AREA */}

                    <Paper
                        elevation={0}
                        sx={{
                            height: { xs: "220px", md: "30%" },
                            minHeight: 170,
                            bgcolor: "#05080e",
                            border:
                                "1px solid rgba(255,255,255,.07)",
                            borderRadius: 2,
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >

                        {/* REMOTE VIDEO */}

                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                bgcolor: "#111722",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            <Avatar
                                sx={{
                                    width: 70,
                                    height: 70,
                                    bgcolor: "#334979",
                                    fontSize: 25,
                                }}
                            >
                                N
                            </Avatar>

                            <Box
                                sx={{
                                    position: "absolute",
                                    left: 12,
                                    bottom: 10,
                                }}
                            >

                                <Chip
                                    label="Nani • Candidate"
                                    size="small"
                                    sx={{
                                        bgcolor:
                                            "rgba(0,0,0,.65)",
                                        color: "#fff",
                                        fontSize: 11,
                                    }}
                                />

                            </Box>

                        </Box>


                        {/* LOCAL VIDEO */}

                        <Box
                            sx={{
                                position: "absolute",
                                right: 12,
                                bottom: 12,
                                width: {
                                    xs: 120,
                                    md: 160,
                                },
                                height: {
                                    xs: 82,
                                    md: 105,
                                },
                                bgcolor: "#1b2432",
                                borderRadius: 1.5,
                                border:
                                    "2px solid rgba(255,255,255,.18)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >

                            <Avatar
                                sx={{
                                    width: 35,
                                    height: 35,
                                    bgcolor: "#425c96",
                                    fontSize: 13,
                                }}
                            >
                                S
                            </Avatar>

                            <Typography
                                sx={{
                                    position: "absolute",
                                    bottom: 5,
                                    left: 7,
                                    fontSize: 9,
                                    color: "#fff",
                                }}
                            >
                                You
                            </Typography>

                        </Box>

                    </Paper>


                    {/* CODE EDITOR */}

                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            bgcolor: "#0b111c",
                            border:
                                "1px solid rgba(255,255,255,.07)",
                            borderRadius: 2,
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >

                        {/* EDITOR HEADER */}

                        <Box
                            sx={{
                                minHeight: 48,
                                px: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                bgcolor: "#111927",
                                borderBottom:
                                    "1px solid rgba(255,255,255,.07)",
                            }}
                        >

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >

                                <Code
                                    sx={{
                                        color: "#8495ff",
                                        fontSize: 20,
                                    }}
                                />

                                <Typography
                                    fontSize={13}
                                    fontWeight={700}
                                >
                                    Coding Environment
                                </Typography>

                            </Stack>


                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >

                                <FormControl
                                    size="small"
                                    sx={{
                                        minWidth: 115,
                                        "& .MuiOutlinedInput-root":
                                            {
                                                color: "#fff",
                                                fontSize: 12,
                                            },
                                        "& fieldset": {
                                            borderColor:
                                                "rgba(255,255,255,.12)",
                                        },
                                    }}
                                >

                                    <InputLabel
                                        sx={{
                                            color: "#8b97aa",
                                        }}
                                    >
                                        Language
                                    </InputLabel>

                                    <Select
                                        value={language}
                                        label="Language"
                                        onChange={(e) =>
                                            setLanguage(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <MenuItem value="javascript">
                                            JavaScript
                                        </MenuItem>

                                        <MenuItem value="java">
                                            Java
                                        </MenuItem>

                                        <MenuItem value="python">
                                            Python
                                        </MenuItem>

                                    </Select>

                                </FormControl>


                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<PlayArrow />}
                                    onClick={handleRunCode}
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: 700,
                                        borderRadius: 1.5,
                                    }}
                                >
                                    Run
                                </Button>

                            </Stack>

                        </Box>


                        {/* MONACO EDITOR */}

                        <Box
                            sx={{
                                flex: 1,
                                minHeight: 0,
                            }}
                        >

                            <Editor
                                height="100%"
                                language={language}
                                theme="vs-dark"
                                value={code}
                                onChange={(value) =>
                                    setCode(value || "")
                                }
                                options={{
                                    minimap: {
                                        enabled: false,
                                    },
                                    fontSize: 14,
                                    padding: {
                                        top: 12,
                                    },
                                    automaticLayout: true,
                                    scrollBeyondLastLine: false,
                                    wordWrap: "on",
                                }}
                            />

                        </Box>


                        {/* OUTPUT */}

                        {output && (
                            <Box
                                sx={{
                                    height: 120,
                                    bgcolor: "#070c14",
                                    borderTop:
                                        "1px solid rgba(255,255,255,.08)",
                                    p: 1.5,
                                    overflow: "auto",
                                }}
                            >

                                <Typography
                                    fontSize={11}
                                    color="#7f8ba0"
                                    mb={0.7}
                                >
                                    OUTPUT
                                </Typography>

                                <Typography
                                    component="pre"
                                    sx={{
                                        margin: 0,
                                        color: "#b9c7d9",
                                        fontSize: 11,
                                        fontFamily:
                                            "monospace",
                                        whiteSpace:
                                            "pre-wrap",
                                    }}
                                >
                                    {output}
                                </Typography>

                            </Box>
                        )}

                    </Paper>

                </Box>

            </Box>


            {/* =========================================
                BOTTOM CONTROL BAR
            ========================================== */}

            <Box
                sx={{
                    height: 64,
                    flexShrink: 0,
                    bgcolor: "#0d1422",
                    borderTop:
                        "1px solid rgba(255,255,255,.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                }}
            >

                <Tooltip title={videoOn ? "Turn off camera" : "Turn on camera"}>

                    <IconButton
                        onClick={() =>
                            setVideoOn(!videoOn)
                        }
                        sx={{
                            width: 44,
                            height: 44,
                            color: "#fff",
                            bgcolor: videoOn
                                ? "#263247"
                                : "#572b35",
                            "&:hover": {
                                bgcolor: videoOn
                                    ? "#34425a"
                                    : "#6b3340",
                            },
                        }}
                    >

                        {videoOn
                            ? <Videocam />
                            : <VideocamOff />
                        }

                    </IconButton>

                </Tooltip>


                <Tooltip title={micOn ? "Mute microphone" : "Unmute microphone"}>

                    <IconButton
                        onClick={() =>
                            setMicOn(!micOn)
                        }
                        sx={{
                            width: 44,
                            height: 44,
                            color: "#fff",
                            bgcolor: micOn
                                ? "#263247"
                                : "#572b35",
                            "&:hover": {
                                bgcolor: micOn
                                    ? "#34425a"
                                    : "#6b3340",
                            },
                        }}
                    >

                        {micOn
                            ? <Mic />
                            : <MicOff />
                        }

                    </IconButton>

                </Tooltip>


                <Tooltip title="Chat">

                    <IconButton
                        onClick={() =>
                            setActivePanel(
                                activePanel === "chat"
                                    ? "question"
                                    : "chat"
                            )
                        }
                        sx={{
                            width: 44,
                            height: 44,
                            color: "#fff",
                            bgcolor:
                                activePanel === "chat"
                                    ? "#344a7d"
                                    : "#263247",
                        }}
                    >

                        <Chat />

                    </IconButton>

                </Tooltip>


                <Tooltip title="End interview">

                    <IconButton
                        onClick={handleEndInterview}
                        sx={{
                            width: 48,
                            height: 48,
                            ml: 1,
                            color: "#fff",
                            bgcolor: "#d93645",
                            "&:hover": {
                                bgcolor: "#b82b38",
                            },
                        }}
                    >

                        <CallEnd />

                    </IconButton>

                </Tooltip>

            </Box>


            {/* =========================================
                CHAT DRAWER
            ========================================== */}

            {activePanel === "chat" && (

                <Paper
                    elevation={10}
                    sx={{
                        position: "fixed",
                        right: 16,
                        bottom: 76,
                        width: {
                            xs: "calc(100vw - 32px)",
                            sm: 340,
                        },
                        height: 420,
                        bgcolor: "#111927",
                        color: "#fff",
                        border:
                            "1px solid rgba(255,255,255,.1)",
                        borderRadius: 2,
                        zIndex: 100,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >

                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            borderBottom:
                                "1px solid rgba(255,255,255,.08)",
                        }}
                    >

                        <Typography
                            fontWeight={800}
                            fontSize={14}
                        >
                            Interview Chat
                        </Typography>

                        <Typography
                            fontSize={10}
                            color="#718096"
                        >
                            Communicate with participant
                        </Typography>

                    </Box>


                    <Box
                        sx={{
                            flex: 1,
                            p: 1.5,
                            overflow: "auto",
                        }}
                    >

                        {messages.length === 0 ? (

                            <Box
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#69768b",
                                }}
                            >

                                <Typography fontSize={12}>
                                    No messages yet
                                </Typography>

                            </Box>

                        ) : (

                            messages.map((msg, index) => (

                                <Box
                                    key={index}
                                    sx={{
                                        mb: 1,
                                        p: 1,
                                        borderRadius: 1.5,
                                        bgcolor: "#1a2535",
                                    }}
                                >

                                    <Typography
                                        fontSize={10}
                                        color="#8ea1ff"
                                        fontWeight={700}
                                    >
                                        {msg.sender}
                                    </Typography>

                                    <Typography
                                        fontSize={12}
                                        mt={0.3}
                                    >
                                        {msg.message}
                                    </Typography>

                                </Box>

                            ))

                        )}

                    </Box>


                    <Box
                        sx={{
                            p: 1,
                            display: "flex",
                            gap: 1,
                            borderTop:
                                "1px solid rgba(255,255,255,.08)",
                        }}
                    >

                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type a message..."
                            value={chatMessage}
                            onChange={(e) =>
                                setChatMessage(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    handleSendMessage();
                                }

                            }}
                            sx={{
                                "& .MuiInputBase-root": {
                                    color: "#fff",
                                    bgcolor: "#0b111c",
                                },
                                "& fieldset": {
                                    borderColor:
                                        "rgba(255,255,255,.1)",
                                },
                            }}
                        />

                        <IconButton
                            onClick={handleSendMessage}
                            sx={{
                                color: "#fff",
                                bgcolor: "#304a91",
                                borderRadius: 1.5,
                                "&:hover": {
                                    bgcolor: "#3d5daf",
                                },
                            }}
                        >
                            <Send />
                        </IconButton>

                    </Box>

                </Paper>

            )}

        </Box>
    );
};


export default InterviewRoom;

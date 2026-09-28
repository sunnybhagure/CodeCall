
import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";

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
} from "@mui/material";

import RestoreIcon from "@mui/icons-material/Restore";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CodeIcon from "@mui/icons-material/Code";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {

    const navigate = useNavigate();

    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    // =========================
    // NORMAL VIDEO MEETING
    // =========================

    const handleJoinVideoCall = async () => {

        if (!meetingCode.trim()) {
            return;
        }

        await addToUserHistory(meetingCode);

        navigate(`/${meetingCode}`);
    };


    // =========================
    // INTERVIEW
    // =========================

    const handleTakeInterview = () => {

        // Candidate interview page
        navigate("/interview");
    };


    const handleCreateInterview = () => {

        // Interviewer create interview page
        navigate("/interview/create");
    };


    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                background: "#ffffff",
                color: "#111827",
            }}
        >

            {/* =====================================================
                NAVBAR
            ====================================================== */}

            <Box
                sx={{
                    height: "72px",
                    px: {
                        xs: 2,
                        sm: 3,
                        md: 5,
                    },

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    borderBottom: "1px solid #e5e7eb",

                    background: "#ffffff",
                }}
            >

                {/* Logo */}

                <Typography
                    sx={{
                        fontSize: {
                            xs: "20px",
                            sm: "23px",
                        },

                        fontWeight: 800,

                        color: "#111827",
                    }}
                >
                    Apna Video Call
                </Typography>


                {/* Right Navbar */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >

                    <IconButton
                        onClick={() => {
                            navigate("/history");
                        }}
                        sx={{
                            color: "#374151",

                            "&:hover": {
                                background: "#f3f4f6",
                            },
                        }}
                    >
                        <RestoreIcon />
                    </IconButton>

                    <Typography
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block",
                            },

                            mr: 1,

                            fontSize: "14px",

                            fontWeight: 600,

                            color: "#374151",
                        }}
                    >
                        History
                    </Typography>


                    <Button
                        onClick={() => {

                            localStorage.removeItem("token");

                            navigate("/auth");

                        }}
                        variant="outlined"
                        sx={{
                            textTransform: "none",

                            borderRadius: "9px",

                            fontWeight: 700,

                            borderColor: "#d1d5db",

                            color: "#374151",

                            "&:hover": {
                                borderColor: "#9ca3af",
                                background: "#f9fafb",
                            },
                        }}
                    >
                        Logout
                    </Button>

                </Box>

            </Box>


            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <Box
                sx={{
                    width: "100%",

                    maxWidth: "1200px",

                    mx: "auto",

                    px: {
                        xs: 2,
                        sm: 3,
                        md: 5,
                    },

                    py: {
                        xs: 4,
                        md: 6,
                    },
                }}
            >


                {/* =================================================
                    NORMAL VIDEO MEETING SECTION
                ================================================== */}

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1.1fr 0.9fr",
                        },

                        gap: {
                            xs: 4,
                            md: 7,
                        },

                        alignItems: "center",
                    }}
                >

                    {/* LEFT */}

                    <Box>

                        <Chip
                            icon={<VideoCameraFrontIcon />}
                            label="Video Meetings"
                            sx={{
                                mb: 2,

                                background: "#eef2ff",

                                color: "#4338ca",

                                fontWeight: 700,

                                "& .MuiChip-icon": {
                                    color: "#4338ca",
                                },
                            }}
                        />


                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "30px",
                                    sm: "38px",
                                    md: "44px",
                                },

                                lineHeight: 1.12,

                                fontWeight: 800,

                                color: "#111827",

                                mb: 2,
                            }}
                        >
                            Providing Quality
                            <br />
                            Video Calls
                        </Typography>


                        <Typography
                            sx={{
                                maxWidth: "550px",

                                color: "#6b7280",

                                fontSize: "15px",

                                lineHeight: 1.7,

                                mb: 3,
                            }}
                        >
                            Connect with your friends, teammates and
                            interviewers through high-quality video
                            meetings.
                        </Typography>


                        {/* Join Meeting */}

                        <Box
                            sx={{
                                display: "flex",

                                gap: 1.5,

                                width: "100%",

                                maxWidth: "520px",

                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                            }}
                        >

                            <TextField
                                fullWidth
                                size="small"
                                value={meetingCode}
                                onChange={(e) =>
                                    setMeetingCode(e.target.value)
                                }
                                label="Meeting Code"
                                placeholder="Enter meeting code"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "10px",
                                    },
                                }}
                            />

                            <Button
                                onClick={handleJoinVideoCall}
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    minWidth: {
                                        xs: "100%",
                                        sm: "120px",
                                    },

                                    borderRadius: "10px",

                                    textTransform: "none",

                                    fontWeight: 700,

                                    boxShadow: "none",

                                    background: "#111827",

                                    "&:hover": {
                                        background: "#1f2937",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Join
                            </Button>

                        </Box>

                    </Box>


                    {/* RIGHT */}

                    <Box
                        sx={{
                            display: "flex",

                            justifyContent: "center",

                            alignItems: "center",
                        }}
                    >

                        <Box
                            component="img"
                            src="/logo3.png"
                            alt="Video Meeting"
                            sx={{
                                width: "100%",

                                maxWidth: "420px",

                                height: "auto",

                                objectFit: "contain",
                            }}
                        />

                    </Box>

                </Box>


                {/* =================================================
                    DIVIDER
                ================================================== */}

                <Divider
                    sx={{
                        my: {
                            xs: 5,
                            md: 7,
                        },
                    }}
                />


                {/* =================================================
                    INTERVIEW FEATURE CARD
                ================================================== */}

                <Card
                    elevation={0}
                    sx={{
                        width: "100%",

                        borderRadius: "20px",

                        border: "1px solid #e5e7eb",

                        background:
                            "linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #f5f7ff 100%)",

                        overflow: "hidden",

                        position: "relative",
                    }}
                >

                    {/* Top decorative area */}

                    <Box
                        sx={{
                            height: "5px",

                            width: "100%",

                            background:
                                "linear-gradient(90deg, #4f46e5, #7c3aed, #2563eb)",
                        }}
                    />


                    <CardContent
                        sx={{
                            p: {
                                xs: 3,
                                sm: 4,
                                md: 5,
                            },
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",

                                flexDirection: {
                                    xs: "column",
                                    md: "row",
                                },

                                justifyContent: "space-between",

                                alignItems: {
                                    xs: "flex-start",
                                    md: "center",
                                },

                                gap: 4,
                            }}
                        >

                            {/* Interview Information */}

                            <Box
                                sx={{
                                    flex: 1,
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        mb: 2,
                                        flexWrap: "wrap",
                                    }}
                                >

                                    <Chip
                                        icon={<PersonSearchIcon />}
                                        label="Interview Platform"
                                        size="small"
                                        sx={{
                                            background: "#eef2ff",

                                            color: "#4338ca",

                                            fontWeight: 700,

                                            "& .MuiChip-icon": {
                                                color: "#4338ca",
                                            },
                                        }}
                                    />

                                    <Chip
                                        icon={<CodeIcon />}
                                        label="Live Coding"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 600,

                                            borderColor: "#d1d5db",

                                            color: "#4b5563",
                                        }}
                                    />

                                </Stack>


                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "26px",
                                            sm: "30px",
                                        },

                                        fontWeight: 800,

                                        color: "#111827",

                                        mb: 1,
                                    }}
                                >
                                    Technical Interview
                                </Typography>


                                <Typography
                                    sx={{
                                        maxWidth: "700px",

                                        color: "#6b7280",

                                        fontSize: "14px",

                                        lineHeight: 1.7,

                                        mb: 3,
                                    }}
                                >
                                    Conduct or attend technical interviews
                                    with live video, real-time coding,
                                    interview questions and collaborative
                                    coding environment.
                                </Typography>


                                {/* Features */}

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    spacing={{
                                        xs: 1,
                                        sm: 3,
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >

                                        <VideoCameraFrontIcon
                                            sx={{
                                                fontSize: 20,
                                                color: "#4f46e5",
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                color: "#374151",
                                            }}
                                        >
                                            Live Video
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >

                                        <CodeIcon
                                            sx={{
                                                fontSize: 20,
                                                color: "#7c3aed",
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                color: "#374151",
                                            }}
                                        >
                                            Live Coding
                                        </Typography>

                                    </Box>


                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >

                                        <PersonSearchIcon
                                            sx={{
                                                fontSize: 20,
                                                color: "#2563eb",
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                color: "#374151",
                                            }}
                                        >
                                            Interview Evaluation
                                        </Typography>

                                    </Box>

                                </Stack>

                            </Box>


                            {/* Buttons */}

                            <Box
                                sx={{
                                    minWidth: {
                                        xs: "100%",
                                        md: "230px",
                                    },

                                    display: "flex",

                                    flexDirection: "column",

                                    gap: 1.5,
                                }}
                            >

                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<PersonSearchIcon />}
                                    onClick={handleTakeInterview}
                                    sx={{
                                        width: "100%",

                                        minHeight: "50px",

                                        borderRadius: "11px",

                                        textTransform: "none",

                                        fontWeight: 800,

                                        background: "#4f46e5",

                                        boxShadow: "none",

                                        "&:hover": {
                                            background: "#4338ca",
                                            boxShadow: "none",
                                        },
                                    }}
                                >
                                    Take Interview
                                </Button>


                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<AddCircleOutlineOutlinedIcon />}
                                    onClick={handleCreateInterview}
                                    sx={{
                                        width: "100%",

                                        minHeight: "50px",

                                        borderRadius: "11px",

                                        textTransform: "none",

                                        fontWeight: 700,

                                        borderColor: "#c7d2fe",

                                        color: "#4338ca",

                                        "&:hover": {
                                            borderColor: "#818cf8",

                                            background: "#eef2ff",
                                        },
                                    }}
                                >
                                    Create Interview
                                </Button>

                            </Box>

                        </Box>

                    </CardContent>

                </Card>


                {/* Bottom text */}

                <Typography
                    sx={{
                        textAlign: "center",

                        mt: 3,

                        fontSize: "12px",

                        color: "#9ca3af",
                    }}
                >
                    One platform for video meetings and technical interviews.
                </Typography>

            </Box>

        </Box>
    );
}

export default withAuth(HomeComponent);



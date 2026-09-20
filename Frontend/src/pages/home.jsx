import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, TextField, Box, Typography } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {

    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                background:
                    "radial-gradient(circle at 15% 50%, rgba(99,102,241,0.14), transparent 35%), radial-gradient(circle at 85% 40%, rgba(59,130,246,0.10), transparent 35%), #080d18",
                color: "#fff",
                overflow: "hidden",
            }}
        >

            {/* ================= NAVBAR ================= */}

            <Box
                sx={{
                    height: { xs: 68, md: 76 },
                    px: { xs: 2, sm: 3, md: 5 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    background: "rgba(10,17,31,0.82)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",

                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                }}
            >

                {/* App Name */}

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 750,
                        fontSize: { xs: "18px", sm: "21px", md: "23px" },
                        letterSpacing: "-0.5px",
                        background:
                            "linear-gradient(90deg, #fff, #9db8ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    DEVMEET
                </Typography>


                {/* Right Navbar */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 0.5, sm: 1.5 },
                    }}
                >

                    <IconButton
                        onClick={() => {
                            navigate("/history");
                        }}
                        sx={{
                            width: 42,
                            height: 42,
                            color: "#b9c6df",

                            background:
                                "rgba(255,255,255,0.05)",

                            border:
                                "1px solid rgba(255,255,255,0.07)",

                            "&:hover": {
                                color: "#fff",
                                background:
                                    "rgba(99,102,241,0.18)",
                                transform: "translateY(-1px)",
                            },

                            transition: "all 0.25s ease",
                        }}
                    >
                        <RestoreIcon />
                    </IconButton>

                    <Typography
                        sx={{
                            mr: { xs: 0.5, sm: 1 },
                            color: "#aab5ca",
                            fontSize: "14px",
                            fontWeight: 500,
                            display: { xs: "none", sm: "block" },
                        }}
                    >
                        History
                    </Typography>


                    <Button
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/auth");
                        }}
                        sx={{
                            minWidth: { xs: 68, sm: 88 },
                            px: { xs: 1.5, sm: 2.2 },
                            py: 1,

                            borderRadius: "10px",

                            color: "#fff",

                            fontSize: { xs: "13px", sm: "14px" },
                            fontWeight: 600,

                            textTransform: "none",

                            background:
                                "rgba(255,255,255,0.06)",

                            border:
                                "1px solid rgba(255,255,255,0.10)",

                            "&:hover": {
                                background:
                                    "rgba(239,68,68,0.14)",
                                borderColor:
                                    "rgba(239,68,68,0.35)",
                                color: "#ffb4b4",
                            },

                            transition: "all 0.25s ease",
                        }}
                    >
                        Logout
                    </Button>

                </Box>
            </Box>


            {/* ================= MAIN SECTION ================= */}

            <Box
                sx={{
                    minHeight: "calc(100vh - 76px)",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    gap: { xs: 4, md: 8, lg: 12 },

                    px: { xs: 2, sm: 4, md: 7, lg: 10 },
                    py: { xs: 5, md: 6 },

                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                }}
            >

                {/* ================= LEFT PANEL ================= */}

                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            md: "52%",
                            lg: "48%",
                        },

                        maxWidth: "600px",

                        display: "flex",
                        alignItems: "center",
                    }}
                >

                    <Box sx={{ width: "100%" }}>

                        <Typography
                            component="h1"
                            sx={{
                                fontSize: {
                                    xs: "32px",
                                    sm: "40px",
                                    md: "48px",
                                    lg: "55px",
                                },

                                lineHeight: 1.12,

                                letterSpacing: {
                                    xs: "-1px",
                                    md: "-1.8px",
                                },

                                fontWeight: 750,

                                color: "#fff",

                                mb: { xs: 3, md: 4 },

                                maxWidth: "580px",
                            }}
                        >
                            Providing Quality Video Call Just Like Quality
                            Education
                        </Typography>


                        {/* Meeting Input + Join */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",

                                gap: 1.2,

                                p: 0.8,

                                width: {
                                    xs: "100%",
                                    sm: "fit-content",
                                },

                                maxWidth: "100%",

                                borderRadius: "14px",

                                background:
                                    "rgba(255,255,255,0.055)",

                                border:
                                    "1px solid rgba(255,255,255,0.09)",

                                boxShadow:
                                    "0 12px 35px rgba(0,0,0,0.25)",

                                backdropFilter: "blur(12px)",

                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                            }}
                        >

                            <TextField
                                onChange={(e) =>
                                    setMeetingCode(e.target.value)
                                }
                                id="outlined-basic"
                                label="Meeting Code"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    width: {
                                        xs: "100%",
                                        sm: 270,
                                    },

                                    "& .MuiOutlinedInput-root": {
                                        height: 52,
                                        borderRadius: "10px",
                                        color: "#fff",
                                        background:
                                            "rgba(7,12,23,0.75)",

                                        "& fieldset": {
                                            borderColor:
                                                "rgba(255,255,255,0.12)",
                                        },

                                        "&:hover fieldset": {
                                            borderColor:
                                                "rgba(129,140,248,0.5)",
                                        },

                                        "&.Mui-focused fieldset": {
                                            borderColor:
                                                "#6366f1",
                                        },
                                    },

                                    "& .MuiInputLabel-root": {
                                        color: "#8e9ab1",
                                    },

                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#8b9cff",
                                    },
                                }}
                            />

                            <Button
                                onClick={handleJoinVideoCall}
                                variant="contained"
                                sx={{
                                    height: 52,

                                    minWidth: {
                                        xs: "100%",
                                        sm: 95,
                                    },

                                    px: 2.5,

                                    borderRadius: "10px",

                                    textTransform: "none",

                                    fontSize: "15px",
                                    fontWeight: 650,

                                    background:
                                        "linear-gradient(135deg,#6366f1,#4f46e5)",

                                    boxShadow:
                                        "0 8px 22px rgba(79,70,229,0.28)",

                                    "&:hover": {
                                        background:
                                            "linear-gradient(135deg,#7477ff,#5b54ee)",

                                        boxShadow:
                                            "0 12px 28px rgba(79,70,229,0.40)",

                                        transform:
                                            "translateY(-2px)",
                                    },

                                    transition:
                                        "all 0.25s ease",
                                }}
                            >
                                Join
                            </Button>

                        </Box>

                    </Box>

                </Box>


                {/* ================= RIGHT PANEL ================= */}

                <Box
                    sx={{
                        width: {
                            xs: "80%",
                            sm: "65%",
                            md: "42%",
                            lg: "38%",
                        },

                        maxWidth: "470px",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        position: "relative",

                        "&::before": {
                            content: '""',

                            position: "absolute",

                            width: "280px",
                            height: "280px",

                            borderRadius: "50%",

                            background:
                                "rgba(99,102,241,0.16)",

                            filter: "blur(65px)",

                            zIndex: 0,
                        },
                    }}
                >

                    <Box
                        component="img"
                        src="/logo3.png"
                        alt="DEVMEET"
                        sx={{
                            width: "100%",
                            height: "auto",

                            objectFit: "contain",

                            position: "relative",
                            zIndex: 1,

                            borderRadius: "24px",

                            filter:
                                "drop-shadow(0 25px 45px rgba(0,0,0,0.45))",

                            transition:
                                "transform 0.4s ease",

                            "&:hover": {
                                transform:
                                    "translateY(-6px) scale(1.015)",
                            },
                        }}
                    />

                </Box>

            </Box>

        </Box>
    );
}

export default withAuth(HomeComponent);
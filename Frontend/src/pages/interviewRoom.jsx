import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import server from "../environment";

const InterviewRoom = () => {
    const { interviewId } = useParams();

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await axios.get(
                    `${server}api/v1/interview/${interviewId}`
                );

                const interviewData = response.data.interview;

                setInterview(interviewData);

                if (interviewData.currentQuestion) {
                    setCode(
                        interviewData.currentQuestion.starterCode || ""
                    );
                }
            } catch (err) {
                console.error("FETCH INTERVIEW ERROR:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load interview"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [interviewId]);

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#080d1a",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                Loading Interview...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#080d1a",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {error}
            </div>
        );
    }

    const question = interview?.currentQuestion;

    return (
        <div style={{
            height: "100vh",
            background: "#080d1a",
            color: "white",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
        }}>

            {/* Header */}
            <div style={{
                height: "60px",
                borderBottom: "1px solid #263044",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                flexShrink: 0
            }}>
                <div>
                    <strong style={{ fontSize: "20px" }}>
                        DEVMEET
                    </strong>

                    <span style={{
                        marginLeft: "15px",
                        color: "#8b96aa",
                        fontSize: "14px"
                    }}>
                        Interview Room
                    </span>
                </div>

                <div style={{
                    fontSize: "14px",
                    color: "#4ade80"
                }}>
                    ● LIVE
                </div>
            </div>


            {/* Main Area */}
            <div style={{
                flex: 1,
                display: "flex",
                minHeight: 0
            }}>

                {/* Left Side - Meeting */}
                <div style={{
                    width: "40%",
                    borderRight: "1px solid #263044",
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div style={{
                        width: "100%",
                        height: "100%",
                        border: "1px solid #263044",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8b96aa"
                    }}>
                        Video Meeting

                        <br />

                        <span style={{
                            marginLeft: "5px"
                        }}>
                            (Existing WebRTC UI will be integrated here)
                        </span>
                    </div>
                </div>


                {/* Right Side */}
                <div style={{
                    width: "60%",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0
                }}>

                    {/* Question */}
                    <div style={{
                        height: "35%",
                        minHeight: "200px",
                        overflowY: "auto",
                        padding: "20px",
                        borderBottom: "1px solid #263044"
                    }}>

                        {question ? (
                            <>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <h2 style={{
                                        margin: 0,
                                        fontSize: "22px"
                                    }}>
                                        {question.title}
                                    </h2>

                                    <span style={{
                                        background: "#263044",
                                        padding: "5px 10px",
                                        borderRadius: "6px",
                                        fontSize: "12px"
                                    }}>
                                        {question.difficulty}
                                    </span>
                                </div>

                                <p style={{
                                    color: "#b4bdcc",
                                    lineHeight: "1.6"
                                }}>
                                    {question.description}
                                </p>

                                <div style={{
                                    color: "#8b96aa",
                                    fontSize: "13px"
                                }}>
                                    Category: {question.category}
                                </div>

                                {question.constraints?.length > 0 && (
                                    <div style={{ marginTop: "15px" }}>
                                        <strong>Constraints</strong>

                                        <ul style={{
                                            color: "#b4bdcc"
                                        }}>
                                            {question.constraints.map(
                                                (constraint, index) => (
                                                    <li key={index}>
                                                        {constraint}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{
                                color: "#8b96aa"
                            }}>
                                No question assigned yet.
                            </div>
                        )}
                    </div>


                    {/* Editor */}
                    <div style={{
                        flex: 1,
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column"
                    }}>

                        {/* Editor Header */}
                        <div style={{
                            height: "45px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 15px",
                            borderBottom: "1px solid #263044",
                            flexShrink: 0
                        }}>
                            <strong>Code</strong>

                            <select
                                value={language}
                                onChange={(e) =>
                                    setLanguage(e.target.value)
                                }
                                style={{
                                    background: "#151c2c",
                                    color: "white",
                                    border: "1px solid #344056",
                                    borderRadius: "5px",
                                    padding: "5px 10px"
                                }}
                            >
                                <option value="javascript">
                                    JavaScript
                                </option>
                            </select>
                        </div>


                        {/* Monaco */}
                        <div style={{
                            flex: 1,
                            minHeight: 0
                        }}>
                            <Editor
                                height="100%"
                                language={language}
                                theme="vs-dark"
                                value={code}
                                onChange={(value) =>
                                    setCode(value || "")
                                }
                                options={{
                                    fontSize: 14,
                                    minimap: {
                                        enabled: false
                                    },
                                    automaticLayout: true,
                                    padding: {
                                        top: 10
                                    }
                                }}
                            />
                        </div>


                        {/* Run Button */}
                        <div style={{
                            height: "55px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            padding: "0 15px",
                            borderTop: "1px solid #263044",
                            flexShrink: 0
                        }}>
                            <button
                                onClick={() => {
                                    console.log("Code:", code);
                                }}
                                style={{
                                    background: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    padding: "9px 20px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "600"
                                }}
                            >
                                Run Code
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewRoom;
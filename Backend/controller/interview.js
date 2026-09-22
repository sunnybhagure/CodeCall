import httpStatus from "http-status";
import crypto from "crypto";
import { Interview } from "../models/interview.js";
import { User } from "../models/user.js";
import { Question } from "../models/questions.js";


// Generate unique room ID
const generateRoomId = () => {
    return `DEV-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};


// Create Interview
const createInterview = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Authentication token is required",
            });
        }

        // Find interviewer using existing token
        const interviewer = await User.findOne({ token });

        if (!interviewer) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid authentication token",
            });
        }

        // Generate unique room ID
        let roomId;
        let existingInterview;

        do {
            roomId = generateRoomId();

            existingInterview = await Interview.findOne({
                roomId,
            });
        } while (existingInterview);

        // Create interview
        const interview = new Interview({
            interviewer: interviewer._id,
            roomId,
            status: "scheduled",
        });

        await interview.save();

        return res.status(httpStatus.CREATED).json({
            message: "Interview created successfully",

            interview: {
                id: interview._id,
                roomId: interview.roomId,
                status: interview.status,
                interviewer: interviewer.username,
            },
        });

    } catch (error) {
        console.error("CREATE INTERVIEW ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


// Get Interview Details
const getInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;

        const interview = await Interview.findById(interviewId)
            .populate("interviewer", "username name email")
            .populate("candidate", "username name email")
            .populate("currentQuestion");

        if (!interview) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Interview not found",
            });
        }

        return res.status(httpStatus.OK).json({
            interview,
        });

    } catch (error) {
        console.error("GET INTERVIEW ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


// Candidate Join Interview
const joinInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { token } = req.body;

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Authentication token is required",
            });
        }

        // Find candidate
        const candidate = await User.findOne({ token });

        if (!candidate) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid authentication token",
            });
        }

        // Find interview
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Interview not found",
            });
        }

        // Prevent interviewer from joining as candidate
        if (interview.interviewer.toString() === candidate._id.toString()) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Interviewer cannot join as candidate",
            });
        }

        // Interview already completed
        if (interview.status === "completed") {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "This interview has already been completed",
            });
        }

        // Interview already has another candidate
        if (
            interview.candidate &&
            interview.candidate.toString() !== candidate._id.toString()
        ) {
            return res.status(httpStatus.CONFLICT).json({
                message: "Another candidate has already joined this interview",
            });
        }

        // Add candidate
        interview.candidate = candidate._id;

        await interview.save();

        return res.status(httpStatus.OK).json({
            message: "Joined interview successfully",

            interview: {
                id: interview._id,
                roomId: interview.roomId,
                status: interview.status,
                candidate: candidate.username,
            },
        });

    } catch (error) {
        console.error("JOIN INTERVIEW ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


// Start Interview
const startInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { token } = req.body;

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Authentication token is required",
            });
        }

        // Find interviewer
        const interviewer = await User.findOne({ token });

        if (!interviewer) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid authentication token",
            });
        }

        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Interview not found",
            });
        }

        // Only interviewer can start
        if (
            interview.interviewer.toString() !== interviewer._id.toString()
        ) {
            return res.status(httpStatus.FORBIDDEN).json({
                message: "Only interviewer can start the interview",
            });
        }

        if (interview.status === "completed") {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Interview is already completed",
            });
        }

        if (interview.status === "live") {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Interview is already live",
            });
        }

        // Start interview
        interview.status = "live";
        interview.startedAt = new Date();

        await interview.save();

        return res.status(httpStatus.OK).json({
            message: "Interview started successfully",

            interview: {
                id: interview._id,
                roomId: interview.roomId,
                status: interview.status,
                startedAt: interview.startedAt,
            },
        });

    } catch (error) {
        console.error("START INTERVIEW ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


// End Interview
const endInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { token } = req.body;

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Authentication token is required",
            });
        }

        // Find interviewer
        const interviewer = await User.findOne({ token });

        if (!interviewer) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid authentication token",
            });
        }

        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Interview not found",
            });
        }

        // Only interviewer can end
        if (
            interview.interviewer.toString() !== interviewer._id.toString()
        ) {
            return res.status(httpStatus.FORBIDDEN).json({
                message: "Only interviewer can end the interview",
            });
        }

        if (interview.status === "completed") {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Interview is already completed",
            });
        }

        // End interview
        interview.status = "completed";
        interview.endedAt = new Date();

        await interview.save();

        return res.status(httpStatus.OK).json({
            message: "Interview ended successfully",

            interview: {
                id: interview._id,
                roomId: interview.roomId,
                status: interview.status,
                startedAt: interview.startedAt,
                endedAt: interview.endedAt,
            },
        });

    } catch (error) {
        console.error("END INTERVIEW ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


// Assign Question to Interview
const assignQuestion = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { token, questionId } = req.body;

        if (!token || !questionId) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Token and questionId are required",
            });
        }

        // Find interviewer
        const interviewer = await User.findOne({ token });

        if (!interviewer) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid authentication token",
            });
        }

        // Find interview
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Interview not found",
            });
        }

        // Check interviewer
        if (
            interview.interviewer.toString() !== interviewer._id.toString()
        ) {
            return res.status(httpStatus.FORBIDDEN).json({
                message: "Only interviewer can assign a question",
            });
        }

        // Find question
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Question not found",
            });
        }

        if (!question.isActive) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "This question is not active",
            });
        }

        // Assign question
        interview.currentQuestion = question._id;

        await interview.save();

        return res.status(httpStatus.OK).json({
            message: "Question assigned successfully",

            question: {
                id: question._id,
                title: question.title,
                difficulty: question.difficulty,
                category: question.category,
            },
        });

    } catch (error) {
        console.error("ASSIGN QUESTION ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


export {
    createInterview,
    getInterview,
    joinInterview,
    startInterview,
    endInterview,
    assignQuestion,
};
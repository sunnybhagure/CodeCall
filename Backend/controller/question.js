import httpStatus from "http-status";
import { Question } from "../models/questions.js";
import { User } from "../models/user.js";

// Create Question
const createQuestion = async (req, res) => {
    try {
        const {
            token,
            title,
            description,
            difficulty,
            category,
            starterCode,
            testCases,
            constraints,
            examples,
            supportedLanguages,
        } = req.body;

        // Check token
        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Authentication token is required",
            });
        }

        // Check user
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid authentication token",
            });
        }

        // Required fields
        if (!title || !description || !category) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Title, description and category are required",
            });
        }

        const question = new Question({
            title,
            description,
            difficulty: difficulty || "Easy",
            category,
            starterCode: starterCode || "",
            testCases: testCases || [],
            constraints: constraints || [],
            examples: examples || [],
            supportedLanguages: supportedLanguages || ["javascript"],
            isActive: true,
        });

        await question.save();

        return res.status(httpStatus.CREATED).json({
            message: "Question created successfully",
            question,
        });
    } catch (error) {
        console.error("CREATE QUESTION ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


// Get All Questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find({
            isActive: true,
        }).sort({ createdAt: -1 });

        return res.status(httpStatus.OK).json({
            count: questions.length,
            questions,
        });
    } catch (error) {
        console.error("GET ALL QUESTIONS ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


// Get Single Question
const getQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Question not found",
            });
        }

        return res.status(httpStatus.OK).json({
            question,
        });
    } catch (error) {
        console.error("GET QUESTION ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


// Update Question
const updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { token, ...updateData } = req.body;

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Authentication token is required",
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid authentication token",
            });
        }

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Question not found",
            });
        }

        Object.keys(updateData).forEach((key) => {
            if (updateData[key] !== undefined) {
                question[key] = updateData[key];
            }
        });

        await question.save();

        return res.status(httpStatus.OK).json({
            message: "Question updated successfully",
            question,
        });
    } catch (error) {
        console.error("UPDATE QUESTION ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


// Delete / Deactivate Question
const deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { token } = req.body;

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Authentication token is required",
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid authentication token",
            });
        }

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Question not found",
            });
        }

        // Instead of permanently deleting from database
        question.isActive = false;

        await question.save();

        return res.status(httpStatus.OK).json({
            message: "Question deleted successfully",
        });
    } catch (error) {
        console.error("DELETE QUESTION ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};


export {
    createQuestion,
    getAllQuestions,
    getQuestion,
    updateQuestion,
    deleteQuestion,
};
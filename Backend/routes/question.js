import express from "express";

import {
    createQuestion,
    getAllQuestions,
    getQuestion,
    updateQuestion,
    deleteQuestion,
} from "../controller/question.js";

const router = express.Router();


// Create Question
router.post("/create", createQuestion);


// Get All Questions
router.get("/", getAllQuestions);


// Get Single Question
router.get("/:questionId", getQuestion);


// Update Question
router.put("/:questionId", updateQuestion);


// Delete / Deactivate Question
router.delete("/:questionId", deleteQuestion);


export default router;
import express from "express";

import {
    createInterview,
    getInterview,
    joinInterview,
    startInterview,
    endInterview,
    assignQuestion,
} from "../controller/interview.js";

const router = express.Router();


// Create a new interview
router.post("/create", createInterview);


// Get interview details
router.get("/:interviewId", getInterview);


// Candidate joins interview
router.post("/:interviewId/join", joinInterview);


// Interviewer starts interview
router.post("/:interviewId/start", startInterview);


// Interviewer ends interview
router.post("/:interviewId/end", endInterview);


// Interviewer assigns coding question
router.post("/:interviewId/question", assignQuestion);


export default router;
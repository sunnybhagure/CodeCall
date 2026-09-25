import httpStatus from "http-status";
import { Question } from "../models/questions.js";
import { User } from "../models/user.js";
import vm from "vm";


// =====================================================
// CREATE QUESTION
// =====================================================

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


// =====================================================
// GET ALL QUESTIONS
// =====================================================

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


// =====================================================
// GET SINGLE QUESTION
// =====================================================

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


// =====================================================
// UPDATE QUESTION
// =====================================================

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


// =====================================================
// DELETE QUESTION
// =====================================================

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


// =====================================================
// RUN CODE
// =====================================================

const runCode = async (req, res) => {
    try {

        const { questionId } = req.params;
        const { code } = req.body;

        // -----------------------------
        // Check code
        // -----------------------------

        if (!code || !code.trim()) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Code is required",
            });
        }


        // -----------------------------
        // Find question
        // -----------------------------

        const question = await Question.findOne({
            _id: questionId,
            isActive: true,
        });

        if (!question) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Question not found or inactive",
            });
        }


        // -----------------------------
        // Only JavaScript for now
        // -----------------------------

        if (
            !question.supportedLanguages ||
            !question.supportedLanguages.includes("javascript")
        ) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "JavaScript is not supported for this question",
            });
        }


        // -----------------------------
        // Extract function name
        // -----------------------------

        const functionMatch = code.match(
            /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/
        );

        if (!functionMatch) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Could not detect function name",
            });
        }

        const functionName = functionMatch[1];


        // -----------------------------
        // Create isolated context
        // -----------------------------

        const context = {};

        vm.createContext(context);


        // -----------------------------
        // Execute submitted code
        // -----------------------------

        try {

            vm.runInNewContext(code, context, {
                timeout: 2000,
            });

        } catch (error) {

            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Code execution failed",
                error: error.message,
            });

        }


        // -----------------------------
        // Check function exists
        // -----------------------------

        if (typeof context[functionName] !== "function") {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Function was not created correctly",
            });
        }


        // -----------------------------
        // Run test cases
        // -----------------------------

        const results = [];

        for (let i = 0; i < question.testCases.length; i++) {

            const testCase = question.testCases[i];

            try {

                /*
                 * Current test-case format:
                 *
                 * input:
                 * "[2,7,11,15], 9"
                 *
                 * expectedOutput:
                 * "[0,1]"
                 */

                const inputArguments = vm.runInNewContext(
                    `[${testCase.input}]`,
                    {},
                    {
                        timeout: 1000,
                    }
                );


                const expectedOutput = vm.runInNewContext(
                    testCase.expectedOutput,
                    {},
                    {
                        timeout: 1000,
                    }
                );


                const actualOutput = context[functionName](
                    ...inputArguments
                );


                const passed =
                    JSON.stringify(actualOutput) ===
                    JSON.stringify(expectedOutput);


                results.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expectedOutput,
                    actualOutput,
                    passed,
                });

            } catch (error) {

                results.push({
                    testCase: i + 1,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: null,
                    passed: false,
                    error: error.message,
                });

            }
        }


        // -----------------------------
        // Calculate result
        // -----------------------------

        const passedTests = results.filter(
            (test) => test.passed
        ).length;

        const totalTests = results.length;

        const allPassed =
            totalTests > 0 &&
            passedTests === totalTests;


        // -----------------------------
        // Response
        // -----------------------------

        return res.status(httpStatus.OK).json({
            message: allPassed
                ? "All test cases passed"
                : "Some test cases failed",

            question: {
                id: question._id,
                title: question.title,
            },

            result: {
                passed: passedTests,
                total: totalTests,
                allPassed,
            },

            testResults: results,
        });

    } catch (error) {

        console.error("RUN CODE ERROR:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong while running code",
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
    runCode,
};
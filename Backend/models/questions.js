import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy",
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        starterCode: {
            type: String,
            default: "",
        },

        testCases: [
            {
                input: {
                    type: String,
                    required: true,
                },

                expectedOutput: {
                    type: String,
                    required: true,
                },
            },
        ],

        constraints: {
            type: [String],
            default: [],
        },

        examples: [
            {
                input: {
                    type: String,
                },

                output: {
                    type: String,
                },

                explanation: {
                    type: String,
                },
            },
        ],

        supportedLanguages: {
            type: [String],
            default: ["javascript"],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model("Question", questionSchema);

export { Question };
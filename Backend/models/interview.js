import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        interviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        roomId: {
            type: String,
            required: true,
            unique: true,
        },

        status: {
            type: String,
            enum: ["scheduled", "live", "completed"],
            default: "scheduled",
        },

        currentQuestion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            default: null,
        },

        startedAt: {
            type: Date,
            default: null,
        },

        endedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Interview = mongoose.model("Interview", interviewSchema);

export { Interview };
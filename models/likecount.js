const mongoose = require("mongoose");
const { Schema } = mongoose;

const likeCountSchema = new Schema({
    likeCounts: {
        type: Number,
        ref: "Post"
    }
}, {
    timestamps: true
});



const LikeCount = mongoose.model("LikeCount", likeCountSchema);

module.exports = LikeCount;
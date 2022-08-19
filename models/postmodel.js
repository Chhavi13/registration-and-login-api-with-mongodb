const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
    content: {
        type: String,

    },
    title: {
        type: String,

    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: [String]
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        unique: true,
        ref: "User"
    }],
    LikeCounts:{
        type:Number,
        default:0
    },
    comments: [{
        text: String,
        created: {
            type: Date,
            default: Date.now
        },
        postedBy: {
            type: mongoose.Schema.ObjectId,
            ref: "User"

        }
    }],

}, {
    timestamps: true
});



const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
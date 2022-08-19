const Post = require('../models/postmodel')
const auth = require('../middleware/auth');
const User = require('../models/usermodel');
const req = require('express/lib/request');

exports.createPost = async (req, res) => {
    console.log("+++", req?.files[0])
    const image = (req?.files[0]) ? (req?.files[0].filename) : (null)
    console.log("image", image)
    const { content, title, } = req.body
    // console.log("content", req.body)
    // if (!content || !title || !image) {
    //     return res.status(400).json("plz fill all the fields")
    // } else {
    try {
        console.log("reuser", req.user)
        const postedby = req.user.data.user_id
        const user = await User.findById(postedby)
        // console.log("0000000", user.name)
        const post = new Post(
            {
                title,
                content,
                postedBy: postedby,
                image: `http://localhost:5000/image/${image}`,


            }
        )
        console.log(post)
        const result = await post.save()
        res.status(200).json(result)

    } catch (e) {
        console.log(e)
        return res.status(400).json("error plz try again")
    }
    // }

}
exports.getAllPosts = async (req, res) => {
    // console.log("req post",req.user)
    //    const postedby=req.user.data.user_id
    // res.send(req.user.data.user_id)


    let Data = await Post.find().populate({ path: 'postedBy', model: User })
        .populate({ path: 'comments.postedBy', model: User })
    let newData = Data.map((res) => {
        // if (res.likes.includes(req.user.data.user_id)) {
        //     res.isLike = true
        //     return res;

        // }
        // console.log(res.title)
        // res.title = "ishtiyaq khan"
        // res['isLike'] = true
        // return res;
        if (res.likes.includes(req.user.data.user_id)) {
            return { ...res._doc, ['isLike']: true }
        } else {
            return { ...res._doc, ['isLike']: false }
        }

    })
    res.send(newData)
    // return;


    // Post.find().populate({ path: 'postedBy', model: User })
    //     .populate({ path: 'comments.postedBy', model: User })
    //     .exec((err, result) => {
    //         if (err) {
    //             return res.status(500).json(err);
    //         }
    //         // console.log("totalPost",result)
    //         res.status(200).json(result);
    //     })

    // const response = await Post.aggregate([
    //     {
    //         $project: {
    //             title: 1,
    //             content: 1,
    //             postedBy: 1,
    //             likeCount: {
    //                 $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: "NA" }
    //             },
    //             postedById: {
    //                 $toObjectId: "$postedBy"
    //             },
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from: 'users',
    //             localField: "postedById",
    //             foreignField:"_id",
    //             as:"userDetails"
    //         }
    //     }
    // ])
    // res.send(response)
}

exports.likes = async (req, res) => {
    try {
        let count = await Post.findById(req.body.postid)
        console.log("count++++", count)
        // debugger
        if (count.likes.includes(req.user.data.user_id)) {
            return res.status(200).json({
                status: 200,
                success: true,
                message: " like Already Exist",
            });
        } else {
            Post.findByIdAndUpdate(req.body.postid,
                // { LikeCounts: count.LikeCounts + 1 },
                {
                    $push: { likes: req.user.data.user_id },
                    $set: { LikeCounts: count.LikeCounts + 1 }
                },
                { new: true }
            ).populate({ path: 'postedBy', model: User })
                .populate({ path: 'comments.postedBy', model: User })
                .exec().then(result => {
                    console.log("++++++", result)
                    res.status(200).json({
                        message: " Successfully liked ",
                        result
                    });
                }).catch(err => {
                    res.status(400).json(err);
                });
        }
    } catch (error) {
        return res.status(400).send({
            error,
            status: 400,
            success: false,
            message: "Failed To update likes",
        });
    }


}


exports.unlikes = async (req, res, next) => {
    try {
        let count = await Post.findById(req.body.postid)
        console.log("count----", count)
        if (count.likes.includes(req.user.data.user_id)) {
            Post.findByIdAndUpdate(req.body.postid,
                {
                    $pull: { likes: req.user.data.user_id },
                    $set: { LikeCounts: count.LikeCounts - 1 }
                },
                { new: true }
            ).populate({ path: 'postedBy', model: User })
                .populate({ path: 'comments.postedBy', model: User })
                .exec().then(result => {
                    console.log("------", result)
                    res.status(200).json({
                        message: " Successfully unliked ",
                        result
                    });
                }).catch(err => {
                    res.status(400).json(err);
                });
 
           
        } else {
            return res.status(200).json({
                status: 200,
                success: true,
                message: "Already unliked",
            });
        }
    } catch (error) {
        return res.status(400).send({
            error,
            status: 400,
            success: false,
            message: "Failed To update unlikes",
        });
    }


}
exports.comment = (req, res) => {
    if (req.body.text) {
        const comment = {
            text: req.body.text,
            postedBy: req.user.data.user_id
        }
        Post.findByIdAndUpdate(req.body.postid, {
            $push: { comments: comment }
        }, {
            new: true
        }).populate({ path: 'comments.postedBy', model: User })
            .populate({ path: 'postedBy', model: User })
            .exec().then(result => {
                // console.log(result)
                res.status(200).json(result);
            }).catch(err => {
                res.status(500).json(err);
            });
    } else {
        return res.status(400).json({
            error: "dont make empty comment",
        });
    }

}

exports.deletePost = (req, res) => {
    try {

        Post.findOne({ _id: req.params.postId })
            .populate({ path: "postedBy", model: User })
            .exec((err, post) => {
                if (err || !post) {
                    return res.status(422).json({ error: err })
                }
                if (post || postedBy._id.toString() === req.user.data.user_id.toString()) {
                    post.remove()
                        .then(result => {
                            return res.json({
                                result,
                                message: "post deleted successfully"
                            })
                        }).catch(err => {
                            console.log(err)
                        })
                }
            })

    } catch (e) {
        console.log("error", e)
    }
}
exports.editPost = async (req, res) => {
    try {
        const postid = req.params.postId
        const postData = await Post.findById(postid)
        console.log(postData)
        res.json(postData)

    }
    catch (error) {
        console.log(error)
    }
}
exports.updatePost = async (req, res) => {
    try {
        const postid = req.params.postId
        console.log("+++", req.files[0])
        // const image = (req.files[0]) ? (req.files[0].filename) : (oldpost.image)
        // console.log("image", image)

        // const add = `http://localhost:4000/image/${image}`
        const { content, title } = req.body


        if (req.files[0]) {
            const image = req.files[0].filename
            const add = `http://localhost:5000/image/${image}`
            const postData = await Post.findByIdAndUpdate(postid,
                {
                    $set: {
                        "title": title,
                        "content": content,
                        "image": add

                    }
                },
                {
                    new: true
                })
            res.status(201).json(postData)


        } else {
            const postData = await Post.findByIdAndUpdate(postid,
                {
                    $set: {
                        "title": title,
                        "content": content

                    }
                },
                {
                    new: true
                })
            res.status(201).json(postData)

        }
    }
    catch (error) {
        console.log(error)
    }
}
// exports.likesCount = (req, res) => {
//     console.log("postid from like count", req.body.postid)
//     Post.find(req.body.postid,).countDocuments()
//         .exec().then(result => {
//           console.log("result",result)
//             res.status(200).json(result);
//         }).catch(err => {
//             res.status(500).json(err);
//         });
// }



 //agr hmko pta krna h ke jis user ne post kia h vo login h ya nhi to item.posted.id se post check krege and state.id se login h ya nhi ye check krgee
//  exports.likes = async (req, res, next) => {
//     let count = await Post.findById(req.body.postid,)
//     console.log("count", count.likes)
//     console.log("count", count.likes.length+1)
//     // console.log("req postid", req.body.postid)
//     Post.findByIdAndUpdate(req.body.postid, {
//         $push: { likes: req.user.data.user_id }
//     }, {
//         new: true
//     }).populate({ path: 'postedBy', model: User })
//         .populate({ path: 'comments.postedBy', model: User })
//         .exec().then(result => {
//             // console.log(count)
//             res.status(200).json(result);
//         }).catch(err => {
//             res.status(500).json(err);
//         });
// }











//sumit sir ne bataya tha
 //     Post.updateMany(
            //         req.body.postid,
            //         { $inc: { LikeCounts: 1 } }, {
            //         $push: { likes: req.user.data.user_id }
            //     },
            //         function (err, result) {
            //             // console.log("}}", err)
            //             if (err) {
            //                return res.status(400).json({
            //                     error: err,
            //                 });
            //             }
            //             else {
            //                 console.log("++", result)
            //               return  res.status(200).json({
            //                     message: " like ",
            //                     result
            //                 });
            //             }


            //         }
            //     )
            
            
            
            // return
            // Post.findByIdAndUpdate(req.body.postid, (
            //     { $inc: { LikeCounts: -1 } }
            //     , {
            //         $pull: { likes: req.user.data.user_id }
            //     }
            // ),
            //     {
            //         new: true
            //     }
            // ).populate({ path: 'postedBy', model: User })
            //     .populate({ path: 'comments.postedBy', model: User })
            //     .exec().then(result => {
            //         // console.log(count)
            //         res.status(200).json({
            //             message: " unlike ",
            //             result
            //         });
            //     }).catch(err => {
            //         res.status(500).json(err);
            //     });
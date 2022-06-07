const Post = require('../models/postmodel')
const auth = require('../middleware/auth');
const User = require('../models/usermodel');

exports.createPost = async (req, res) => {
     console.log("+++",req.files[0])
    const image =(req.files[0]) ?(req.files[0].filename):(null)
    console.log("image", image)
    const { content, title, } = req.body
    // console.log("content", req.body)
    if (!content || !title ||!image) {
        return res.status(400).json("plz fill all the fields")
    } else {
        try {
            console.log("reuser", req.user)
            const postedby=req.user.data.user_id
            const user= await User.findById(postedby)
            console.log("0000000",user.name)
            const post = new Post(
                {
                    title,
                    content,
                    postedBy: user.name,
                    image:`http://localhost:4000/image/${image}`
                }
            )
            console.log(post)
            const result = await post.save()
            res.status(200).json(result)

        } catch (e) {
            console.log(e)
            return res.status(400).json("error plz try again")
        }
    }

}
exports.getAllPosts = async(req,res,next)=>{
   // console.log("req post",req.user)
    
    Post.find({}).exec().then(result=>{
      res.status(200).json(result);
    }).catch(err=>{
      res.status(500).json(err);
    });
}

exports.likes = (req,res,next)=>{
    // console.log("req post",req.user)
     
     Post.findByIdAndUpdate(req.body.postid,{
         $push:{likes:req.user.data.user_id}
     },{
         new:true
     }).exec().then(result=>{
        res.status(200).json(result);
      }).catch(err=>{
        res.status(500).json(err);
      });
 }
 
 exports.unlikes = async(req,res,next)=>{
     console.log("req.body.postid",req.body.postid)
        console.log("req user",req.user)
     
     
    Post.findByIdAndUpdate(req.body.postid,{
        $pull:{likes:req.user.data.user_id}
    },{
        new:true
    }).exec().then(result=>{
       res.status(200).json(result);
     }).catch(err=>{
       res.status(500).json(err);
     });
 }
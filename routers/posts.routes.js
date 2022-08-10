const postController = require('../controller/postcontroller');
const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth');
let multer = require('multer');




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {

      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  const upload = multer({ storage: storage }) 
  
router.post('/createpost',upload.array('image'),postController.createPost)
router.get('/getallposts',postController.getAllPosts);
router.put('/likes',postController.likes);
router.put('/unlikes',postController.unlikes);
router.put('/comments',postController.comment);
router.delete('/deletepost/:postId',postController.deletePost);
router.get('/editpost/:postId',postController.editPost);
router.put('/updatepost/:postId',upload.array('image'),postController.updatePost);
// router.post('/likescount',postController.likesCount);
module.exports = router;

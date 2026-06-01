// Dependencies and Modules
const express = require("express");
const postController = require("../controllers/post");
const auth = require("../auth");
const router = express.Router();
const { verify , verifyAdmin } = auth;


// Retrieve all active post
router.get("/", postController.getAllActive);

// Retrive Single Post
router.get("/:id", postController.getSinglePost);

// Create Post(User only + Admin) 
router.post("/addPost", verify, postController.addPost);

// Update Post (User only + Author of the post can update their post + Admin can update any post)
router.patch("/updatePost/:id", verify, postController.updatePost);

// Delete Post (Admin only + User can only delete their own post)
router.delete("/deletePost/:id", verify, postController.deletePost);

// Add Comment to Post (User only)
router.post("/addComment/:id", verify, postController.addComment);

// Update Comment on Post (User only + Author of the post can update any comment on their post)
router.patch("/updateComment/:postId/:commentId", verify, postController.updateComment);

// Delete Comment from Post (Admin only + User can only delete their own comment + Author of the post can delete any comment on their post)
router.delete("/deleteComment/:postId/:commentId", verify, postController.deleteComment);

module.exports = router;



const express = require("express");
const postController = require("../controllers/post");
const auth = require("../auth");

const router = express.Router();
const { verify, verifyAdmin } = auth;


// IMPORTANT: STATIC ROUTES FIRST


// Retrieve all active posts
router.get("/", postController.getAllActive);

// My Posts (MUST BE BEFORE /:id)
router.get("/my-posts", verify, postController.getMyPosts);

// Create Post
router.post("/addPost", verify, postController.addPost);

// Add Comment
router.post("/addComment/:id", verify, postController.addComment);

// Like / Unlike
router.post("/like/:id", verify, postController.likePost);
router.post("/unlike/:id", verify, postController.unlikePost);

// Update Comment
router.patch("/updateComment/:postId/:commentId", verify, postController.updateComment);


// DYNAMIC ROUTES LAST


// Single Post (KEEP LAST)
router.get("/:id", postController.getSinglePost);

// Update Post
router.patch("/updatePost/:id", verify, postController.updatePost);

// Delete Post
router.delete("/deletePost/:id", verify, postController.deletePost);

module.exports = router;
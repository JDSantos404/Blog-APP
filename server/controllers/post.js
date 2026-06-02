const Post = require("../models/Post");
const auth = require("../auth");
const { errorHandler } = require("../auth");



// GET ALL ACTIVE POSTS
module.exports.getAllActive = (req, res) => {

    return Post.find({ isActive: true }) 
        .populate("userId", "firstName lastName email")
        .populate("likes", "firstName lastName")
        .populate({
            path: "comments.userId",
            select: "firstName lastName email"
        })
        .sort({ createdAt: -1 })
        .then(posts => res.status(200).send(posts))
        .catch(error => errorHandler(error, req, res));
};



// GET SINGLE POST
module.exports.getSinglePost = (req, res) => {

    return Post.findById(req.params.id)
        .populate("userId", "firstName lastName email")
        .populate("likes", "firstName lastName")
        .populate({
            path: "comments.userId",
            select: "firstName lastName email"
        })
        .then(post => {

            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            return res.status(200).send(post);
        })
        .catch(error => errorHandler(error, req, res));
};


 
// CREATE POST (AUTHENTICATED USER ONLY)
module.exports.addPost = (req, res) => {

    const newPost = new Post({
        userId: req.user.id,
        title: req.body.title,
        content: req.body.content,
        isActive: true,
        comments: [],
        likes: []
    });

    return newPost.save()
        .then(post => {
            return Post.findById(post._id)
                .populate("userId", "firstName lastName email")
                .populate("likes", "firstName lastName")
                .populate({
                    path: "comments.userId",
                    select: "firstName lastName email"
                })
                .then(populatedPost => {
                    return res.status(201).send({
                        message: "Post created successfully",
                        post: populatedPost
                    });
                });
        })
        .catch(error => errorHandler(error, req, res));
};


 
// UPDATE POST (AUTHOR ONLY)
module.exports.updatePost = (req, res) => {

    return Post.findById(req.params.id)
        .then(post => {

            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            if (post.userId.toString() !== req.user.id) {
                return res.status(403).send({ error: "Unauthorized" });
            }

            post.title = req.body.title || post.title;
            post.content = req.body.content || post.content;

            return post.save();
        })
        .then(updated => {
            return res.status(200).send({
                message: "Post updated successfully",
                post: updated
            });
        })
        .catch(error => errorHandler(error, req, res));
};


 
// DELETE POST (ADMIN OR AUTHOR)
module.exports.deletePost = (req, res) => {

    return Post.findById(req.params.id)
        .then(post => {

            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            const isAuthor = post.userId.toString() === req.user.id;
            const isAdmin = req.user.isAdmin;

            if (!isAuthor && !isAdmin) {
                return res.status(403).send({ error: "Unauthorized" });
            }

            return Post.findByIdAndDelete(req.params.id);
        })
        .then(() => {
            return res.status(200).send({
                message: "Post deleted successfully"
            });
        })
        .catch(error => errorHandler(error, req, res));
};


 
// ADD COMMENT (FIXED)
module.exports.addComment = (req, res) => {

    return Post.findById(req.params.id)
        .then(post => {

            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            if (!req.body.comment) {
                return res.status(400).send({ error: "Comment is required" });
            }

            const newComment = {
                userId: req.user.id,
                comment: req.body.comment
            };

            post.comments.push(newComment);

            return post.save();
        })
        .then(savedPost => {
            return Post.findById(savedPost._id)
                .populate("userId", "firstName lastName email")
                .populate("likes", "firstName lastName")
                .populate({
                    path: "comments.userId",
                    select: "firstName lastName email"
                })
                .then(populatedPost => {
                    return res.status(201).send({
                        message: "Comment added successfully",
                        post: populatedPost,
                        comments: populatedPost.comments
                    });
                });
        })
        .catch(error => errorHandler(error, req, res));
};


// UPDATE COMMENT (FIXED)
module.exports.updateComment = (req, res) => {

    return Post.findById(req.params.postId)
        .then(post => {

            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            const comment = post.comments.id(req.params.commentId);

            if (!comment) {
                return res.status(404).send({ error: "Comment not found" });
            }

            const isCommentOwner = comment.userId.toString() === req.user.id;
            const isPostAuthor = post.userId.toString() === req.user.id;

            if (!isCommentOwner && !isPostAuthor) {
                return res.status(403).send({ error: "Unauthorized" });
            }

            comment.comment = req.body.comment || comment.comment;

            return post.save();
        })
        .then(updated => {
            return res.status(200).send({
                message: "Comment updated successfully",
                post: updated
            });
        })
        .catch(error => errorHandler(error, req, res));
};


// DELETE COMMENT (FIXED)
module.exports.deleteComment = (req, res) => {

    return Post.findById(req.params.postId)
        .then(post => {

            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            const comment = post.comments.id(req.params.commentId);

            if (!comment) {
                return res.status(404).send({ error: "Comment not found" });
            }

            const isCommentOwner = comment.userId.toString() === req.user.id;
            const isPostAuthor = post.userId.toString() === req.user.id;
            const isAdmin = req.user.isAdmin;

            if (!isCommentOwner && !isPostAuthor && !isAdmin) {
                return res.status(403).send({ error: "Unauthorized" });
            }

            comment.deleteOne();

            return post.save();
        })
        .then(updated => {
            return res.status(200).send({
                message: "Comment deleted successfully",
                post: updated
            });
        })
        .catch(error => errorHandler(error, req, res));
};


// LIKE POST
module.exports.likePost = (req, res) => {
    return Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            const alreadyLiked = post.likes.includes(req.user.id);
            if (alreadyLiked) {
                return res.status(400).send({ error: "You already liked this post" });
            }

            post.likes.push(req.user.id);
            return post.save();
        })
        .then(savedPost => {
            return Post.findById(savedPost._id)
                .populate("userId", "firstName lastName email")
                .populate("likes", "firstName lastName")
                .populate({
                    path: "comments.userId",
                    select: "firstName lastName email"
                })
                .then(populatedPost => {
                    return res.status(200).send({
                        message: "Post liked",
                        post: populatedPost
                    });
                });
        })
        .catch(error => errorHandler(error, req, res));
};


// UNLIKE POST
module.exports.unlikePost = (req, res) => {
    return Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            const likeIndex = post.likes.indexOf(req.user.id);
            if (likeIndex === -1) {
                return res.status(400).send({ error: "You haven't liked this post" });
            }

            post.likes.splice(likeIndex, 1);
            return post.save();
        })
        .then(savedPost => {
            return Post.findById(savedPost._id)
                .populate("userId", "firstName lastName email")
                .populate("likes", "firstName lastName")
                .populate({
                    path: "comments.userId",
                    select: "firstName lastName email"
                })
                .then(populatedPost => {
                    return res.status(200).send({
                        message: "Post unliked",
                        post: populatedPost
                    });
                });
        })
        .catch(error => errorHandler(error, req, res));
};


// GET LOGGED-IN USER POSTS

module.exports.getMyPosts = (req, res) => {

    if (!req.user) {
        return res.status(401).send({ error: "Unauthorized" });
    }

    const userId = req.user.id || req.user._id;

    return Post.find({ userId })
        .populate("userId", "firstName lastName email")
        .populate("likes", "firstName lastName")
        .populate({
            path: "comments.userId",
            select: "firstName lastName email"
        })
        .sort({ createdAt: -1 })
        .then(posts => {
            return res.status(200).send(posts);
        })
        .catch(error => errorHandler(error, req, res));
};

// LIKE COMMENT
module.exports.likeComment = (req, res) => {

    const { postId, commentId } = req.params;
    const userId = req.user.id;

    return Post.findById(postId)
        .then(post => {

            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            const comment = post.comments.id(commentId);

            if (!comment) {
                return res.status(404).send({ error: "Comment not found" });
            }

            // prevent duplicate like
            if (comment.likes.includes(userId)) {
                return res.status(400).send({ error: "Already liked this comment" });
            }

            comment.likes.push(userId);

            return post.save();
        })
        .then(saved => {
            return Post.findById(saved._id)
                .populate("userId", "firstName lastName email")
                .populate("likes", "firstName lastName")
                .populate({
                    path: "comments.userId",
                    select: "firstName lastName email"
                })
                .then(populated => {
                    return res.status(200).send({
                        message: "Comment liked",
                        post: populated
                    });
                });
        })
        .catch(error => errorHandler(error, req, res));
};

// UNLIKE COMMENT
module.exports.unlikeComment = (req, res) => {

    const { postId, commentId } = req.params;
    const userId = req.user.id;

    return Post.findById(postId)
        .then(post => {

            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }

            const comment = post.comments.id(commentId);

            if (!comment) {
                return res.status(404).send({ error: "Comment not found" });
            }

            const index = comment.likes.findIndex(
                id => id.toString() === userId
            );

            if (index === -1) {
                return res.status(400).send({ error: "You haven't liked this comment" });
            }

            comment.likes.splice(index, 1);

            return post.save();
        })
        .then(saved => {
            return Post.findById(saved._id)
                .populate("userId", "firstName lastName email")
                .populate("likes", "firstName lastName")
                .populate({
                    path: "comments.userId",
                    select: "firstName lastName email"
                })
                .then(populated => {
                    return res.status(200).send({
                        message: "Comment unliked",
                        post: populated
                    });
                });
        })
        .catch(error => errorHandler(error, req, res));
};
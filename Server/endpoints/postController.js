const express = require("express");
const asyncHandler = require('express-async-handler');
const ErrorException = require("../ErrorException");
const authenticateToken = require("../middleware/authMiddleware");
const postService = require("../services/postService");
const commentService = require("../services/commentService");
const router = express.Router();

// Get post by post ID
router.get("/:postID", authenticateToken, asyncHandler(async (req, res) => {
    let postID = req.params.postID;
    let currentAccountID = req.user.accountID

    const result = await postService.getPostByID(postID, currentAccountID)

    res.json({result: result})
}))

// Get comments by post ID
router.get("/:postID/comment", authenticateToken, asyncHandler(async (req, res) => {

    let postID = req.params.postID;

    const result = await commentService.getComments(postID)

    res.json({result: result})
}))

// Get child comments by parent comment ID
router.get("/:postID/comment/:parentCommentID", authenticateToken, asyncHandler(async (req, res) => {

    let postID = req.params.postID;
    let parentCommentID = req.params.parentCommentID;
    
    const result = await commentService.getCommentsByParentID(postID, parentCommentID)

    res.json({success:true, result: result})
}))

// Post Comment
router.post("/comment", authenticateToken, asyncHandler(async (req, res) => {
    const body = req.body
    const accountID = req.user.accountID
    
    await commentService.postComment(body, accountID)

    res.json({success: true})
}))

module.exports = router;

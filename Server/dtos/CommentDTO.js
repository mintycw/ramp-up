class CommentDTO {
    constructor({ Account, commentID, parentCommentID, postID, accountID, body, dateCreated, Replies = [] }) {
        this.commentID = commentID;
        this.parentCommentID = parentCommentID;
        this.postID = postID;
        this.accountID = accountID;
        this.totalReplies = Replies.length; 
        this.username = Account.username;
        this.verified = Account.verified;
        this.body = body;
        this.dateCreated = dateCreated;
        this.replies = Replies
    }
}

module.exports = CommentDTO;
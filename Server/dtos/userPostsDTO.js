class userPostsDTO {
    constructor({ postID, accountID, categoryID, body, dateCreated, Comments, Account, Category, likeCount, likedByCurrentUser, commentCount}) {
        this.postID = postID;
        this.accountID = accountID;
        this.categoryID = categoryID;
        this.body = body;
        this.dateCreated = dateCreated;
        this.comments = Comments || [];
        this.commentCount = commentCount || 0; 
        this.username = Account?.username || "";
        this.verified = Account?.verified;
        this.category = Category?.name || "";
        this.likeCount = likeCount;
        this.likedByCurrentUser = likedByCurrentUser == 1;
    }
}

module.exports = userPostsDTO;
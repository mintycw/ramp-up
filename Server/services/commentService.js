const { Comment, Account, Sequelize } = require('../models'); // Make sure Sequelize and models are imported
const CommentDTO = require('../dtos/CommentDTO');

class commentService {

    async postComment(body, accountID) {
        const comment = await Comment.create({
            parentCommentID: body.parentCommentID || null,
            postID: body.postID,
            accountID: accountID,
            body: body.body,
        });

        if (!comment) throw new Error('Error posting comment');

        return comment;
    }

    async getComments(postID) {
        // Fetch parent comments
        const comments = await Comment.findAll({
            include: [
                {
                    model: Account,
                    attributes: ['username', 'verified'], 
                },
                {
                    model: Comment, // Include the Comment model again for replies
                    as: 'Replies', // Give this instance an alias
                    attributes: ['commentID'],
                }
            ],
            where: {
                postID: postID,
                parentCommentID: null, 
            },
            order: [['dateCreated', 'DESC']],
        });


        if (!comments) throw new Error('Error getting comments');

        return comments.map(comment => new CommentDTO(comment));

    }

    async getCommentsByParentID(postID, parentCommentID) {
        const comments = await Comment.findAll({
            include: [
                {
                    model: Account,
                    attributes: ['username', 'verified'], // Include account username
                },
                {
                    model: Comment,
                    as: 'Replies', // Alias for replies to this comment
                    attributes: [], // We don’t need any attributes from replies in this query
                }
            ],
            where: {
                postID: postID,
                parentCommentID: parentCommentID,
            },
            order: [['dateCreated', 'DESC']],
        });

        if (!comments) throw new Error('Error getting comments');

        return comments.map(comment => new CommentDTO(comment));
    }

    async getCommentsByAccount(accountID) {
        const comments = await Comment.findAll({
            include: [
                {
                    model: Account,
                    attributes: ['username', 'verified']
                },
                {
                    model: Comment,
                    as: 'Replies', // Alias for replies to this comment
                    attributes: [], // We don’t need any attributes from replies in this query
                }
            ],
            where: {
                accountID: accountID,
            },
            order: [['dateCreated', 'DESC']],
        });

        if (!comments) throw new Error('Error getting comments');

        return comments.map(comment => new CommentDTO(comment));
    }
}

module.exports = new commentService();
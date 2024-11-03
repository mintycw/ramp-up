class UserDTO {
    constructor({ accountID, username, name, email, description, permissionID, verified, followersCount, followingCount, currentUserFollows}) {
        this.accountID = accountID;
        this.name = name;
        this.username = username;
        this.email = email;
        this.description = description;
        this.permissionID = permissionID;
        this.verified = verified;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
        this.currentUserFollows = Boolean(Number(currentUserFollows));
    }
}

module.exports = UserDTO;

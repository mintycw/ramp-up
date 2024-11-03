class ownAccountDTO {
    constructor({ accountID, username, name, email, description}) {
        this.accountID = accountID;
        this.name = name;
        this.username = username;
        this.email = email;
        this.description = description;
    }
}

module.exports = ownAccountDTO;

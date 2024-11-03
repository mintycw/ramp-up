const bcrypt = require('bcryptjs');
const { Account, Permission, Follow } = require('../models');
const logMessage = require('../logs/logger');
const ErrorException = require('../ErrorException');
const UserDTO = require('../dtos/UserDTO');
const { Sequelize, Op } = require('sequelize');
const { post } = require('../endpoints/accountController');

class AccountService {
    async getMinimalAccountById(accountID){
        return await Account.findByPk(accountID);
    }
    async getAccounts(currentAccountID) { 

      const accounts = await Account.findAll({
        attributes: {
            include: [
                [Sequelize.fn('COUNT', Sequelize.col('followers.followID')), 'followersCount'],
                [
                    Sequelize.literal(`SUM(CASE WHEN followers.followerID = ${currentAccountID} THEN 1 ELSE 0 END)`),
                    'currentUserFollows'
                ]
            ]
        },
        include: [
            {
                model: Follow,
                as: 'followers',
                attributes: [],
            }
        ],
        group: [
            'Account.accountID', 
            'Account.username', 
            'Account.name', 
            'Account.email', 
            'Account.description', 
            'Account.password', 
            'Account.permissionID', 
            'Account.dateCreated',  
            'Account.isDeleted'
        ],
        subQuery: false
    });
    

      return accounts.map(account => new UserDTO(account.dataValues));
    }

    async getAccountById(id, currentAccountID) {
      
      const account = await Account.findByPk(id, {
        attributes: {
          include: [
              [Sequelize.fn('COUNT', Sequelize.col('following.followID')), 'followingCount'],
              [Sequelize.fn('COUNT', Sequelize.col('followers.followID')), 'followersCount'],
              [
                Sequelize.literal(`SUM(CASE WHEN followers.followerID = ${currentAccountID} THEN 1 ELSE 0 END)`),
                'currentUserFollows'
            ]
            ]
        },
        include: [
          {
            model: Follow,
            as: 'followers',
            attributes: []
          },
          {
            model: Follow,
            as: 'following',
            attributes: []
          }
        ],
        subQuery: false
      });

      if (!account) 
        throw new ErrorException(404, 'ACCOUNT_NOT_FOUND');

      return new UserDTO(account.dataValues);
    }

    async createAccount(body, permissionID = 3) {
        // Validate the request body
       this.validateBody(body);

        const existingAccount = await Account.findOne({
            where: {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), body.email.toLowerCase()),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('username')), body.username.toLowerCase())
                ]
            }
        });

        if (existingAccount?.email.toLowerCase() === body.email.toLowerCase())
            throw new ErrorException(409, 'Email is already in use');

        if (existingAccount?.username.toLowerCase() === body.username.toLowerCase())
            throw new ErrorException(409, 'Username is already in use');

        const passwordResult = this.generatePassword(body.password);

        try {
            let newAccount = await Account.create({
                username: body.username,
                name: body.name,
                email: body.email,
                password: passwordResult,
                permissionID: permissionID,
            });

            logMessage('debug', `Created an account for ${body.username}.`);
            return newAccount;
        } catch (error) {
            logMessage('error', `Something went wrong while creating an account for ${body.username}. Error: ${error}`);
            throw new ErrorException(500, 'UNKNOWN_ERROR');
        }
    }

    async updateAccount(accountID, updateAccountDTO) {
        const account = await Account.findByPk(accountID);

        account.name = updateAccountDTO.name;
        account.description = updateAccountDTO.description;

        await account.save();
        return account;
    }

    async updatePermission(accountID, permissionID) {

        // Check if the permission exists
        const permissions = await Permission.findAll();
        const permissionIDs = permissions.map(permission => permission.permissionID);
        if (!permissionIDs.includes(parseInt(permissionID)))
          throw new ErrorException(404, 'PERMISSION_NOT_FOUND');

        // Check if the account exists
        const account = await Account.findByPk(accountID);
        if (!account) 
          throw new ErrorException(404, 'ACCOUNT_NOT_FOUND');

        // Update the permission
        account.permissionID = permissionID;
        await account.save();
        return { success: true };
    }

    async updateVerifiedStatus(accountID){
      const account = await Account.findByPk(accountID);
      if (!account) 
        throw new ErrorException(404, 'ACCOUNT_NOT_FOUND');

      account.verified = !account.verified;

      await account.save();
      return account.verified;
    }

    validateBody(body) {
        const userRegex = /^[0-9A-Za-z]{6,16}$/;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                
        if (!body) 
          throw new ErrorException(400, 'MISSING_BODY');

        if (!body.username) 
          throw new ErrorException(400, 'MISSING_USERNAME');

        if (!userRegex.test(body.username)) 
          throw new ErrorException(400, 'INVALID_USERNAME');

        if (!body.name) 
          throw new ErrorException(400, 'MISSING_NAME');

        if (!body.email) 
          throw new ErrorException(400, 'MISSING_EMAIL');

        if (!emailRegex.test(body.email)) 
          throw new ErrorException(400, 'INVALID_EMAIL');

        if (!body.password) 
          throw new ErrorException(400, 'MISSING_PASSWORD');

        if (!passwordRegex.test(body.password)) 
          throw new ErrorException(400, 'INVALID_PASSWORD');
    }

    generatePassword(password) {
        return bcrypt.hashSync(password, 10);
    }
}

module.exports = new AccountService();

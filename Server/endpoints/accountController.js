const express = require('express');

const accountService = require('../services/accountService');
const authService = require('../services/authService')

const router = express.Router();
const asyncHandler = require('express-async-handler');
const authenticateToken = require('../middleware/authMiddleware');
const ownAccountDTO = require("../dtos/Account/ownAccountDTO");
const updateAccountDTO = require("../dtos/Account/updateAccountDTO");
const ErrorException = require('../ErrorException');

// Route handler for creating an account
router.post('/', asyncHandler(async (req, res) => {
  const body = req.body;

  // Call the service to create an account
  let newAccount = await accountService.createAccount(body);

  let token =  authService.generateToken(newAccount);

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  });

  return res.json({ success: true });
}));

router.get("/all", authenticateToken, asyncHandler(async (req, res) => {
  let currentAccountID = req.user.accountID

  const result = await accountService.getAccounts(currentAccountID);

  return res.json({ success: true, result: result});
}));

router.get("/user", authenticateToken, asyncHandler(async (req, res) => {
  let currentAccountID = req.user.accountID

  const result = await accountService.getAccountById(req.user.accountID, currentAccountID);
  return res.json(result);
}));

router.get("/own", authenticateToken, asyncHandler(async (req, res) => {
  let currentAccountID = req.user.accountID;

  const result = await accountService.getMinimalAccountById(currentAccountID);
  const accountDTO = new ownAccountDTO(result);

  return res.json({ success: true, result: accountDTO});
}));

router.put("/own", authenticateToken, asyncHandler(async (req, res) => {
  let updatedAccount = new updateAccountDTO(req.body.account);

  if (updatedAccount.description.length > 255 || updatedAccount.name.length > 20)
    throw new ErrorException(400, "Description must be less than 255 characters and Name must be less than 20 characters")

  let currentAccountID = req.user.accountID;

  const result = await accountService.updateAccount(currentAccountID, updatedAccount);
  const accountDTO = new ownAccountDTO(result);

  return res.json({ success: true, result: accountDTO });
}));

module.exports = router;

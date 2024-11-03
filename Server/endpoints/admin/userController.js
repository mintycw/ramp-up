const express = require("express");
const asyncHandler = require('express-async-handler');
const ErrorException = require("../../ErrorException");
const authenticateToken = require("../../middleware/authMiddleware");
const postService = require("../../services/postService");
const accountService = require("../../services/accountService");
const permissionService = require("../../services/permissionService");
const router = express.Router();
router.get("/all", authenticateToken, asyncHandler(async (req, res) => {
    let currentAccountID = req.user.accountID

    const result = await accountService.getAccounts(currentAccountID);

    return res.json({success: true, result: result});
}))

router.get("/permissions", authenticateToken, asyncHandler(async (req, res) => {
    const result = await permissionService.getPermissions();
    return res.json({success: true, result: result});
}))

router.put("/permission", authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.permissionID !== 1)
        throw new ErrorException(403, 'INSUFFICIENT_PERMISSIONS');
    
    const { accountID, permissionID } = req.body;
    await accountService.updatePermission(accountID, permissionID);
    return res.json({success: true});
}))

router.put("/verified", authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.permissionID !== 1)
        throw new ErrorException(403, 'INSUFFICIENT_PERMISSIONS');
    
    const accountID = req.body.accountID;

    const verified = await accountService.updateVerifiedStatus(accountID);
    return res.json({success: true, verified: verified});
})) 

module.exports = router;

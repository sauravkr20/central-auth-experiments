const express = require('express');
const router = express.Router();
const keycloakAuth = require('./keycloak');
const opaAuthz = require('./opa');

// Protected route example
router.get('/data', keycloakAuth, opaAuthz, (req, res) => {
    console.log("accessing protected data")
    res.json({ message: `Hello, ${req.user.preferred_username}! This is protected data.` });
});

module.exports = router;

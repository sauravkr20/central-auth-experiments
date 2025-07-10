const axios = require('axios');

async function opaAuthzMiddleware(req, res, next) {
  try {
    console.log('Request received for OPA authorizationn'); 
    const input = {
      user: req.user,
      method: req.method,
      path: req.path
    };
    const opaRes = await axios.post('http://localhost:8181/v1/data/backend/authz/allow', { input });
    console.log('OPA response received:', opaRes.data);
    if (opaRes.data.result === true) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied by OPA policy' });
    }
  } catch (err) {
    res.status(500).json({ error: 'OPA authorization error', details: err.message });
  }
}

module.exports = opaAuthzMiddleware;

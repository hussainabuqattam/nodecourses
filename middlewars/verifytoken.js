const jwt = require("jsonwebtoken");
// verify token
const verifytoken = async (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.decode(token, process.env.JWT_TOKEN);
      req.user = decoded;
      next();
    } catch {
      return res.status(403).json({ message: "invailid token" });
    }
  } else {
    return res.status(400).json({ message: "you dont have token" });
  }
};

// verify token and authorize the user
const verifytokenandauthorize = (req, res, next) => {
  verifytoken(req, res, () => {
    // verifytoken
    if (req.user.id === req.params.id || req.user.admin) {
      next();
    } else {
      return res.status(403).json({ message: "not allowed" });
    }
  });
};

// verify token and authorize the user
const verifytokeadmin = (req, res, next) => {
  verifytoken(req, res, () => {
    // verifytoken
    if (req.user.admin) {
      next();
    } else {
      return res.status(403).json({ message: "you cant updated in admin" });
    }
  });
};

module.exports = { verifytoken, verifytokeadmin, verifytokenandauthorize };

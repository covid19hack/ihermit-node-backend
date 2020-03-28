const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET!

//authenticate token
const authenticate = (req, res, next) => {
  let token = req.headers['auth-token'];
  if(!token){
    return res.status(403).json({ success: false, message: "No token provided" });
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
      if(err) return res.status(500).json({ success: false, message: "Failed to authenticate the token" });
      req.decodedToken = decodedToken;
      next();
  });
};

// send a token
const authorise = (user, req, res) => {
  const userData = {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email
  }
  const token = jwt.sign(userData, jwtSecret);
  res.json({
    success: true,
    auth_token: token,
    user: userData
  });
}

module.exports = {
  authenticate,
  authorise
}

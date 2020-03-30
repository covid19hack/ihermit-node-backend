const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const jwtSecret = process.env.JWT_SECRET

//authenticate token
const authenticate = (req, res, next) => {
  console.log(req.headers)
  const token = req.headers['x-authtoken'];
  if(!token) {
    next(createError(403, "No token provided"));
  } else {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        next(createError(403, "Invalid token"))
      } else {
        req.decodedToken = decoded;
        next();
      }
    });
  }
};

// send a token
const authorise = (user, req, res, options) => {
  const userData = {
    id: user._id,
    nickName: user.nickName,
  }
  const token = jwt.sign(userData, jwtSecret);
  res.json({
    success: true,
    authToken: token,
    userId: user._id,
    ...options,
  });
}

module.exports = {
  authenticate,
  authorise
}

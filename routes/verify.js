const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = await req.cookies.UserCookie;

  if (authHeader) {
    const token = authHeader;

    jwt.verify(token, process.env.JWT_SEC, (err, myuser) => {
      if (err) res.status(403).json("Token is not valid");
      req.user = myuser;
      next();
    });
  } else {
    console.log("You are not authenticated!");
    return res.redirect("/auth/login");
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      console.log("Admin only!");
      return res.redirect("/auth/success");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
};

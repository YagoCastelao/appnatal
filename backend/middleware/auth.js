const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ message: "🎄 Token inválido, faça login novamente" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ message: "🎄 Não autorizado, token não encontrado" });
  }
};

// Gerar JWT com expiração de 40 dias
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "40d", // Token expira em 40 dias
  });
};

module.exports = { protect, generateToken };

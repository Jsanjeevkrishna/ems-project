exports.isHR = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "HR access only" });
  }
  next();
};

exports.isManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Manager access only" });
  }
  next();
};

exports.isEmployee = (req, res, next) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ message: "Employee access only" });
  }
  next();
};

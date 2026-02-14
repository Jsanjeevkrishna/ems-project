exports.viewMyProfile = async (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    place: req.user.place,
    gender: req.user.gender,
    role: req.user.role,
  });
};

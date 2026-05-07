const User = require("../../models/User");
const jwt = require("jsonwebtoken");

/* ────────────────────────────────────────────
   SIGNUP  (self-registration as member/employee)
──────────────────────────────────────────── */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email and password are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      role: "employee",
      isFirstLogin: false,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "Account created",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ────────────────────────────────────────────
   LOGIN
──────────────────────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    // FIRST LOGIN CHECK
    if (user.isFirstLogin) {
      return res.status(200).json({
        firstLogin: true,
        userId: user._id,
        role: user.role,
        message: "Please set your password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ────────────────────────────────────────────
   SET PASSWORD  (First Login)
──────────────────────────────────────────── */
exports.setPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isFirstLogin) {
      return res.status(400).json({ message: "Password already set" });
    }

    user.password = password;
    user.isFirstLogin = false;

    await user.save();

    res.json({ message: "Password set successfully. Please login again." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


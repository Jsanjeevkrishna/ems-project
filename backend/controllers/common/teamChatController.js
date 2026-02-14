const TeamChat = require("../../models/TeamChat");

/* ================= CREATE ROOM ================= */
const createRoom = async (req, res) => {
  try {
    const room = await TeamChat.create({
      managerId: req.user._id,
      roomName: req.body.roomName,
      messages: [],
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL ROOMS (MANAGER) ================= */
const getRooms = async (req, res) => {
  try {
    const rooms = await TeamChat.find({ managerId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ROOM BY ID ================= */
const getRoomById = async (req, res) => {
  try {
    const room = await TeamChat.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ROOM ================= */
const deleteRoom = async (req, res) => {
  try {
    const room = await TeamChat.findOneAndDelete({
      _id: req.params.id,
      managerId: req.user._id, // 🔒 Only allow manager to delete their own room
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found or not authorized" });
    }

    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ================= SAVE MESSAGE (FIXED) ================= */
const saveMessage = async ({
  roomId,
  senderId,
  senderRole,
  senderName,
  message,
}) => {
  if (!roomId || !senderRole || !senderName || !message) return;

  await TeamChat.findByIdAndUpdate(roomId, {
    $push: {
      messages: {
        senderId,
        senderRole,
        senderName, // ✅ THIS ENABLES "Employee Ravi"
        message,
        createdAt: new Date(),
      },
    },
  });
};

/* ================= GET EMPLOYEE ROOMS ================= */
const getEmployeeRooms = async (req, res) => {
  try {
    const employee = req.user;

    if (!employee.managerId) {
      return res.json([]);
    }

    const rooms = await TeamChat.find({
      managerId: employee.managerId,
    }).select("_id roomName");

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= EXPORT ================= */
module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  deleteRoom,
  saveMessage,
  getEmployeeRooms,
};

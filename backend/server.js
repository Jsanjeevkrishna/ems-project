const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

/* ================= CONFIG ================= */
dotenv.config();
connectDB();

const app = express();

/* ================= MIDDLEWARE ================= */
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:4173",
    ];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json());

/* ================= AUTH ROUTES ================= */
app.use("/api/auth", require("./routes/auth/authRoutes"));

/* ================= PROJECT ROUTES ================= */
app.use("/api/projects", require("./routes/project/projectRoutes"));

/* ================= HR ROUTES ================= */
app.use("/api/hr", require("./routes/hr/hrRoutes"));
app.use("/api/hr/dashboard", require("./routes/hr/dashboardRoutes"));
app.use("/api/hr/profile", require("./routes/hr/profileRoutes"));
app.use("/api/hr/attendance", require("./routes/hr/attendanceRoutes"));
app.use("/api/hr/performance", require("./routes/hr/performanceRoutes"));
app.use("/api/hr/payroll", require("./routes/hr/payrollRoutes"));
app.use("/api/hr/search", require("./routes/hr/searchRoutes"));
app.use("/api/hr/analytics", require("./routes/hr/analyticsRoutes"));
app.use("/api/hr/teams", require("./routes/hr/teamRoutes"));

/* ================= MANAGER ROUTES ================= */
app.use("/api/manager/profile", require("./routes/manager/profileRoutes"));
app.use("/api/manager/dashboard", require("./routes/manager/dashboardRoutes"));
app.use("/api/manager/tasks", require("./routes/manager/taskRoutes"));
app.use("/api/manager/performance", require("./routes/manager/performanceRoutes"));
app.use("/api/manager/leaves", require("./routes/manager/leaveRoutes"));
app.use("/api/manager/attendance", require("./routes/manager/attendanceRoutes"));

/* ================= EMPLOYEE ROUTES ================= */
app.use("/api/employee/profile", require("./routes/employee/profileRoutes"));
app.use("/api/employee/dashboard", require("./routes/employee/dashboardRoutes"));
app.use("/api/employee/tasks", require("./routes/employee/taskRoutes"));
app.use("/api/employee/attendance", require("./routes/employee/attendanceRoutes"));
app.use("/api/employee/leaves", require("./routes/employee/leaveRoutes"));

/* ================= COMMON ROUTES ================= */
app.use("/api/team-chat", require("./routes/common/teamChatRoutes"));
app.use("/api/notifications", require("./routes/common/notificationRoutes"));

/* ================= HEALTH CHECK ================= */
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date() }));

/* ================= SEED ROUTE (temp) ================= */
app.use("/api/seed", require("./routes/seed/seedRoute"));

/* ================= SOCKET.IO ================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const { saveMessage } = require("./controllers/common/teamChatController");

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("📥 Joined room:", roomId);
  });

  socket.on("sendMessage", async ({ roomId, senderId, senderRole, senderName, message }) => {
    if (!roomId || !message) return;
    await saveMessage({ roomId, senderId, senderRole, senderName, message });
    io.to(roomId).emit("receiveMessage", {
      senderId,
      senderRole,
      senderName,
      message,
      createdAt: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

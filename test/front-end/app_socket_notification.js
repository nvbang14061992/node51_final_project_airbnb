const { io } = require("socket.io-client");

const socket = io("http://localhost:3069", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc1OTQ4MjUzNCwiZXhwIjoxNzU5NTY4OTM0fQ.fL0KpB09Xgrepzx6SetvhOPCMRTAvORwY4-C9NHVLJ8",
  },
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("new-notification", (data) => {
  console.log("New notification received:", data);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});
socket.on("connect_error", (err) => {
  console.error("Connection error:", err);
});

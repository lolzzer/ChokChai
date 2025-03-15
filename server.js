const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000; // หรือพอร์ตที่ต้องการ
const LINE_NOTIFY_TOKEN = "1xzNt537Kvo1TI9Lplivtx5lINyBI4jBIITIHAYdmAV"; // 🔴 ใส่ Token ที่ได้จาก LINE Notify

app.use(cors()); // เปิดให้รับ request จาก frontend
app.use(express.json()); // ให้รองรับ JSON request

// Endpoint สำหรับรับคำสั่งจาก Frontend แล้วส่งไปที่ LINE Notify
app.post("/send-line", async (req, res) => {
    try {
        const { message } = req.body; // รับข้อความจาก frontend

        const response = await axios.post(
            "https://notify-api.line.me/api/notify",
            new URLSearchParams({ message }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${LINE_NOTIFY_TOKEN}`
                }
            }
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at https://localhost:${PORT}`);
});
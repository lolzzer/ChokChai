const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const bodyParser = require('body-parser');

// สร้างแอพ Express
const app = express();
const port = 3000;

// กำหนดที่เก็บไฟล์อัปโหลด (ในที่นี้คือโฟลเดอร์ uploads)
const upload = multer({ dest: 'uploads/' });

// ใช้ Body Parser เพื่อแปลงข้อมูล JSON ที่รับเข้ามา
app.use(bodyParser.json());

// สร้าง API สำหรับรับข้อมูลจากฟอร์ม
app.post('/order', (req, res) => {
    const { roomNumber, quantity } = req.body;

    if (!roomNumber || !quantity) {
        return res.status(400).send("กรุณากรอกหมายเลขห้องและจำนวนที่ต้องการสั่ง!");
    }

    // สร้างข้อมูลในรูปแบบ Array
    const orderData = [
        ["หมายเลขห้อง", "จำนวนที่สั่งซื้อ"],
        [roomNumber, quantity]
    ];

    // สร้าง Workbook และ Worksheet
    const ws = XLSX.utils.aoa_to_sheet(orderData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "คำสั่งซื้อ");

    // กำหนดที่เก็บไฟล์ Excel
    const filePath = path.join(__dirname, 'uploads', 'order.xlsx');

    // บันทึกไฟล์ Excel
    XLSX.writeFile(wb, filePath);

    // ส่งคำตอบกลับไปที่ Frontend
    res.send({ message: 'สั่งซื้อสำเร็จและไฟล์ถูกบันทึกแล้ว!', filePath });
});

// เริ่มเซิร์ฟเวอร์ที่พอร์ต 3000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
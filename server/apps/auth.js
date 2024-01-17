import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);

  const collection = db.collection("users");
  await collection.insertOne(user);

  return res.json({
    message: "User has been create successfully",
  });
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  const user = await db.collection("user").findOne({
    username: req.body.username,
  });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    return res.status(400).json({
      message: "Password not valid",
    });
  }

  const token = jwt.sign(
    // id คือ user id
    // firstName คือ Firstname ของ User
    // lastName คือ Lastname ของ User
    { id: user._id, firstName: user.firstName, lastName: user.lastName },
    process.env.SECREAT_KEY,
    {
      expiresIn: "900000",
    }
  );

  return res.json({
    message: "login successfully",
    token,
  });
});

export default authRouter;

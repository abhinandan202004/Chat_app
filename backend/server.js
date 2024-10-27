import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import messageRoutes from "./routes/message.routes.js"

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use(cookieParser());
// app.get("/", (req, res) => {
//   res.send("hello World");
// });


app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`server Listening to ${PORT}`);
});

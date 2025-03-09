import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
import bodyParser from "body-parser"
import connectDB from "./utils/db.js";
import userRoute from "./api/user.route.js"
import postRoute from "./api/post.route.js"
import messageRoute from "./api/message.route.js"
import { app,server } from "./socket/socket.js";
dotenv.config();





app.get("/", (req, res) => {
    return res.status(200).json({
        message: "I'm coming from the backend",
        success:true
    })
})

//middleware
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }))

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}

app.use(cors(corsOptions))


app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

const PORT = process.env.PORT || 3000


server.listen(PORT, async () => {
    await connectDB();
    console.log(`server is running at port ${PORT}`)
})
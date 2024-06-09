import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import postRouter from "./routes/post.route.js";
import cookieParser from "cookie-parser";
const app = express()

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"]
}))

//routes
app.use("/api/auth",authRouter);
app.use("/api",userRouter)
app.use("/api/post",postRouter)

app.listen(3000,()=>{
    console.log("server is running")
    connectToDatabase()
})
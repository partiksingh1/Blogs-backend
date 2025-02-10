import express from "express"
import { userRouter } from "./routes/userRoute.js";
const port = 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req,res)=>{
    res.send("Hello world");
})
app.use("/api/v1",userRouter)



app.listen(port,()=>{
    console.log(`listining on port ${port}`);
})
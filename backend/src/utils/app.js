import express from "express";
import cors from "cors";
import connectDB from "./connectdb.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

import userRouter from "../routes/userRouter.js";

app.use("/api/user", userRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

export { app };

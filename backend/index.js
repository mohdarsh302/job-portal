import express from "express";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import connectDb from './utils/db.js';
import userRouter from './routes/user.route.js';
import companyRouter from './routes/company.route.js'
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import cors from 'cors';

dotenv.config({});

const app = express();

// connect db
connectDb();

// ✅ CORS should be at the top before any routes or middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// Optionally, set headers manually too
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // must match exactly
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());


//routes

app.use('/api/v1/users', userRouter);

app.use('/api/v1/company', companyRouter);

app.use("/api/v1/job", jobRoute);

app.use("/api/v1/application", applicationRoute);



const PORT=process.env.PORT || 8080

app.listen(PORT, () => {
    // connectDb();
    console.log(`Server is running on ${PORT}`);
})
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss";
import cookieParser from "cookie-parser";
import { ProtectRoute } from "./middlewares/ProtectRoute.js";
import Courseroute from "./routes/course.routes.js";
import AdminRoute from "./routes/admin.routes.js";



const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      connectSrc: ["'self'", "http://localhost:5173"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

const xssOptions = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script"],
};

const sanitize = (value) => {
  if (typeof value === "string") return xss(value, xssOptions);
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      value[key] = sanitize(value[key]);
    }
  }
  return value;
};

app.use((req, res, next) => {
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});

app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,methods: ["GET","POST","PUT","DELETE","PATCH"]
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

app.use(limiter);

app.use("/api/v1/admin", AdminRoute);

app.use(ProtectRoute)
app.use("/api/v1/course" , Courseroute);



app.listen(9000, ()=> (console.log('Course Management System server is running on port 9000')))

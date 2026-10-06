import express from "express";
import { CreateCourse, DeleteCourse, GetAllCourses, GetCourseById, UpdateCourse } from "../controller/course.controller.js";
import validate, { validateParams } from "../middlewares/validation/validatation.schema.js";
import createCourseSchema from "../middlewares/validation/createcourse.schema.js";
import updateCourseSchema, { updateCourseIdSchema } from "../middlewares/validation/updatecourse.schema.js";
import deleteCourseSchema from "../middlewares/validation/deletecourse.schema.js";
import viewCourseSchema from "../middlewares/validation/viewcourse.schema.js";

const Courseroute = express.Router();

Courseroute.post("/", validate(createCourseSchema), CreateCourse);
Courseroute.get("/", GetAllCourses);
Courseroute.get("/:id", validateParams(viewCourseSchema), GetCourseById);
Courseroute.put("/:id", validateParams(updateCourseIdSchema), validate(updateCourseSchema), UpdateCourse);
Courseroute.delete("/:id", validateParams(deleteCourseSchema), DeleteCourse);

export default Courseroute;

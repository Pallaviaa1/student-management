const express = require("express");
const {
  createStudent,
  getAllStudents,
  getStudentByRegNo,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();

router.post("/", createStudent);
router.get("/", getAllStudents);
router.get("/:regNo", getStudentByRegNo);
router.put("/:regNo", updateStudent);
router.delete("/:regNo", deleteStudent);

module.exports = router;

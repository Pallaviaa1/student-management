const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Student
exports.createStudent = async (req, res) => {
  try {
    const { regNo, name, class: studentClass, rollNo, contactNo } = req.body;

    if (!regNo || !name || !studentClass || !rollNo || !contactNo) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingStudent = await prisma.student.findUnique({ where: { regNo } });
    if (existingStudent) {
      return res.status(400).json({ succes: false, error: "Registration number already exists" });
    }

    const student = await prisma.student.create({
      data: { regNo, name, class: studentClass, rollNo, contactNo },
    });

    res.status(200).json({succes:true, message:"Student Added Successfully", student});
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get All Students (with pagination)
exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const students = await prisma.student.findMany({ skip: parseInt(skip), take: parseInt(limit) });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get Student by Registration Number
exports.getStudentByRegNo = async (req, res) => {
  try {
    const { regNo } = req.params;
    const student = await prisma.student.findUnique({ where: { regNo } });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const { regNo } = req.params;
    const { name, class: studentClass, rollNo, contactNo } = req.body;

    const existingStudent = await prisma.student.findUnique({ where: { regNo } });
    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    const updatedStudent = await prisma.student.update({
      where: { regNo },
      data: { name, class: studentClass, rollNo, contactNo },
    });

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Delete Student (Soft Delete)
exports.deleteStudent = async (req, res) => {
  try {
    const { regNo } = req.params;

    const existingStudent = await prisma.student.findUnique({ where: { regNo } });
    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    const deletedStudent = await prisma.student.update({
      where: { regNo },
      data: { status: false },
    });

    res.json({ message: "Student deactivated successfully", student: deletedStudent });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

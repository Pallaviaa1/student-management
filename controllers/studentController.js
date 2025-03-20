const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Student
exports.createStudent = async (req, res) => {
  try {
    const { regNo, name, studentClass, rollNo, contactNo } = req.body;

    //  Validate required fields
    if (!regNo || !name || !studentClass || !rollNo || !contactNo) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    //  Ensure `regNo` is unique
    const existingStudent = await prisma.student.findUnique({ where: { regNo } });
    if (existingStudent) {
      return res.status(400).json({ success: false, error: "Registration number already exists" });
    }

    // Ensure `rollNo` is unique within the same class
    const existingRollNo = await prisma.student.findFirst({
      where: { rollNo, class: studentClass },
    });

    if (existingRollNo) {
      return res.status(400).json({ success: false, error: "Roll number already exists in this class" });
    }

    // Create new student
    const student = await prisma.student.create({
      data: { regNo, name, class: studentClass, rollNo, contactNo, createdAt: new Date(), updatedAt: new Date() },
    });

    res.status(201).json({ success: true, message: "Student added successfully", student });
  } catch (error) {
    console.error("Error creating student:", error.message);
    res.status(500).json({ success: false, error: "Server error", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};


// Get All Students (GET /students with pagination)
exports.getAllStudents = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    // Ensure page and limit are numbers
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    // Fetch students with pagination
    const students = await prisma.student.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }, // Sort newest first
    });

    // Get total count for pagination metadata
    const totalStudents = await prisma.student.count();

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      students,
      pagination: {
        total: totalStudents,
        page,
        limit,
        totalPages: Math.ceil(totalStudents / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ success: false, error: "Server error", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};


// Get Student by Registration Number (GET /students/:regNo)
exports.getStudentByRegNo = async (req, res) => {
  try {
    const { regNo } = req.params;

    // Validate regNo (ensure it's not empty)
    if (!regNo || regNo.trim() === "") {
      return res.status(400).json({ success: false, error: "Invalid registration number" });
    }

    const student = await prisma.student.findUnique({
      where: { regNo },
    });

    if (!student) {
      return res.status(400).json({ success: false, error: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      student,
    });
  } catch (error) {
    console.error("Error fetching student:", error.message);
    res.status(500).json({ success: false, error: "Server error", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};


// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const { regNo } = req.params;
    let { name, class: studentClass, rollNo, contactNo } = req.body;

    // Validate regNo
    if (!regNo || regNo.trim() === "") {
      return res.status(400).json({ success: false, error: "Invalid registration number" });
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({ where: { regNo } });
    if (!existingStudent) {
      return res.status(400).json({ success: false, error: "Student not found" });
    }

    // Check if roll number already exists in the same class
    if (studentClass && rollNo) {
      const existingRollNo = await prisma.student.findFirst({
        where: { class: studentClass, rollNo, NOT: { regNo } }, // Exclude current student
      });

      if (existingRollNo) {
        return res.status(400).json({ success: false, error: "Roll number already exists in this class" });
      }
    }

    // Ensure at least one field is provided
    if (!name && !studentClass && !rollNo && !contactNo) {
      return res.status(400).json({ success: false, error: "At least one field is required for update" });
    }

    // Update student details
    const updatedStudent = await prisma.student.update({
      where: { regNo },
      data: { name, class: studentClass, rollNo, contactNo, updatedAt: new Date() },
    });

    res.status(200).json({
      success: true,
      message: "Student Updated Successfully",
      updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error.message);
    res.status(500).json({ success: false, error: "Server error", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
};


// Delete Student (Soft Delete)
exports.deleteStudent = async (req, res) => {
  try {
    const { regNo } = req.params;

    // Validate regNo
    if (!regNo || regNo.trim() === "") {
      return res.status(400).json({ success: false, error: "Invalid registration number" });
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({ where: { regNo } });
    if (!existingStudent) {
      return res.status(400).json({ success: false, error: "Student not found" });
    }

    // Soft delete student (Set isDeleted to true)
    const deletedStudent = await prisma.student.update({
      where: { regNo },
      data: { isDeleted: true, updatedAt: new Date() }, // Soft delete
    });

    res.status(200).json({
      success: true,
      message: "Student deactivated successfully",
      student: deletedStudent,
    });
  } catch (error) {
    console.error("Error deleting student:", error.message);
    res.status(500).json({ success: false, error: "Server error", details: error.message });
  }
};

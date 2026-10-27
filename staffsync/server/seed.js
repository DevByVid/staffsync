// Populates the database with demo accounts and sample data.
// Usage: npm run seed      (WARNING: clears existing data first)
const dotenv = require("dotenv");
dotenv.config({ quiet: true });
const mongoose = require("mongoose");
const User = require("./models/User");
const Employee = require("./models/Employee");
const Leave = require("./models/Leave");
const Attendance = require("./models/Attendance");
const Announcement = require("./models/Announcement");
const Training = require("./models/Training");

const day = (offset) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Clearing old data...");
  await Promise.all([
    User.deleteMany(), Employee.deleteMany(), Leave.deleteMany(),
    Attendance.deleteMany(), Announcement.deleteMany(), Training.deleteMany(),
  ]);

  const [hr, manager, emp1, emp2] = await User.create([
    { name: "Priya Sharma", email: "hr@staffsync.com", password: "hr123456", role: "HR", department: "Human Resources" },
    { name: "Rahul Verma", email: "manager@staffsync.com", password: "manager123", role: "Manager", department: "Engineering" },
    { name: "Aarav Mehta", email: "employee@staffsync.com", password: "employee123", role: "Employee", department: "Engineering", phone: "9876543210", address: "Indore, MP" },
    { name: "Sneha Patel", email: "sneha@staffsync.com", password: "employee123", role: "Employee", department: "Design" },
  ]);

  await Employee.create([
    { user: emp1._id, name: emp1.name, email: emp1.email, department: "Engineering", position: "Software Developer", salary: 650000, joinDate: day(-400), phone: "9876543210", address: "Indore, MP" },
    { user: emp2._id, name: emp2.name, email: emp2.email, department: "Design", position: "UI/UX Designer", salary: 550000, joinDate: day(-200), phone: "9123456780", address: "Bhopal, MP" },
    { name: "Vikram Singh", email: "vikram@staffsync.com", department: "Sales", position: "Sales Executive", salary: 480000, joinDate: day(-90), phone: "9988776655", address: "Pune, MH" },
  ]);

  await Leave.create([
    { user: emp1._id, startDate: day(5), endDate: day(6), reason: "Family function at hometown", status: "Pending" },
    { user: emp1._id, startDate: day(-20), endDate: day(-19), reason: "Medical appointment", status: "Approved", approverRole: "Manager", approvedBy: manager._id },
    { user: emp2._id, startDate: day(10), endDate: day(12), reason: "Personal work", status: "Rejected", approverRole: "HR", approvedBy: hr._id },
  ]);

  const att = [];
  for (let i = 1; i <= 5; i++) {
    att.push({ user: emp1._id, date: day(-i), checkInTime: "9:2" + i + ":10 AM", checkOutTime: "6:0" + i + ":45 PM", status: "Present" });
    att.push({ user: emp2._id, date: day(-i), checkInTime: "9:4" + i + ":00 AM", checkOutTime: i === 3 ? "1:30:00 PM" : "6:15:00 PM", status: i === 3 ? "Half Day" : "Present" });
  }
  await Attendance.create(att);

  await Announcement.create([
    { title: "Welcome to StaffSync", message: "Our new HR portal is live. Mark your attendance daily and apply for leaves here.", createdBy: hr._id, targetAudience: "All" },
    { title: "Diwali Holidays", message: "The office will remain closed for Diwali. Plan your work accordingly.", createdBy: hr._id, targetAudience: "Employees" },
    { title: "Monthly Review", message: "Managers, please submit your team's monthly review by Friday.", createdBy: hr._id, targetAudience: "Managers" },
  ]);

  await Training.create([
    { title: "MongoDB CRUD", description: "Hands-on session on MongoDB CRUD operations with Mongoose.", date: day(7), trainer: "Rahul Verma", createdBy: manager._id, assignedTo: [emp1._id] },
    { title: "Workplace Communication", description: "Open session for all employees on effective communication.", date: day(14), trainer: "External Coach", createdBy: manager._id, assignedTo: [] },
  ]);

  console.log("\nDemo data created. Login credentials:");
  console.log("  HR        hr@staffsync.com        / hr123456");
  console.log("  Manager   manager@staffsync.com   / manager123");
  console.log("  Employee  employee@staffsync.com  / employee123");
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

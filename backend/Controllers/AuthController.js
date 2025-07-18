const UserModel = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const StudentDetail = require("../Models/studentDetail");
// const TeacherDetail = require("../Models/teacherDetail");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res) => {
  try {
    const { name, email, department, designation, password, role } = req.body;

    if (!name || !email || !department || !designation || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format", success: false });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser && existingUser.is_verified === false) {
      if (existingUser.role === "user") {
        await StudentDetail.deleteOne({ userId: existingUser._id });
      }
      await existingUser.deleteOne();
    } else if (existingUser) {
      return res.status(409).json({ message: "User already exists", success: false });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      department,
      designation,
      password: hashedPassword,
      role,
      is_active: true,
      is_verified: false,
      otp,
    });

    await newUser.save();

    const emailText = `
Hello ${name},

Thank you for registering at Master Motors.

Your One-Time Password (OTP) for email verification is:

🔐 OTP: ${otp}

Please enter this code in the app to verify your email address.

If you did not initiate this registration, please ignore this message.

Regards,  
Master Motors Team`;

    await sendEmail(email, "Master Motors - Email Verification OTP", emailText);

    return res.status(201).json({ message: "Signup successful. OTP sent to email.", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "Auth failed: email or password wrong", success: false });
    }

    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
      return res.status(403).json({ message: "Auth failed: email or password wrong", success: false });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: "Account not verified", success: false });
    }

    if (user.admin_verified === "false" || user.admin_verified === "rejected") {
      return res.status(403).json({ message: "Admin not verified", success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        designation: user.designation,
        role: user.role,
      },
      jwtToken,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

const verify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "Auth failed: email or password wrong", success: false });
    }

    if (user.otp != otp) {
      return res.status(403).json({ message: "OTP is wrong", success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    user.is_verified = true;
    await user.save();

    res.status(200).json({
      message: "OTP has been verified",
      name: user.name,
      email: user.email,
      department: user.department,
      designation: user.designation,
      role: user.role,
      jwtToken,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      user.otp = Math.floor(Math.random() * 1000000 + 1);

      await user.save();
      await sendEmail(
        email,
        "FYPedia - Password Reset OTP",
        `Hello ${user.name || "User"},

            We received a request to reset your password.

            🔐 Your One-Time Password (OTP) is: ${user.otp}

            Please enter this OTP in the app to proceed with resetting your password.

            ⚠️ Do not share this code with anyone. It will expire shortly.

            If you did not request this, please ignore this email.

            Regards,  
            FYPedia Support Team`
      );
    }
    if (!user) {
      return res
        .status(409)
        .json({ message: "Auth failed: email is wrong", success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Otp has sent to your email",
      name: user.name,
      email: user.email,
      role: user.role,
      jwtToken: jwtToken,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || password.length < 4) {
      return res.status(400).json({
        message: "Password must be at least 4 characters long",
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(409)
        .json({ message: "Auth failed: email is wrong", success: false });
    }

    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Password Reset Successfully",
      name: user.name,
      email: user.email,
      role: user.role,
      jwtToken: jwtToken,
      success: true,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

const getTotalUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      is_active: true,
      is_verified: true,
      role: "user",
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

const getTotalActiveUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      is_active: true,
      role: "user",
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

const getTotalVerifiedUsers = async (req, res) => {
  try {
    const users = await UserModel.find({
      is_verified: true,
      role: "user",
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

const acceptUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await UserModel.findOne({ _id: userId });
    if (user) {
      user.admin_verified = "true";
      await user.save();
      await sendEmail(
        user.email,
        "FYPEDIA Account Approved 🎉",
        `Dear ${user.name || "User"
        },\n\nYour account has been approved. You can now log in and use FYPEDIA.\n\nBest regards,\nFYPEDIA Team`
      );
      console.log("User accepted:", user.email);

      res
        .status(200)
        .json({ message: "User accepted successfully", success: true });
    } else {
      res.status(404).json({ message: "User not found", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

const deleteUserRequest = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await UserModel.findOne({ _id: userId });
    if (user) {
      user.admin_verified = "rejected";
      await user.save();

      res
        .status(200)
        .json({ message: "User deleted successfully", success: true });
    } else {
      res.status(404).json({ message: "User not found", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports = {
  signup,
  login,
  verify,
  forgetPassword,
  resetPassword,
  getTotalUsers,
  acceptUser,
  deleteUserRequest,
  getTotalActiveUsers,
  getTotalVerifiedUsers,
};



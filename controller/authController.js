const User = require("../model/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const sendEmail = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOTP");
// const otp = generateOTP();

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || name.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Name field is required and must be contain atleast 3 charachter"
      })
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required"
      })
    }

    let passRegex = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/


    if (!passRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "8 characters length,2 letters in Upper Case,1 Special Character (!@#$&*),2 numerals (0-9),3 letters in Lower Case"
      })
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist",
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({
      success: true,
      message: "User Registerd successfully!!",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required"
      })
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User not exist,Invalid Credentials",
      });
    }
    const isMatch = await bcryptjs.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password,Invalid Credentials",
      });
    }
    const token = jwt.sign(
      {
        id: userExist._id,
        role: userExist.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" },
    );
    // res.status(201).json({ token });

    res.cookie("token", token, {
      httpOnly: true
    })

    res.status(200).json({
      success: true,
      message: "User Login Successfully"
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const logout = (req, res) => {

  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully!"
  })

}

const forgotPassword = async (req, res) => {

  const { email } = req.body;

  try {

    if (!email) {
      return res.status(400).json({
        success: falses,
        message: "email is required"
      })
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered"
      })
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    // HTML Email
    const message = `
      <h2>Password Reset Request</h2>
      <p>Click below link to reset your password:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link expires in 10 minutes.</p>
    `;

    await sendEmail(user.email, "Reset Password", message);

    res.status(200).json({
      success: true,
      message: "Reset link send to email"
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    })

  }
};

const resetPassword = async (req, res) => {

  try {

    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required"
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or exipred token"
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.status(200).json({
      success: false,
      message: "Password reset successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
};

const changePassword = async (req,res)=>{
  try {
    const {oldPassword} = req.body;
    const {newPassword} = req.body;
    const {confirmPassword} = req.body;

    if(!oldPassword || !newPassword || !confirmPassword){
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if(newPassword !== confirmPassword){
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    if(oldPassword === newPassword){
      return res.status(400).json({
        success: false,
        message: "New password must be different form old password"
      });
    }

    let passRegex = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;


    if (!passRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "8 characters length,2 letters in Upper Case,1 Special Character (!@#$&*),2 numerals (0-9),3 letters in Lower Case"
      })
    }    

    const user = await User.findById(req.user._id);
    console.log(user);
    

    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if(!isMatch){
      return res.status(401).json({
        success: false,
        message: "Invalid old password"
      });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { register, login, logout, forgotPassword, resetPassword, changePassword, verifyOTP };

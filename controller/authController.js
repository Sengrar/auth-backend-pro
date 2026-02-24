const User = require("../model/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if(!name || name.length<3){
      return res.status(400).json({
        success:false,
        message:"Name field is required and must be contain atleast 3 charachter"
      })
    }

        if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"all fields are required"
      })
    }

    let passRegex = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/


 if(!passRegex.test(password)){
return res.status(400).json({
        success:false,
        message:"8 characters length,2 letters in Upper Case,1 Special Character (!@#$&*),2 numerals (0-9),3 letters in Lower Case"
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
        if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"all fields are required"
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

    res.cookie("token",token,{
      httpOnly:true
    })

    res.status(200).json({
      success:true,
      message:"User Login Successfully"
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports = { register, login };

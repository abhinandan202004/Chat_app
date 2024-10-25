import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords don't match",
      });
    }
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        error: "User Name Already exists",
      });
    }

    //password hashing

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password:hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    
  if(newUser){
    // generate JWT token
    generateTokenAndSetCookie(newUser._id,res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
    });
  } else {
    res.status(400).json({error: "Invalid user Data"});
  }
  
  }catch (error) {
    console.log("error in signup Controller", error.message);
    res.status(500).json({
      error: "Internal server error ",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt",{maxAge:0})
    res.status(200).json({message: "Logged out Succesfully"});
  } catch (error) {
    console.error("Error in login Controller:", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid Username or Password" });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "error" });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, res);

    // Respond with user details
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });

  } catch (error) {
    console.error("Error in login Controller:", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};


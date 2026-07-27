const cloudinary = require("../config/cloudery");
const User = require("../model/userSchema");

const register = async (req, res, next) => {
  try {

    
    const {
      name,
      role,
      phoneNumber,
      email,
      profileImage,
      password,
      checkInLimit,
    } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const uploadResult = await cloudinary.uploader.upload(profileImage, {
      folder: "user_profiles",
      public_id: `${name}_profile_${Date.now()}`,
    });

    const userCreate = await User.create({
      name,
      role,
      phoneNumber,
      password,
      email,
      checkInLimit,
      profileImage: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
    });
     
    res.status(200).json({
      message: "registration Sucessful",
      token : await userCreate.generateToken(),
      userId: userCreate._id.toString(),
    });
  } catch (error) {
 console.log(error);
 
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validemail = await User.findOne({ email });

    if (!validemail) {
      return res.status(401).json({ message: "Unauthorized email" });
    }

    const compare = await validemail.comparePassword(password);

    if (!compare) {
      return res.status(401).json({ message: "Invalid password" });
    }

  

    // Cookie set karo
 

 const token = await validemail.generateToken();

res.cookie("token", token, {
  httpOnly: true,
  secure: true,        
  sameSite: "None",     
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

return res.status(200).json({
  message: "Login Successful",
  userId: validemail._id.toString(),
});
  } catch (error) {
    console.log(error);

  }
};



const user = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const getuser = await User.findById(loggedInUser._id).select("-password");
  
    res.status(200).json({ user: getuser });
  } catch (error) {
    console.error("User route error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const checkIn = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Current time in Karachi
    const now = new Date();
    const currentTimeInKarachi = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Karachi" })
    );

    const checkInTimeDisplay = currentTimeInKarachi.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Validate checkInLimit existence
    if (!user.checkInLimit) {
      return res.status(400).json({ message: "Check-in limit is not set for this user" });
    }

    let limitHours, limitMinutes;

    // Regex for 12-hour format (AM/PM)
    const match12 = user.checkInLimit.match(/(\d{1,2}):(\d{2})\s?(AM|PM|am|pm)/);
    // Regex for 24-hour format
    const match24 = user.checkInLimit.match(/^(\d{1,2}):(\d{2})$/);

    if (match12) {
      // Extract 12-hour format
      limitHours = parseInt(match12[1], 10);
      limitMinutes = parseInt(match12[2], 10);
      let period = match12[3].toUpperCase();

      if (period === "PM" && limitHours !== 12) limitHours += 12;
      if (period === "AM" && limitHours === 12) limitHours = 0;

    } else if (match24) {
      // Extract 24-hour format
      limitHours = parseInt(match24[1], 10);
      limitMinutes = parseInt(match24[2], 10);

    } else {
      return res.status(400).json({
        message: "Invalid check-in limit format. Expected HH:MM AM/PM or HH:MM (24h)",
      });
    }

    // Create limit time in Karachi's timezone
    const checkInLimitDate = new Date(currentTimeInKarachi);
    checkInLimitDate.setHours(limitHours, limitMinutes, 0, 0);

    const isLate = currentTimeInKarachi > checkInLimitDate;
    const status = isLate ? "Late" : "On Time";

    // Prevent multiple check-ins in same day
    const todayDate = currentTimeInKarachi.toISOString().split("T")[0];
    const alreadyCheckedIn = user.attendanceHistory.some((entry) => {
      const entryDate = new Date(entry.date).toISOString().split("T")[0];
      return entryDate === todayDate;
    });

    if (alreadyCheckedIn) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    // Save attendance
    user.attendanceHistory.push({
      date: now,
      status,
      checkInTime: checkInTimeDisplay,
      checkOutTime: null,
    });

    user.totalAttendance += 1;
    user.checkInTime = checkInTimeDisplay;

    await user.save();

    res.status(200).json({
      message: "Check-in successful",
      checkInTime: checkInTimeDisplay,
      status,
    });
  } catch (error) {
    console.error("Check-in Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const cheakout = async (req, res) => {
  try {
    const userid = req.user._id;
    const user = await User.findById(userid);

    const today = new Date();
    let hours = today.getHours();
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    const formattedHours = String(hours).padStart(2, "0");

    const currentTime = `${formattedHours}:${minutes} ${ampm}`;
    const todayDate = today.toISOString().split("T")[0];

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

const options = {
  timeZone: "Asia/Karachi", 
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};
  const cheakoutTime = today.toLocaleString("en-US", options)
  
    const todayAttendance = user.attendanceHistory.find((a) => {
      const d = new Date(a.date).toISOString().split("T")[0];
      return d === todayDate && a.checkOutTime === null;
    });

    if (!todayAttendance) {
      return res.status(400).json({ message: "No valid check-in found or already checked out" });
    }

    todayAttendance.checkOutTime = cheakoutTime;
    user.checkOutTime = cheakoutTime
    user.markModified("attendanceHistory");

    await user.save();

    res.status(200).json({
      message: "Check-out successful",
      checkOutTime: cheakoutTime,
      attendanceHistory: user.attendanceHistory,
    });
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = { register, login, user, checkIn, cheakout,};

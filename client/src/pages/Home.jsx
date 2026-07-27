import { useState, useEffect } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../components/ui/button"

import { Card, CardContent } from "../components/ui/Card"




import { Badge } from "../components/ui/badge"


import { toast } from "react-toastify"
import {
  Calendar,
  Clock,
  LogOut,
  Phone,
  Mail,

} from "lucide-react"
import { useAuth } from "@/store/useAuth"

import { useNavigate } from "react-router-dom"
import { NavLink } from "react-router-dom"

export default function Home() {
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
const { user, setUser, } = useAuth();

const {isLogin} = useAuth()




useEffect(() => {
  if (user?.attendanceHistory?.length > 0) {
    const latest = user.attendanceHistory[user.attendanceHistory.length - 1] 
    setIsCheckedIn(!latest.checkOutTime)   
  }
}, [user])





  const handleCheckIn = async () => {
    try {
      const response = await fetch("https://mern-projects-oj9w.onrender.com/cheakin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
 const data = await response.json()
if (response.ok) {
  toast.success(data.message || "Cheaked in sucessfuly");

setUser((prevUser) => ({
  ...prevUser,
  checkInTime: data.checkInTime,
  attendanceHistory: data.attendanceHistory || prevUser.attendanceHistory
}));


  setIsCheckedIn(true); 
} else {
  toast.error("Already checked in today");
}
    } catch (error) {
      console.log(error)
    }
  }


const navigate = useNavigate();

useEffect(() => {
  if (!isLogin) {
    navigate("/home"); 
  }
}, [user, navigate]);




  const handleCheckOut = async () => {
    try {
      const response = await fetch("https://mern-projects-oj9w.onrender.com/cheakout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const cheakdata = await response.json()
           toast.success(cheakdata.message || "Cheakout sucessfully")
      
setUser((prevUser) => ({
  ...prevUser,
  checkOutTime: cheakdata.checkOutTime,
  attendanceHistory: cheakdata.attendanceHistory || prevUser.attendanceHistory
}));
             setIsCheckedIn(false)

      }else{
          toast.error(cheakdata.message || "Already checked out today")
      }
    } catch (error) {
      console.log(error)
    }
  }



  const toggleCheckInOut = () => {
    if (isCheckedIn) {
      handleCheckOut()
    } else {
      handleCheckIn()
    }
  }

  

  return (
    <div className="w-full min-h-screen bg-[#111315] text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#6af0ca] rounded-full"></div>
          <h2 className="text-xl font-semibold">{user ? user.name : "Guest"}</h2>
        </div>
        <div className="flex items-center gap-3">
         <Button
          onClick={toggleCheckInOut}
      className={`${
        isCheckedIn
          ? "bg-red-600 hover:bg-red-700 border-red-600"
          : "bg-green-600 hover:bg-green-700 border-green-600"
      } text-white`}
    >
      <Clock className="w-4 h-4 mr-2" />
      {isCheckedIn ? "Check Out" : "Check In"}
    </Button>

          <NavLink  to="/logout" >

          <Button variant="outline" className="bg-[#292C2D] hover:bg-red-700 border-red-600 text-white">
            <LogOut className="w-4 h-4 mr-2 " />
            Log Out
          </Button>
          </NavLink>
        </div>
      </div>

      {/* Employee Profile */}
      <Card className="bg-[#92c2d] border-none mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-30 h-30">
            <AvatarImage
  src={user?.profileImage?.url || "/placeholder.svg"}
  alt={user?.profileImage?.public_id || "Profile Image"}
  className="object-cover w-full h-full"
/>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-4 text-white">{user ? user.name : "Guest"}</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Role</p>
                  <p className="text-white font-medium">{user?.role || "N/A"}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone Number</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-white font-medium">{user?.phoneNumber || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Email Address</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-white font-medium">{user?.email || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#292C2D] border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-700 rounded-lg">
                <LogOut className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{user?.totalAttendance || 0}</p>
                <p className="text-gray-400 text-sm">Total Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#292C2D] border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 ">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{user?.checkInTime || "N/A"}</p>
                <p className="text-gray-400 text-sm">Avg Check In Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#292C2D] border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#404040] rounded-lg">
                <Clock className="w-5 h-5 text-white bg-[#3c3e40]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{user?.checkOutTime}</p>
                <p className="text-gray-400 text-sm">Avg Check Out Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#292C2D] border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#404040] rounded-lg">
                <Calendar className="w-5 h-5 text-white bg-[#3c3e40]" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Role Model</p>
                <p className="text-gray-400 text-sm">Employee Predicate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-cyan-400 rounded-full"></div>
            <h2 className="text-2xl font-semibold">Attendance History</h2>
          </div>

          
        </div>

        {/* Attendance Records */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
  {user?.attendanceHistory
    ?.slice()
    .reverse() // Latest records sabse pehle
    .slice(0, 6)
    .map((record, index) => (
      <Card key={index} className="bg-[#292c2d] border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-white font-medium">
  {new Date(record.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}
</span>
            <Badge
              className={`ml-auto ${
                record.status === "On Time"
                  ? "bg-green-500 text-[#000000]"
                  : record.status === "Late"
                    ? "bg-red-500"
                    : "bg-red-500"
              } `}
            >
              {record.status}
            </Badge>
          </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Check In Time</p>
                    <p className="text-white font-medium">{record.checkInTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Check Out Time</p>
                    <p className="text-white font-medium">{record.checkOutTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
      </div>
    </div>
  )
}

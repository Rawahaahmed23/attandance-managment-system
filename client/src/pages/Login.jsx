
import { useState } from "react"
import { toast } from "react-toastify"
import { HexagonBackground } from "@/components/animate-ui/backgrounds/hexagon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import {useAuth} from '../store/useAuth'
import { useNavigate } from "react-router-dom"

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  })

 
const { setUser,saveToken} = useAuth();
  const Navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }


  
  const handleInput = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("https://mern-projects-oj9w.onrender.com/login", {
        method: "POST",
      headers: {
  'Content-Type': 'application/json'
},
         credentials: 'include', 
        body: JSON.stringify(data),
      })
      

      const responseData = await response.json() 
      

      if (response.ok) {
        setUser(responseData)
    
            saveToken(responseData.token)
        Navigate("/home")

      setTimeout(() => {
        window.location.reload()
      }, 100) // slight delay to allow navigation before reload
      toast.success(responseData.message || "Login successful")
 
 
     Navigate('/home')
    
  
      } else {
        toast.error(responseData.message || responseData.extraDetails)
      }
    } catch (error) {
     
      console.error("Login error:", error)
      } finally {
        setIsLoading(false)
      }
  }

  

  return (
<div className="relative w-screen h-screen flex items-center justify-center overflow-hidden">

      <HexagonBackground className="absolute inset-0 z-0 bg-gray-900" />

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">Enter your credentials to access your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleInput} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={handleChange}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login

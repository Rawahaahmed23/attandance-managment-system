
import { BrowserRouter,Routes,Route } from 'react-router-dom' 
import  Register from "./pages/Register"
import Login from './pages/Login'
import Home from './pages/Home'
import { UserProvider } from './store/useAuth'
import Logout from './pages/Logout'
import Admin from './pages/admin'

function App() {
  return (
       <UserProvider> 
    <BrowserRouter>
     <Routes>
   <Route path="/" element={<Register />} />
   <Route path="/login" element={<Login />} />
   <Route path="/logout" element={<Logout />} />
   <Route path='/admin' element={<Admin />}></Route>

   <Route path="/home" element={<Home />} />
     </Routes>
   
    </BrowserRouter>
        </UserProvider>
  )
}

export default App

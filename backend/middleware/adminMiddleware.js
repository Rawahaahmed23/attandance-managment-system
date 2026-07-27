const adminMiddleware = async(req, res,next)=>{
    try{
        const user = req.user.isAdmin
    
  if (!user) {
      return res.status(403).json({ msg: "Access Denied: User is not admin" });
    }

    next();
    }catch(error){
      return next(error)
    }
}

module.exports = adminMiddleware
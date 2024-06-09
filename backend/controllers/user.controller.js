export const updateUser = async(req,res,next)=>{
    if(req.user._id !== req.params.id){
        return next(errorHandler(403,"You can only update your account"))
    }
}
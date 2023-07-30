exports.isAuthenticated = (req,res,next) => {
    if(req.session.user){
        next()
    }else{
        req.flash('err' , "You must be logged in for this!")
        req.session.save(()=> res.redirect('/'))
    }
}
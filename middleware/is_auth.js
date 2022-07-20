module.exports=(req,res,next)=>{
  console.log('inside');
    if(!req.session.isLoggedIn)
    {
      return res.redirect('/login');
    }
    next();
}
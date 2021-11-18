module.exports={
    isLoggedInUsuario(req,res,next){
        if (req.isAuthenticated() && req.user.tipo=='U'){
            return next()
        }
        return res.redirect('/signin')
    },

    isLoggedInAdm(req,res,next){
        if (req.isAuthenticated() && req.user.tipo=='A'){
            return next()
        }
        return res.redirect('/')
    },

    isLoggedInEmp(req,res,next){
        if (req.isAuthenticated() && req.user.tipo=='E'){
            return next()
        }
        return res.redirect('/signin')
    },

    isNotLoggedIn(req,res,next){
        if (!req.isAuthenticated()){
            return next()
        }
        return res.redirect('/profile')
    }
}
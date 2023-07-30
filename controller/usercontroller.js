const user = require('../model/User')

exports.register = (req,res)=>{
    console.log(req.body)
    let person = new user(req.body)
    person.register().then(()=>{
        req.session.user = {username: person.data.username , avatar: person.avatar , _id: person.data._id }
        req.session.save(()=>res.redirect('/'))
    }).catch(err =>{
        err.forEach(element => {
            req.flash('Regerr',element)
        });
        req.session.save(()=>res.redirect('/'))
        // console.log("There's an error!");
    })
    // res.send("WE ARE REGISTERING YOU!\n");
}

exports.login = (req,res)=>{
    console.log(req.body)
    let person = new user(req.body)
    person.login().then((result)=>{
        req.session.user = {username: person.data.username , avatar: person.avatar, _id: person.data._id}
        req.session.save(()=>res.redirect('/'))
    }).catch(err =>{
        req.flash('error',err)
        req.session.save(()=>res.redirect('/'))
    })
}

exports.logout = (req,res)=>{
    req.session.destroy(()=>res.redirect('/'))
}

exports.home = (req, res)=>{
    if(req.session.user){
        res.render('home-logged-in-no-results')
    }else{
        res.render('home-guest', {err: req.flash('error'), Regerr: req.flash('Regerr')})
    }
}
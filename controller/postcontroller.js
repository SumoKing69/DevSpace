const post_model = require('../model/Post')

exports.view = (req,res) => {
    res.render('create-post')
}

exports.create = (req,res) =>{
    console.log(req.body)
    let Post = new post_model(req.body,req.session.user._id)
    Post.create().then(()=>{
        res.send("New Post created!\n")
    }).catch(err =>{
        res.send(err)
    })
}
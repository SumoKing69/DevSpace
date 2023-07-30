const MongoDB_users = require('../db').db().collection("user_posts")
const ObjectID = require("mongodb").ObjectId

let post = function(data,userId){
    this.data = data
    this.errors = []
    this.userId = userId
}

post.prototype.cleanup = function(){
    if(typeof(this.data.title) != "string"){this.data.title = ""}
    if(typeof(this.data.body) != "string"){this.data.body = ""}

    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date(),
        author: ObjectID(this.userId)
    }
}

post.prototype.validate = function(){
    if(this.data.title == ""){this.errors.push("you must provide a title")}
    if(this.data.body == ""){this.errors.push("you must provide a body")}
}

post.prototype.create = function(){
    return new Promise((resolve, reject)=>{
        this.cleanup()
        this.validate()
        if(!this.errors.length){
            MongoDB_users.insertOne(this.data).then(data=>{
                console.log(data)
                resolve("post created!!")
            }).catch(()=>{
                this.errors.push("please try again later..")
                reject(this.errors)
            })
        }else{
            reject(this.errors)
        }
    })
}

module.exports = post
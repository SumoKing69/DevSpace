const MongoDB_users = require('../db').db().collection("users")
const bcrypt = require('bcryptjs')
const validator = require('validator')
const md5 = require('md5')

let User = function(data){
    this.data = data
    this.err = []
}

User.prototype.redudancy_clean = function(){
    if (typeof(this.data.username) != "string") {this.data.username = ""}
    if (typeof(this.data.email) != "string") {this.data.email = ""}
    if (typeof(this.data.password) != "string") {this.data.password = ""}

    // get rid of bogus property
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        profile: this.data.profile,
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function(){
    // Validating the information
    return new Promise(async (resolve,reject) => {

    if (this.data.username == "") {this.err.push("You must provide a username.")}
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.err.push("Username can only contain letters and numbers.")}
    if (!validator.isEmail(this.data.email)) {this.err.push("You must provide a valid email address.")}
    if (this.data.password == "") {this.err.push("You must provide a password.")}
    if (this.data.password.length > 0 && this.data.password.length < 6) {this.err.push("Password must be at least 6 characters.")}
    if (this.data.password.length > 50) {this.err.push("Password cannot exceed 50 characters.")}
    if (this.data.username.length > 0 && this.data.username.length < 3) {this.err.push("Username must be at least 3 characters.")}
    if (this.data.username.length > 30) {this.err.push("Username cannot exceed 30 characters.")}

    if(this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)){
        let usernameExist = await MongoDB_users.findOne({username: this.data.username})
        if(usernameExist) {this.err.push("Username already exists.")}
    }

    if(validator.isAlphanumeric(this.data.email)){
        let emailExist = await MongoDB_users.findOne({email: this.data.email})
        if(emailExist) {this.err.push("Email already exists")}
    }
    resolve();
    })
}

User.prototype.register = function(){
    return new Promise(async (resolve,reject)=>{
        await MongoDB_users.insertOne(this.data)
        this.redudancy_clean();
        await this.validate();
        if(!this.err.length){
            let ans = bcrypt.genSaltSync();
            this.data.password = bcrypt.hashSync(this.data.password,ans)
            await MongoDB_users.insertOne(this.data)
            resolve()
        }
        else{
            reject(this.err)
        }
    })
}

User.prototype.login = function(){
    return new Promise((resolve,reject) => {
        this.redudancy_clean();
        MongoDB_users.findOne({username:this.data.username}).then(attemptedUser=>{
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)){
                this.data = attemptedUser
                resolve("Login Successful!");
            }
            else{
                reject("Invalid Username or Password!");
            }
        }).catch(err =>{
            reject("Please enter correct credentials!\n");
        })
    })
}


module.exports = User
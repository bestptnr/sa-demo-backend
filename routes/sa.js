const express = require("express");
const router = express.Router();
var mysql = require("mysql");
const bcrypt = require('bcryptjs')
const session = require("express-session")

let dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sa'
});

dbConn.connect();

router.post('/resgister',async (req,res)=>{
    const salt = await bcrypt.genSalt()
    const hashpassword = await bcrypt.hash(req.body.password,salt)
    console.log(hashpassword)
})
router.post('/getUser',async (req,res)=>{
    const code = req.body.std_code
    await dbConn.query(`
    SELECT student.std_code,student.fullname,teacher.fullname as "teachname",subject.subj_name
    FROM classroom
    INNER JOIN student ON (classroom.std_id=student.std_code)
    INNER JOIN subject ON (classroom.subject_id=subject.subj_id)
    INNER JOIN teacher ON (classroom.Teacher_id=teacher.Teacher_id)                        
     WHERE std_code="${code}"`, async(error,results)=>{    
        console.log(results)
        return  res.send(results)
    })
})
router.post('/login',async (req,res)=>{
    // check is email exits
    let userData = {}
    const email = req.body.email
    await dbConn.query(`SELECT * FROM student WHERE email="${email}"`, async(error,results)=>{     
        userData = results
        const vaildpassword = await bcrypt.compare(req.body.password,results[0].password)
        if(!vaildpassword) return res.status(404).send("Invalid Email or password")
    
        return await res.send(userData[0])
    })
    
    
    // return res.send(user)
    // if(!user) return res.status(404).send("User is not registered")
    // //check if password correct

    // //assign token
    // const token = jwt.sign({_id:user.id,email:user.email},"SUPERSECRET123")
    // res.header('auth-token',token).send({msg:"Login Successfully",token})
})
module.exports = router;
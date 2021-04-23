const express = require("express");
const app = express();
const path = require("path");
require("./db/conn");
const  Register = require("./models/register"); 

const port = process.env.PORT || 3031;

const static_path = path.join(__dirname, "../public");
//console.log(path.join(__dirname,"../public"));
app.use(express.static(static_path));

app.get("/index.html",(req,res)=> {
  res.sendFile(static_path);
});



app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.post('/process_post', async (req, res)=>{
  // Prepare output in JSON format
  try{
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    
    if(password === cpassword){
      
      const userdata = new Register({
      username:req.body.username,
      email:req.body.email,
      password:req.body.password,
      confirmpassword:req.body.confirmpassword
   })


   const registered = await userdata.save();
   res.status(201).sendFile(static_path+"/index.html");

  }else{
    res.send("password mismatched")
  }
  
 
  }catch(error){
    res.status(400).send(error);
  }
  
   
})

app.get("/login",(req,res)=> {
  res.render("index");
});


app.post('/login', async (req, res)=>{
  // login checking
  try{
    const email = req.body.email;
    const password = req.body.password;
    
    const logincheck = await Register.findOne({email:email});
    
    if(logincheck.password === password){
      res.status(201).sendFile(static_path+"/homepage.html");
    }
    else{
      res.send("Invalid Login Credentials");
    }
  }catch(error){
    res.status(400).send("Invalid Email");
  }
})

app.listen(port, ()=>{
  console.log(`server is running at port no ${port}`);
});


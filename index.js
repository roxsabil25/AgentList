const express = require("express");
const app = express();
const path = require("path");

const teamModel = require("./models/team");
const adminModel = require("./models/admin");
const upload = require('./config/multerConfig')
var jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");



// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

app.get("/agent", async (req, res) => {
  try {
        const agents = await teamModel.find({}).lean(); // DB থেকে সব member fetch
        res.render("masterAgent", { agents });
        console.log(agents);
        
    } catch (err) {
        console.log(err);
        res.send("Error loading agents");
    }
});

app.get("/team/member/create",requireLogin , async (req, res) => {

  try {
        const agents = await teamModel.find({}).lean(); // DB থেকে সব member fetch
        res.render("memberCreate", { agents });
        
        
    } catch (err) {
        console.log(err);
        res.send("Error loading agents");
    }

 
});



app.post("/team/member/create", upload.single("img"), async (req, res) => {

try {
    
const {
      name,
      title,
      sName,
      experience,
      facbook,
      whatsapp,
      massenger
     } = req.body;
    const img = req.file ? `/uploads/teamProfile/${req.file.filename}` : null;


    let newMember = await teamModel.create({
      name,
      title,
      sName,
      experience,
      facbook,
      whatsapp,
      massenger,
      img
    });
    res.redirect("/team/member/create")

  } catch (error) {
    console.error("❌ Error adding member:", error);
    res.status(500).send("Failed to add team member!");
  }
 
});


app.get("/edit/:id", async (req, res) => {
let member = await teamModel.findById(req.params.id );
console.log(member);

 res.render("editMember",{member})
});

app.post("/team/member/update/:id", upload.single("img"), async (req, res) => {
  try {
    const { name, title, sName, experience, facbook, whatsapp, massenger } = req.body;

    const updateData = { name, title, sName, experience, facbook, whatsapp, massenger };
    if (req.file) {
      updateData.img = `/uploads/teamProfile/${req.file.filename}`;
    }

    await teamModel.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/team/member/create");
  } catch (err) {
    console.error("❌ Error updating member:", err);
    res.status(500).send("Update failed");
  }
});


app.get("/delete/:id", async (req, res) => {
  try {
    const deleteMember = await teamModel.findByIdAndDelete(req.params.id);

    if (!deleteMember) {
      return res.status(404).send("❌ Member not found!");
    }

    console.log("🗑️ Deleted Member:", deleteMember);

    // Redirect to main page (optional)
    res.redirect("/team/member/create"); 
    // or: res.send(deleteMember);
  } catch (error) {
    console.error("❌ Error deleting member:", error);
    res.status(500).send("Failed to delete team member!");
  }
});

app.get("/super" , async (req,res)=>{

    let agents= await teamModel.find({title: 'super'});

    res.render("masterAgent",{agents})
});

app.get("/sub/admin" , async (req,res)=>{

    let agents= await teamModel.find({title: 'sub-admin'});

    res.render("masterAgent",{agents})
});

app.get("/admin" ,  async (req,res)=>{

    let agents= await teamModel.find({title: 'admin'});

    res.render("masterAgent",{agents})
});

app.get('/signup/admin', async (req,res)=>{
  let admin=  await adminModel.create({

      pass:'rox#00%@',
      number:"01842197833",
      name:'rox'

    })
    res.send(admin)

});

app.get("/login/admin" , async (req,res)=>{

    res.render("adminlogin")

});

app.post("/login/admin" , async (req,res)=>{
   const { name, pass } = req.body;
  try {
    const user = await adminModel.findOne({ name, pass });

    if (user) {
      
      let token = jwt.sign({userid: user._id }, "rox");
                   res.cookie("token", token)
                   res.redirect('/team/member/create')
    } else {
      res.send(`<h2 style="text-align:center; color:red;">Invalid name or password</h2>`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});




// secure middleware for user is loging Or not 

async function requireLogin(req, res, next) {
    const token = req.cookies.token; // cookie থেকে token নাও
    
    
    if (!token) {
        return res.redirect("/login/admin"); // login না থাকলে redirect
    }

    try {
        const decoded = jwt.verify(token, "rox"); // token verify

        const user = await adminModel.findById(decoded.userid).lean(); // DB থেকে user fetch
        if (!user) return res.redirect("/login/admin");
        req.user = user; // middleware এ user attach
        next();
    } catch (err) {
        console.log(err);
        return res.redirect("/login/admin");
    }
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));






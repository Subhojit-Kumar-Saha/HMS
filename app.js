var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    User                  = require("./model/user"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride        = require("method-override");


    app.use(require("express-session")({
        secret: "This is my project",
        resave: false,
        saveUninitialized: false
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride('_method'));
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/hms", {useNewUrlParser: true});

var doctorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    mobile: Number,
    degree: String,
    speciality: String,
    sex: String,
    address: String,
    days: String,
    time: String
});


var Doctor = mongoose.model("Doctor", doctorSchema);

var patientSchema= new mongoose.Schema({
   name: String,
   guardian: String,
   mobile: Number,
   age: Number,
   address: String,
   email: String,
   gender: String,
   city: String,
   state: String,
   nationality: String,
   birthday_day: Number,
   birthday_month: String,
   birthday_year: Number
});

var Patient = mongoose.model("Patient", patientSchema);

var appointmentSchema = new mongoose.Schema({
   name: String,
   email: String,
   mobile: Number,
   address: String,
   notes: String,
   radio: String,
   checkbox: String,
   checkboxtime: String
});

var Appointment = mongoose.model("Appointment", appointmentSchema);

var reportSchema = new mongoose.Schema({
    name: String,
    admit: Date,
    discharge: Date,
    days: Number,
    treat1: String,
    treat2: String,
    treat3: String,
    treat4: String,
    treat5: String,
    otreat: String,
    symp1: String,
    symp2: String,
    symp3: String,
    symp4: String,
    symp5: String,
    osymp: String,
    diag1: String,
    diag2: String,
    diag3: String,
    diag4: String,
    odiag: String,
    comment: String
    
});

var Report = mongoose.model("Report", reportSchema);

app.get("/", function(req, res){
    res.render("user.ejs");
});

app.get("/register", function(req, res){
    res.render("register.ejs"); 
 });
 app.post("/register", function(req, res){
     User.register(new User({username: req.body.username}), req.body.password, function(err, user){
         if(err){
             console.log(err);
             return res.render("register.ejs");
         }
         passport.authenticate("local")(req, res, function(){
            res.redirect("/home");
         });
     });
 });

app.get("/login", function(req, res){
   res.render("login.ejs"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.get("/patients/patientreg", function(req, res){
   res.render("patientreg.ejs"); 
});



app.get("/about", function(req, res){
   res.render("about.ejs");
});

app.get("/doctors/doctorreg", function(req, res){
   res.render("doctorreg.ejs"); 
});

app.get("/appointment", function(req, res){
   res.render("appointment.ejs"); 
});

app.get("/userappoint", function(req, res){
    res.render("userappoint.ejs");
})

app.get("/home", isLoggedIn, function(req, res){
   res.render("home.ejs");
});

//DOCTORS

app.post("/doctors", function(req, res){
    
    //get data from form
    var name = req.body.name;
    var age = req.body.age;
    var mobile = req.body.mobile;
    var sex = req.body.sex;
    var degree = req.body.degree;
    var speciality = req.body.speciality;
    var days = req.body.days;
    var time = req.body.time;
    var address = req.body.address;
    
    var newDoctor = {name: name, age: age, mobile: mobile, sex: sex, degree: degree, speciality: speciality, days: days, time: time, address: address};
    
    //create a new doctor and save it to db
    
    Doctor.create(newDoctor, function(err, newCreated){
        if(err){
            console.log("Error Occurred");
            console.log(err);
            
        }
        else{
            res.redirect("/doctors");
        }
    });
});



//Show all doctors
app.get("/doctors", function(req, res){
   Doctor.find({},function(err, allDoctors){
       if(err){
           console.log(err);
       }
       else{
           res.render("doctors.ejs", {doctor:allDoctors});
       }
   }); 
});


//PATIENTS 

app.post("/patients", function(req, res){
    
    var name = req.body.name;
    var guardian = req.body.guardian;
    var mobile = req.body.mobile;
    var age = req.body.age;
    var address = req.body.address;
    var email = req.body.email;
    var gender = req.body.gender;
    var city = req.body.city;
    var state = req.body.state;
    var nationality = req.body.nationality;
    var birthday_day = req.body.birthday_day;
    var birthday_month = req.body.birthday_month;
    var birthday_year = req.body.birthday_year;
    
    var newPatient = {name: name, guardian: guardian, mobile: mobile, age: age, address: address, email: email, gender: gender, city: city, state: state, nationality: nationality, birthday_day: birthday_day, birthday_month: birthday_month, birthday_year: birthday_year};
    
    
    Patient.create(newPatient, function(err, newCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/patients");
        }
    });
});

app.get("/patients", function(req, res){
   Patient.find({}, function(err, allPatient){
       if(err){
           res.render("home.ejs");
       }
       else{
           res.render("patients.ejs", {patient: allPatient});
       }
   });
});


app.post("/patshow", function(req, res){
   Patient.find({'name': req.body.name}, function(err, showPatient){
       if(err){
           
           res.render("home.ejs");
       }
       else{
           res.render("patshow.ejs", {searchpat: showPatient});
       }
   }); 
});

app.get("/patsearch", function(req, res){
    res.render("patsearch.ejs");

});


app.delete("/patshow/:id", function(req, res){
    Patient.findById(req.params.id, function(err, pat){
        if(err){
            console.log(err);
        } else {
            pat.remove();
            res.redirect("/patients");
        }
    }); 
 });

 app.get("/patshow/:id/edit", function(req, res){
    Patient.findById(req.params.id, function(err, pat){
        if(err){
            console.log(err);
            res.redirect("/home");
        }
        else{
            res.render("patedit.ejs", {pat: pat});
        }
    });
 });

 app.put("/patshow/:id", function(req, res){
    Patient.findByIdAndUpdate(req.params.id, req.body, function(err, pat){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/patients");
        }
    })
 });
//Appointments


app.post("/apoview", function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var address = req.body.address;
    var notes = req.body.notes;
    var radio = req.body.radio;
    var checkbox = req.body.checkbox;
    var checkboxtime = req.body.checkboxtime;
    
    var newAppoint = {name: name, email: email, mobile: mobile, address: address, notes: notes, radio: radio, checkbox: checkbox, checkboxtime: checkboxtime};
    
    Appointment.create(newAppoint, function(err, newCreated){
        if(err){
            res.render("appointment.ejs");
        }
        else{
            res.redirect("/apoview");
        }
    });
});

app.post("/", function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var address = req.body.address;
    var notes = req.body.notes;
    var radio = req.body.radio;
    var checkbox = req.body.checkbox;
    var checkboxtime = req.body.checkboxtime;
    
    var newAppoint = {name: name, email: email, mobile: mobile, address: address, notes: notes, radio: radio, checkbox: checkbox, checkboxtime: checkboxtime};
    
    Appointment.create(newAppoint, function(err, newCreated){
        if(err){
            res.render("userappoint.ejs");
        }
        else{
            res.redirect("/");
        }
    });
});

app.get("/apoview", function(req, res){
    Appointment.find({}, function(err, allAppoint){
        if(err){
            res.render("appointment.ejs");
        }
        else{
            res.render("apoview.ejs", {appoint: allAppoint});
        }
    });
});


app.get("/contact", function(req, res){
   res.render("contact.ejs"); 
});




//REPORTS

app.get("/report", function(req, res){
    res.render("report.ejs");
});
app.post("/allreport", function(req, res){
    var name = req.body.name;
    var admit = req.body.admit;
    var discharge = req.body.discharge;
    var days = req.body.days;
    var treat1 = req.body.treat1;
    var treat2 = req.body.treat2;
    var treat3 = req.body.treat3;
    var treat4 = req.body.treat4;
    var treat5 = req.body.treat5;
    var otreat = req.body.otreat;
    var symp1 = req.body.symp1;
    var symp2 = req.body.symp2;
    var symp3 = req.body.symp3;
    var symp4 = req.body.symp4;
    var symp5 = req.body.symp5;
    var osymp = req.body.osymp;
    var diag1 = req.body.diag1;
    var diag2 = req.body.diag2;
    var diag3 = req.body.diag3;
    var diag4 = req.body.diag4;
    var odiag = req.body.odiag;
    var comment = req.body.comment;

    var newReport = {name: name, admit: admit, discharge: discharge, days: days, treat1: treat1, treat2: treat2, treat3: treat3, treat4: treat4, treat5: treat5, otreat: otreat, symp1: symp1, symp2: symp2, symp3: symp3, symp4: symp4, symp5: symp5, osymp: osymp, diag1: diag1, diag2: diag2, diag3: diag3, diag4: diag4, odiag: odiag, ch: ch, comment: comment};

    Report.create(newReport, function(err, newCreated){
        if(err){
            res.render("report.ejs");
        }
        else{
            res.redirect("/allreport");
        }
    });
});

app.get("/allreport", function(req, res){
    Report.find({}, function(err, showAll){
        if(err){
            console.log(err);
            res.render("home.ejs");
        }
        else{
            res.render("allreport.ejs", {showrep: showAll});
        }
    })
})

app.get("/reportsearch", function(req, res){
    res.render("reportsearch.ejs");
});

app.post("/reportview", function(req, res){
    Report.find({'name': req.body.name}, function(err, showReport){
        if(err){
            res.render("reportsearch.ejs");
        }
        else{
            res.render("reportview.ejs", {searchrep: showReport});
        }
    });
}); 




//PORT
app.listen(3000, function(){
    console.log("Server has been started");
});
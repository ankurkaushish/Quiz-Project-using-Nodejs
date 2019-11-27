const express = require('express');
const path = require('path');
var app = express();
const user = require('./database/model').Usermodel;
const question = require('./database/model').Questionmodel;
const answer = require('./database/model').Answermodel;
const Score = require('./database/model').Scoremodel;
app.use(express.json())
const BodyParser = require('body-parser')
app.use(BodyParser.json())
var urlencodedParser = BodyParser.urlencoded({ extended: false })
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Quiz",{useNewUrlParser: true , useUnifiedTopology:true})
.then(()=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log("Error in database ", err);
})

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');


app.get('/',(req,res)=>{

res.sendfile("form.html");
 
});

app.get('/login',(req,res)=>{
    res.sendfile("form1.html");
})

app.post('/editques',(req,res)=>{
   
    question.find({},(err,ques)=>{

        res.render('editques',{
            ques : ques
        })
    })

})

app.post('/editques/:qid',(req,res)=>{
   
    question.findOneAndDelete({_id:req.params.qid},(err)=>{
         if(err)
         console.log(err);

         else{
             res.redirect('/admin');
         }
    })

})



app.get('/admin',(req,res)=>{
    res.sendfile("quizpage.html");
})

app.get("/quiz123/:userid",async (req,res)=>{
    //  var ar=[] ;
    //   ar = question.find({});
    //   const questions = await question.find({});

    //  res.send(questions);
    const name = user.findOne({_id:req.params.userid},(err,data)=>{
        if(err)
        console.log(err);

        else{
            
       



     Score.findOne({userid:req.params.userid},(err,sco)=>{
         if(err)
         console.log(err);

         else{
            //console.log(sco.total);
        

              question.find({},(err,arr)=>{
                if(err)
                console.log(err)
      
                else{


                    res.render('viewques',{
                        array :arr ,
                        total : sco.total,
                        userid:req.params.userid ,
                        name :data.Name
                    })
                
                }
            
            });
        

         }
    });
    
}
        
})


});


app.get('/quiz123/:userid/ques/:id',async(req,res)=>{
     
   await question.findById(req.params.id ,(err , q)=>{
       
    res.render('viewfull.pug',{
        q:q ,
        userid : req.params.userid
          
    })
   })

    
});
app.get('/quiz123/:userid/question/:id',async (req,res)=>{

    question.findById(req.params.id , (err,s)=>{
        if(err)
        console.log(err);

        else{
            if(s.ans===req.query.response)
            {
                  Score.findOne({userid:req.params.userid}, (err ,score)=>{
                      
                      const new_score = {};
                      new_score.total = score.total+1;
                      Score.update({userid:req.params.userid},new_score,function(err){
                         if(err)
                         console.log(err);

                         else{
                             console.log("Wow Your Answer is Right");
                         }
                      })
                  })
     

                // const sc = new Score();
                // sc.total = 1;
                // sc.save();
            } 
            else{
                // const sc = new Score();
                // sc.total = 11111;
                // sc.save();
                Score.findOne({userid:req.params.userid}, (err ,score)=>{
                    
                    const new_score = {};
                    new_score.total = score.total-1;
                    Score.update({userid:req.params.userid},new_score,function(err){
                       if(err)
                       console.log(err);

                       else{
                        console.log("Wrong Answer..Sorry Better Luck Next Time.")
                       }
                    })
                })
                
            }
        }
    })
      const ans = new answer({
          id : req.params.id,
          option : req.query.response
      });
      try {
          const an = await ans.save();
         // console.log(an)
          res.redirect('/quiz123/'+req.params.userid);
      } catch (error) {
          
      }
    // console.log();
    // console.log();
    
   
})

app.post('/verify',urlencodedParser,async(req,res)=>{
    //console.log(req.body);
   if(req.body.Email=="ankur@gmail.com" && req.body.Password=="ankur")
   {
    res.redirect("/admin");
   }

  else{
    const userdata = await user.findOne({
        Email : req.body.Email 
    })
    //console.log(userdata);
    if(userdata!=null)
    {
        if(userdata.Password==req.body.Password)
        {
            res.redirect("/quiz123/"+userdata._id);
        
        }
        else{
            console.log("Wrong password");
            res.send("Wrong password");
           }
    }
    else{

        res.send("User not found");
    }
}

});

app.post("/addques",urlencodedParser,(req,res)=>{
    //console.log(req.body);
const data1 = new question({
    Title : req.body.Title1,
    Desc : req.body.Desc1,
    op1: req.body.Opt1,
    op2 : req.body.Opt2,
    op3 : req.body.Opt3 , 
    op4 : req.body.Opt4 ,
    ans : req.body.Opt5
})
data1.save();
    console.log("data entered");
    res.redirect("/admin");
});





app.post("/data",urlencodedParser,async(req,res)=>{
    //console.log(req.body);
const data = new user({
    Name : req.body.Name1,
    Email : req.body.Email1,
    Password : req.body.Password1
})
await data.save();
  
  await user.findOne({Name:req.body.Name1}, (err,use)=>{
       if(err)
       console.log(err)

       else{
           console.log(use.Name);
    const score = new Score()
        score.userid = use._id ;
        score.total = 0;
      score.save();
       }
   });

    res.redirect("/login");
    console.log("data entered");
    
});

app.listen(3000,(req,res)=>{
    console.log("server running");
});
let mongoose =require('mongoose');
const Schema = mongoose.Schema;

//articel schema

const user = new Schema({
    Name : String,
    Password : String ,
    Email : String
});


const question = new Schema({
    Title: String ,
    Desc : String ,
    op1 :String ,
    op2 :String ,
    op3 :String ,
    op4 :String ,
    ans :String
});

const answer = new Schema({
    id : String ,
    option :String
});

const score = new Schema({
    userid : String,
    total : Number
})

module.exports.Usermodel =mongoose.model('User',user,'User');
module.exports.Questionmodel =mongoose.model('Question',question,'Question');
module.exports.Answermodel = mongoose.model('Answer',answer,'Answer');
module.exports.Scoremodel = mongoose.model('Score',score,'Score');
const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const urlExists = require('url-exists');
require('dotenv').config({path:'./Secret/.env/'});
const Schema = mongoose.Schema;
const shortid = require('shortid');
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true },(err) =>{
    if (err) throw "Erorr connecting to database" + err;
});
const shorturl = require('./models/url3');

app.use(bodyParser.json());
app.use(cors());

app.use('/',express.static('public'));

let longUrl;
let shorterUrl;
let shortenurl;
let endPoint;

app.get('/new/:test(*)',(req,res,next)=>{	
    longUrl = req.params.test;
	console.log(longUrl);

	let substring = "https://"

if(!longUrl.includes(substring)){
		longUrl = "https://" + longUrl;
	}
	
   urlExists(longUrl,(err, exists) =>{
       if(exists){
		shorturl.find({originalurl:longUrl})
    .then(user => {
        if (user.length !== 0) {
			return res.send({originalurl:longUrl,
	                 shorturl:user[0].shorturl.substr(0,6)
	                });
        } 
		if(user.length === 0){
			shortenurl = shortid.generate();
			shortenurl = shortenurl.substr(0,6);
			let data = new shorturl({
		        originalurl:longUrl,
		        shorturl:shortenurl
	            })
				
			data.save(user,err=>{			
		if(err) throw err;
		return res.send({originalurl:longUrl,
	                     shorturl:shortenurl
	                });
	
	});
	
		}
		
    }).catch(err => {
 
         if(err) throw err;
  
    });
	}else{
		console.log('non existing')
	     res.send({"error":"invalid URL"})
	}
	
});

})


app.get('/:urlToForward',(req,res,next)=>{
	let shorterUrl = req.params.urlToForward;
      shorturl.findOne({"shorturl": shorterUrl}, {"originalurl": 1, "_id": 0}, (err, doc) => {
            if (doc != null) {
              res.redirect(doc.originalurl);
            } else {
              res.json({ error: "Shortlink not found in the database." });
            };
          });
})

app.use('*',(req, res, next)=> {
	 res.status(404);
     res.sendFile(__dirname + '/public/404.html');
  });
  
app.use((err, req, res, next)=> {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


app.listen(port,function(){
    console.log('I am working fine!');
})


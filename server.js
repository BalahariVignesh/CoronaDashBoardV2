const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); //mongodb
const neo4j = require('neo4j-driver'); //neo4j driver
const redis = require('redis'); // redis 
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const request = require('request'); // required to fetch json from url
const beautify = require("json-beautify");
const fs = require('fs');

//const Users = require('./models/covid')

var port = process.env.PORT || 8000

const app = express();

// app.use(express.static(path.join(__dirname,'client','build')));
// app.get('/', (req,resp) => {
//    console.log('helloworld!');
//   resp.sendFile(path.join(__dirname,'client','build','index.html'));
// });


app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)



const mongoURI = 'mongodb://mongodb:27017/COVID';



mongoose
  .connect(mongoURI, {useNewUrlParser: true})
  .then(() => console.log("MongoDB connected"))

//   var COVID = require('./models/covid')

// redis connection
//  const r_client = redis.createClient();
// client.on('connect', function() {
//   console.log('Redis connected');
// });

// //redis route to check whether query is working
// app.get('/redis', function(req,res) {
//   client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
//   client.hgetall("hosts", function (err, obj) {
//       console.dir(obj);
//   });
//   res.send("redis works");
// });

// home route
app.get('/', function(req,res) {
    res.send( 'Connected with the Node JS API for Corona Dashboard');
});

const client = redis.createClient({
  host:'redis',
  port:6379
})
app.get('/redis', function(req,res) {
  client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
  client.hgetall("hosts", function (err, obj) {
      console.dir(obj);
  });
  res.send("redis works");
});
//neo4j basic connection
const driver = neo4j.driver('bolt://neo4j:7687', neo4j.auth.basic('neo4j','root')); //neo4j connection
const session = driver.session();

// neo4j route to query
app.get('/neo4j', function(req, res){
      session
      .run('MATCH (B:Bundesland) return B')
      .then(function(result){
        result.records.forEach(function(record){
          console.log(record._fields[0].properties);
        });
      })
      .catch(function(err){
        console.log(err);
      })
      res.send("neo4j works");
    });



//mongodb connection to fetch json from url and load into collection
//fetching today's data from the RKI COVID API and insert into collection
app.get('/fetchrkidata', function(req, res){
  // Define where the MongoDB server is
  var api = 'https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.geojson';
  // Connect to the server
  mongoose.connect(mongoURI, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // We are connected
    console.log('Connection established to', mongoURI,api);
    // Get the documents collection
    var collection = db.collection('COVID');
    request.get(api, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
        var data = JSON.parse(body);
       
        res.send("Successfully stored in mongodb");
        // Connect to the server
         mongoose.connect(mongoURI, function (err, db) {
          if (err) throw err;
          var myobj = data.features.map(patients => patients.properties);
            db.collection("CURRENT_DATA").insertMany(myobj, function(err, res) {
              if (err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);
                db.close();
              });

         })
    }
  });
  }
  });


})



//sample testing mongodb query to find all patients
//to check if data from API is updated
app.get('/checkrkidata', function(req, res){
    // Connect to the server
    mongoose.connect(mongoURI, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {
      // We are connected
      console.log('Connection established to', mongoURI);
   
      // Get the documents collection
      var collection = db.collection('CURRENT_DATA');
   
      // Find all patients
      
      collection.find({}).toArray(function (err, result) {
        if (err) {
          res.send(err);
        } else if (result.length) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(result, null,  100))
        } else {
          res.send('No documents found');
        }
        //Close connection
        db.close();
      });
    }
    });

  });

//to create county collection
app.get('/createcountycollection', function(req, res){

  mongoose.connect(mongoURI, function (err, db) {
if (err) {
  console.log('Unable to connect to the Server', err);
} else {
  // We are connected
  console.log('Connection established to', mongoURI);

var collection = db.collection('COVID');
db.collection('CURRENT_DATA').aggregate([{$match:{$and:[{Bundesland:{$eq:"Baden-Württemberg"}},{$or:[{NeuerFall:0},{NeuerFall:1}]}]}},{$group:{_id:{Landkreis:"$Landkreis",IdLandkreis:"$IdLandkreis"}}}]).toArray(function (error, data) {
        db.collection('Baden').insert(data);
        return res.status(200).send(data);
        //handle error case also 
      })
    }
});
})




//main working api to insert current data into history data
app.get('/countyname',function(req,res)
{
  mongoose.connect(mongoURI, function (err, db) {
  if (err) {
  console.log('Unable to connect to the Server', err);
 } else 
    {
        let city =" ";
        let Infected=0;
        let Recovered=0;
        let Dead=0;
        let Total=0;
        let date=new Date();
        db.collection('Baden').find().toArray().then((county)=>{
            for(j=0;j<county.length;j++)
            {
                city = county[j]._id.Landkreis;
                console.log(city);
                db.collection('Old_data').find({Landkreis:city}).toArray().then((docs)=>{
                    let infected_cases=0;
                    let recovered_cases=0;
                    let dead_cases=0;
                    let city = ' ';


                        let infected_cases_1=0;
                        let recovered_cases_1=0;
                        let dead_cases_1=0;
                        let infected_cases_2=0;
                        let recovered_cases_2=0;
                        let dead_cases_2=0;
                        let infected_cases_3=0;
                        let recovered_cases_3=0;
                        let dead_cases_3=0;
                        let infected_cases_4=0;
                        let recovered_cases_4=0;
                        let dead_cases_4=0;
                        let infected_cases_5=0;
                        let recovered_cases_5=0;
                        let dead_cases_5=0;
                        let infected_cases_6=0;
                        let recovered_cases_6=0;
                        let dead_cases_6=0;
                        let infected_cases_7=0;
                        let recovered_cases_7=0;
                        let dead_cases_7=0;

                        let M_infected_cases=0;
                        let M_recovered_cases=0;
                        let M_dead_cases=0;
                        let W_infected_cases=0;
                        let W_recovered_cases=0;
                        let W_dead_cases=0;
                        let U_infected_cases=0;
                        let U_recovered_cases=0;
                        let U_dead_cases=0;
                        let new_infected_cases=0;
                        let new_recovered_cases=0;
                        let new_dead_cases=0;

                    for(i=0;i<docs.length;i++)
                    {     //counting the cummulative total count
                          if(docs[i].NeuerFall==0||docs[i].NeuerFall==1)
                          {
                            if(docs[i].NeuerTodesfall==-9)
                            {
                              if(docs[i].NeuGenesen==-9)
                                infected_cases++;
                              else
                                recovered_cases++;
                            }
                            else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9))
                            {
                              dead_cases++;
                            }
                          }
                          //counting only the new infected, recovered, dead cases.
                          if(docs[i].NeuerFall==1)
                          {
                            if(docs[i].NeuerTodesfall==1 && docs[i].NeuGenesen==-9)
                            {
                              new_dead_cases++;
                            }
                            else if(docs[i].NeuGenesen==1 && docs[i].NeuerTodesfall==-9){
                              new_recovered_cases++;
                            }
                            else if(docs[i].NeuerTodesfall==-9 && docs[i].NeuGenesen==-9){
                              new_infected_cases++;
                            }
                          }
                          else if(docs[i].NeuerFall==0)
                          {
                            if(docs[i].NeuerTodesfall==1 && docs[i].NeuGenesen==-9)
                            {
                              new_dead_cases++;
                            }
                            else if(docs[i].NeuGenesen==1 && docs[i].NeuerTodesfall==-9){
                              new_recovered_cases++;
                            }
                          }

                      
                          switch(docs[i].Altersgruppe){
                          case 'A00-A04':
                            if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
                              if(docs[i].NeuerTodesfall==-9){
                                  if(docs[i].NeuGenesen==-9)
                                  infected_cases_1++;
                                  else
                                  recovered_cases_1++;
                              }
                              else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
                                  dead_cases_1++;
                              }
                          }
                            break;
                          case 'A05-A14':
                            if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
                              if(docs[i].NeuerTodesfall==-9){
                                  if(docs[i].NeuGenesen==-9)
                                  infected_cases_2++;
                                  else
                                  recovered_cases_2++;
                              }
                              else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
                                  dead_cases_2++;
                              }
                          }
                            break;
                          case 'A15-A34':
                            if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
                              if(docs[i].NeuerTodesfall==-9){
                                  if(docs[i].NeuGenesen==-9)
                                  infected_cases_3++;
                                  else
                                  recovered_cases_3++;
                              }
                              else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
                                  dead_cases_3++;
                              }
                          }
                            break;
                          case 'A35-A59':
                            if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
                              if(docs[i].NeuerTodesfall==-9){
                                  if(docs[i].NeuGenesen==-9)
                                  infected_cases_4++;
                                  else
                                  recovered_cases_4++;
                              }
                              else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
                                  dead_cases_4++;
                              }
                          }
                            break;
                          case 'A60-A79':
                            if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
                              if(docs[i].NeuerTodesfall==-9){
                                  if(docs[i].NeuGenesen==-9)
                                  infected_cases_5++;
                                  else
                                  recovered_cases_5++;
                              }
                              else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
                                  dead_cases_5++;
                              }
                          }
                            break;
                          case 'A80+':
                            if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
                              if(docs[i].NeuerTodesfall==-9){
                                  if(docs[i].NeuGenesen==-9)
                                  infected_cases_6++;
                                  else
                                  recovered_cases_6++;
                              }
                              else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
                                  dead_cases_6++;
                              }
                          }
                            break;
                          case 'unbekannt':
                            if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
                              if(docs[i].NeuerTodesfall==-9){
                                  if(docs[i].NeuGenesen==-9)
                                  infected_cases_7++;
                                  else
                                  recovered_cases_7++;
                              }
                              else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
                                  dead_cases_7++;
                              }
                          }
                            break;
                          default:
                            console.log("Something is coming in default",docs[i].Altersgruppe)
                            break;

                          
                        }



                        switch(docs[i].Geschlecht)
                        {
                          case 'M':
                            if(docs[i].NeuerFall==0||docs[i].NeuerFall==1)
                            {
                              if(docs[i].NeuerTodesfall==-9)
                              {
                                if(docs[i].NeuGenesen==-9)
                                  M_infected_cases++;
                                else
                                  M_recovered_cases++;
                              }
                              else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9))
                              {
                              M_dead_cases++;
                              }
                            }
                            break;
                          case 'W':
                          if(docs[i].NeuerFall==0||docs[i].NeuerFall==1)
                          {
                            if(docs[i].NeuerTodesfall==-9)
                            {
                              if(docs[i].NeuGenesen==-9)
                               W_infected_cases++;
                              else
                                W_recovered_cases++;
                            }
                            else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9))
                            {
                              W_dead_cases++;
                            }
                          }
                          break;
                        case 'unbekannt':
                        if(docs[i].NeuerFall==0||docs[i].NeuerFall==1)
                        {
                          if(docs[i].NeuerTodesfall==-9)
                          {
                            if(docs[i].NeuGenesen==-9)
                              U_infected_cases++;
                            else
                              U_recovered_cases++;
                          }
                          else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9))
                          {
                            U_dead_cases++;
                          }
                        }
                        break;
                      default:
                      console.log('Something is wrong checkout',docs[i].Geschlecht)
                      break;
                    }


                      city=docs[i].Landkreis;
                      date_string=docs[i].Datenstand;
                      date_string=date_string.split(',');
                      date_string = (date_string[0]).split(".").join("-")
                      let actual_date = date_string.split("-");
                      let dateD = actual_date[0];
                      let month = actual_date[1];
                      let year = actual_date[2];
                      let date_format = year+"-"+ month + "-" + dateD;
                      date =new Date(date_format);
                    
                      console.log(date);
                    }
               
                Infected = infected_cases;
                Recovered = recovered_cases;
                Dead = dead_cases;
                Total = (infected_cases+recovered_cases+dead_cases);
                
                Landkreis = city;
                let cases = { Landkreis:city,Date:date, Infected : Infected, Recovered : Recovered , Dead : Dead , Total : Total , New_Infected : new_infected_cases ,New_Recovered : new_recovered_cases , New_Dead: new_dead_cases ,
                  A00_A04:[{Infected_Cases:infected_cases_1,Recovered_Cases:recovered_cases_1,Dead_Cases:dead_cases_1,Total_Cases:(infected_cases_1+recovered_cases_1+dead_cases_1)}] ,
                  A05_A14:[{Infected_Cases:infected_cases_2,Recovered_Cases:recovered_cases_2,Dead_Cases:dead_cases_2,Total_Cases:(infected_cases_2+recovered_cases_2+dead_cases_2)}] ,
                  A15_A34:[{Infected_Cases:infected_cases_3,Recovered_Cases:recovered_cases_3,Dead_Cases:dead_cases_3,Total_Cases:(infected_cases_3+recovered_cases_3+dead_cases_3)}] ,
                  A35_A59:[{Infected_Cases:infected_cases_4,Recovered_Cases:recovered_cases_4,Dead_Cases:dead_cases_4,Total_Cases:(infected_cases_4+recovered_cases_4+dead_cases_4)}] ,
                  A60_A79:[{Infected_Cases:infected_cases_5,Recovered_Cases:recovered_cases_5,Dead_Cases:dead_cases_5,Total_Cases:(infected_cases_5+recovered_cases_5+dead_cases_5)}] ,
                  A80:[{Infected_Cases:infected_cases_6,Recovered_Cases:recovered_cases_6,Dead_Cases:dead_cases_6,Total_Cases:(infected_cases_6+recovered_cases_6+dead_cases_6)}] ,
                  unbekannt:[{Infected_Cases:infected_cases_7,Recovered_Cases:recovered_cases_7,Dead_Cases:dead_cases_7,Total_Cases:(infected_cases_7+recovered_cases_7+dead_cases_7)}], 
                  Gender_Men:{Infected_Cases:M_infected_cases,Recovered_Cases:M_recovered_cases,Dead_Cases:M_dead_cases,Total_Cases:(M_infected_cases+M_recovered_cases+M_dead_cases)},
                  Gender_Women:{Infected_Cases:W_infected_cases,Recovered_Cases:W_recovered_cases,Dead_Cases:W_dead_cases,Total_Cases:(W_infected_cases+W_recovered_cases+W_dead_cases)},
                  Gender_Unbekannt:{Infected_Cases:U_infected_cases,Recovered_Cases:U_recovered_cases,Dead_Cases:U_dead_cases,Total_Cases:(U_infected_cases+U_recovered_cases+U_dead_cases)}
             }
                //var cases = { Landkreis:city, Infected : Infected, Recovered : Recovered , Dead : Dead , Total : Total  }
                    //console.log(ages);
                     db.collection('History').insert(cases, function(err, res) {
                       if (err) throw err;
                       console.log("1 document inserted");
                     });
                 res.send(cases);
                });



                   
            }
  


        });


    }
  })
})


app.get('/loaddata', function (req, res) {
 
  const jsonString = fs.readFileSync('./dataset/comp_15-6.geojson')
  const history_data= JSON.parse(jsonString);
  //const data =  jsonString.features.map(patients => patients.properties);
  
  const data = history_data.features.map(patients => patients.properties)
  mongoose.connect(mongoURI, function (err, db) {
   if (err) {
     console.log('Unable to connect to the Server', err);
   } else {
       db.collection('Old_data').insertMany(data);
       res.status(200).send(data);
   }
  })
  
 });


//put this somewhere else
server = app.listen(port, function(){
  console.log("Server is running on port:"  + port);
}); 

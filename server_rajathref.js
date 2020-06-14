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

const Users = require('./models/covid')

var port = process.env.PORT || 8000

const app = express();


app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)



const mongoURI = 'mongodb://localhost:27017/COVID';



mongoose
  .connect(mongoURI, {useNewUrlParser: true})
  .then(() => console.log("MongoDB connected"))

//   var COVID = require('./models/covid')

// redis connection
var client = redis.createClient();
client.on('connect', function() {
  console.log('Redis connected');
});

//redis route to check whether query is working
app.get('/redis', function(req,res) {
  client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
  client.hgetall("hosts", function (err, obj) {
      console.dir(obj);
  });
  res.send("redis works");
});

// home route
app.get('/', function(req,res) {
    res.send( 'Express');
});

//neo4j basic connection
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j','rajath@123')); //neo4j connection
const session = driver.session();

// neo4j route to query
app.get('/neo4j', function(req, res){
      session
      .run('MATCH (tom {name: "Tom Hanks"}) RETURN tom')
      .then(function(result){
        result.records.forEach(function(record){
          console.log(record);
        });
      })
      .catch(function(err){
        console.log(err);
      })
      res.send("neo4j works");
    });


//This is important for me to work with nested array of age group related data
//age group wise cases counts are inserted into one array called age group containing 7 age groups as array elements
app.get('/testapi',function(req,res)
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
        db.collection('Baden').find().toArray().then((county)=>{
            for(j=0;j<county.length;j++)
            {
                city = county[j]._id.Landkreis;
                console.log(city);
                db.collection('patients').find({Landkreis:city}).toArray().then((docs)=>{
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

                    for(i=0;i<docs.length;i++)
                    {
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


                      city=docs[i].Landkreis;
                    }
               




                Infected = infected_cases;
                Recovered = recovered_cases;
                Dead = dead_cases;
                Total = (infected_cases+recovered_cases+dead_cases);
                Landkreis = city;
                let cases = { Landkreis:city, Infected : Infected, Recovered : Recovered , Dead : Dead , Total : Total ,
                AgeGroup:[{
                    A00_A04:{Infected_Cases:infected_cases_1,Recovered_Cases:recovered_cases_1,Dead_Cases:dead_cases_1,Total_Cases:(infected_cases_1+recovered_cases_1+dead_cases_1)} ,
                    A05_A14:{Infected_Cases:infected_cases_2,Recovered_Cases:recovered_cases_2,Dead_Cases:dead_cases_2,Total_Cases:(infected_cases_2+recovered_cases_2+dead_cases_2)} ,
                    A15_A34:{Infected_Cases:infected_cases_3,Recovered_Cases:recovered_cases_3,Dead_Cases:dead_cases_3,Total_Cases:(infected_cases_3+recovered_cases_3+dead_cases_3)} ,
                    A35_A59:{Infected_Cases:infected_cases_4,Recovered_Cases:recovered_cases_4,Dead_Cases:dead_cases_4,Total_Cases:(infected_cases_4+recovered_cases_4+dead_cases_4)} ,
                    A60_A79:{Infected_Cases:infected_cases_5,Recovered_Cases:recovered_cases_5,Dead_Cases:dead_cases_5,Total_Cases:(infected_cases_5+recovered_cases_5+dead_cases_5)} ,
                    A80:{Infected_Cases:infected_cases_6,Recovered_Cases:recovered_cases_6,Dead_Cases:dead_cases_6,Total_Cases:(infected_cases_6+recovered_cases_6+dead_cases_6)} ,
                    unbekannt:{Infected_Cases:infected_cases_7,Recovered_Cases:recovered_cases_7,Dead_Cases:dead_cases_7,Total_Cases:(infected_cases_7+recovered_cases_7+dead_cases_7)} 
                }]
                
             }
                //var cases = { Landkreis:city, Infected : Infected, Recovered : Recovered , Dead : Dead , Total : Total  }
                    //console.log(ages);
                     db.collection('Test').insert(cases, function(err, res) {
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





///all the below apis are for reference only
//not being used only for testing
app.get('/patients/county', function(req, res){

  mongoose.connect(mongoURI, function (err, db) {
if (err) {
  console.log('Unable to connect to the Server', err);
} else {
  // We are connected
  console.log('Connection established to', mongoURI);

var collection = db.collection('COVID');
db.collection('patients').aggregate( [{$match: { $and: [ {$or:[{NeuerFall:0},{NeuerFall:1}]}] } },{$group:{_id:"$Landkreis"}}] ).toArray(function (error, data) {
        db.collection('current').insert(data);
        return res.status(200).send(data);
        //handle error case also 
      })
    }
});
})



    
//api to calculate total infected, dead and recovered cases in the state/whole country if 
//data is not sorted for baden wuttemberg, data not inserted to db with this api
app.get('/totalcasecount',function(req,res){
 
  mongoose.connect(mongoURI, function (err, db) {
  if (err) {
  console.log('Unable to connect to the Server', err);
    } else {
   
  //adding recovered cases and dead cases logic in above function
  db.collection('patients').find().toArray().then((docs)=>{
    let infected_cases=0;
    let recovered_cases=0;
    let dead_cases=0;
  for(i=0;i<docs.length;i++){
   // console.log(docs[i].NeuerFall);
  
    if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
          if(docs[i].NeuerTodesfall==-9){
              if(docs[i].NeuGenesen==-9)
              infected_cases++;
              else
              recovered_cases++;
          }
          else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
              dead_cases++;
          }
      }
  }
  console.log("infected cases:",infected_cases);
  console.log("recovered cases:",recovered_cases);
  console.log("dead cases:",dead_cases);
  console.log("Total Cases in Germany:",infected_cases+recovered_cases+dead_cases)
  res.sendStatus(200).send(infected_cases);
  
  }).catch((err)=>{
  console.log(err);
  }).finally(()=>{
  //client.close();
  })
   
      }
    })
   
  })


//api to calculate cases age wise, test logic, not inserting data to api
app.get('/agecasecount',function(req,res){
 
  mongoose.connect(mongoURI, function (err, db) {
  if (err) {
  console.log('Unable to connect to the Server', err);
    } else {
   
  //adding recovered cases and dead cases logic in above function
  db.collection('patients').find().toArray().then((docs)=>{
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
  for(i=0;i<docs.length;i++){
   // console.log(docs[i].NeuerFall);
  //console.log(docs[i].Altersgruppe);
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
  }

  console.log('A00-A04');
  console.log("infected cases:",infected_cases_1);
  console.log("recovered cases:",recovered_cases_1);
  console.log("dead cases:",dead_cases_1);
  console.log("Total Cases in this age group:",infected_cases_1+recovered_cases_1+dead_cases_1);
  console.log('A05-A14');
  console.log("infected cases:",infected_cases_2);
  console.log("recovered cases:",recovered_cases_2);
  console.log("dead cases:",dead_cases_2);
  console.log("Total Cases in this age group:",infected_cases_2+recovered_cases_2+dead_cases_2);
  console.log('A15-A34')
  console.log("infected cases:",infected_cases_3);
  console.log("recovered cases:",recovered_cases_3);
  console.log("dead cases:",dead_cases_3);
  console.log("Total Cases in this age group:",infected_cases_3+recovered_cases_3+dead_cases_3);
  console.log('A35-A59')
  console.log("infected cases:",infected_cases_4);
  console.log("recovered cases:",recovered_cases_4);
  console.log("dead cases:",dead_cases_4);
  console.log("Total Cases in this age group:",infected_cases_4+recovered_cases_4+dead_cases_4);
  console.log('A60-A79');
  console.log("infected cases:",infected_cases_5);
  console.log("recovered cases:",recovered_cases_5);
  console.log("dead cases:",dead_cases_5);
  console.log("Total Cases in this age group:",infected_cases_5+recovered_cases_5+dead_cases_5);
  console.log('A80+');
  console.log("infected cases:",infected_cases_6);
  console.log("recovered cases:",recovered_cases_6);
  console.log("dead cases:",dead_cases_6);
  console.log("Total Cases in this age group:",infected_cases_6+recovered_cases_6+dead_cases_6);
  console.log('unbekannt');
  console.log("infected cases:",infected_cases_7);
  console.log("recovered cases:",recovered_cases_7);
  console.log("dead cases:",dead_cases_7);
  console.log("Total Cases in this age group:",infected_cases_7+recovered_cases_7+dead_cases_7);
  res.sendStatus(200).send(infected_cases);
  
  }).catch((err)=>{
  console.log(err);
  }).finally(()=>{
  //client.close();
  })
   
      }
    })
   
  })
   //delete for later
//api to just calculate age wise counts, data is not inserted to DB
app.get('/countyage',function(req,res)
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
        db.collection('Baden').find().toArray().then((county)=>{
            for(j=0;j<county.length;j++)
            {

                city = county[j]._id.Landkreis;
  //adding recovered cases and dead cases logic in above function
  db.collection('patients').find({Landkreis:city}).toArray().then((docs)=>{
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
  for(i=0;i<docs.length;i++){
   // console.log(docs[i].NeuerFall);
  //console.log(docs[i].Altersgruppe);
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
  city=docs[i].Landkreis;
  }
  console.log(city);
  let ages = { Landkreis:city,A00_A04_Infected_Cases:infected_cases_1,A00_A04_Recovered_Cases:recovered_cases_1,A00_A04_Dead_Cases:dead_cases_1,A00_A04_Total_Cases:(infected_cases_1+recovered_cases_1+dead_cases_1),
               A05_A14_Infected_Cases:infected_cases_2,A05_A14_Recovered_Cases:recovered_cases_2,A05_A14_Dead_Cases:dead_cases_2,A05_A14_Total_Cases:(infected_cases_2+recovered_cases_2+dead_cases_2),
               A15_A34_Infected_Cases:infected_cases_3,A15_A34_Recovered_Cases:recovered_cases_3,A15_A34_Dead_Cases:dead_cases_3,A15_A34_Total_Cases:(infected_cases_3+recovered_cases_3+dead_cases_3),
               A35_A59_Infected_Cases:infected_cases_4,A35_A59_Recovered_Cases:recovered_cases_4,A35_A59_Dead_Cases:dead_cases_4,A35_A59_Total_Cases:(infected_cases_4+recovered_cases_4+dead_cases_4),
               A60_A79_Infected_Cases:infected_cases_5,A60_A79_Recovered_Cases:recovered_cases_5,A60_A79_Dead_Cases:dead_cases_5,A60_A79_Total_Cases:(infected_cases_5+recovered_cases_5+dead_cases_5),
               A80_Infected_Cases:infected_cases_6,A80_Recovered_Cases:recovered_cases_6,A80_Dead_Cases:dead_cases_6,A80_Total_Cases:(infected_cases_6+recovered_cases_6+dead_cases_6),
               unbekannt_Infected_Cases:infected_cases_7,unbekannt_Recovered_Cases:recovered_cases_7,unbekannt_Dead_Cases:dead_cases_7,unbekannt_Total_Cases:(infected_cases_7+recovered_cases_7+dead_cases_7)
             }
  console.log(ages);
  res.sendStatus(200).send(infected_cases);
  })


            }

            
  


        });


    }
  })
})


//bala created for testing - delete the mwcasecount later

  app.get('/mwcasecount',function(req,res){
 
    mongoose.connect(mongoURI, function (err, db) {
    if (err) {
    console.log('Unable to connect to the Server', err);
      } else {
     
    //adding recovered cases and dead cases logic in above function
    db.collection('patients').find().toArray().then((docs)=>{
      let M_infected_cases=0;
      let M_recovered_cases=0;
      let M_dead_cases=0;
      let W_infected_cases=0;
      let W_recovered_cases=0;
      let W_dead_cases=0;
      let U_infected_cases=0;
      let U_recovered_cases=0;
      let U_dead_cases=0;
    for(i=0;i<docs.length;i++){
     // console.log(docs[i].NeuerFall);
    switch(docs[i].Geschlecht){
      case 'M':
        if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
          if(docs[i].NeuerTodesfall==-9){
              if(docs[i].NeuGenesen==-9)
              M_infected_cases++;
              else
              M_recovered_cases++;
          }
          else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
              M_dead_cases++;
          }
      }
        break;
      case 'W':
        if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
          if(docs[i].NeuerTodesfall==-9){
              if(docs[i].NeuGenesen==-9)
              W_infected_cases++;
              else
              W_recovered_cases++;
          }
          else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
              W_dead_cases++;
          }
      }
        break;
      case 'unbekannt':
        if(docs[i].NeuerFall==0||docs[i].NeuerFall==1){
          if(docs[i].NeuerTodesfall==-9){
              if(docs[i].NeuGenesen==-9)
              U_infected_cases++;
              else
              U_recovered_cases++;
          }
          else if((docs[i].NeuerTodesfall==0|docs[i].NeuerTodesfall==1)&&(docs[i].NeuGenesen==-9)){
              U_dead_cases++;
          }
      }
        break;
      default:
        console.log('Something is wrong checkout',docs[i].Geschlecht)
        break;
    }
      
    }
    console.log('Men')
    console.log("infected cases:",M_infected_cases);
    console.log("recovered cases:",M_recovered_cases);
    console.log("dead cases:",M_dead_cases);
    console.log("Total Cases of Men in Germany:",M_infected_cases+M_recovered_cases+M_dead_cases)
    console.log('Women')
    console.log("infected cases:",W_infected_cases);
    console.log("recovered cases:",W_recovered_cases);
    console.log("dead cases:",W_dead_cases);
    console.log("Total Cases of Women in Germany:",W_infected_cases+W_recovered_cases+W_dead_cases)
    console.log('Unbekannt')
    console.log("infected cases:",U_infected_cases);
    console.log("recovered cases:",U_recovered_cases);
    console.log("dead cases:",U_dead_cases);
    console.log("Total Cases of Unknown in Germany:",U_infected_cases+U_recovered_cases+U_dead_cases)
    res.sendStatus(200).send(infected_cases);
    
    }).catch((err)=>{
    console.log(err);
    }).finally(()=>{
    //client.close();
    })
     
        }
      })
     
    })


  
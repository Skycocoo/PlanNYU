var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;

// Assuming your mongo database is named PlanNYU and you have dumped the data from the Dump folder
var url = "mongodb://localhost:3000/PlanNYU";
var PORT = process.env.PORT || 3000;

function sanitizeVal(val) {
   var val = val.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
   return val;
}

app.use(express.static(__dirname + '/../FrontEnd'));

app.get('/', function (req, res) {
   res.redirect('index.html');
});

app.get('/search', function (req, res) {
   var val = sanitizeVal(req.query.val); 
   if (val === undefined) {
      res.redirect('/');
      return;
   }
   if (val == 'abcd' || val == 'abcde') {
      res.send(val);
   } else {
      res.send('*');
   }
});

app.get('/schools', function (req, res) {
   var text = {};
   text['schoolList'] = [];
   MongoClient.connect(url, function (err, db) {
      if (err != null) throw "Error";
      var result = db.collection('schools-majors').find().sort({'name' : 1});  
      result.each(function (err, doc) {
         if (doc != null) {
            var m = {};
            m['code'] = doc.code;
            m['name'] = doc.name;
            text['schoolList'].push(m);
         } else {
            text['schoolList'].unshift({"code" : "default", "name" : "Select a school"});
            res.send(text);
            db.close();
         }
      });
   });
});

app.get('/major', function (req, res) {
   var val = sanitizeVal(req.query.val); 
   if (req.query.val == 'default') {
      res.send('*'); return;
   } 
   MongoClient.connect(url, function (err, db) {
      if (err != null) throw "Error";
      var result;
      if (val == 'AD') {
         result = db.collection('schools-majors').find({$or:[{'code' : val},{'code' : 'UH'}]});  
      } else {
         result = db.collection('schools-majors').find({'code' : val});  
      }
      var text = {};
      text['majors'] = [];
      result.each(function (err, doc) {
         if (doc != null) {
            for (i in doc.majors) {
               var m = {};
               m['code'] = doc.majors[i].code;
               m['name'] = doc.majors[i].name;
               text['majors'].push(m);
            }
         } else {
            text['majors'] = text['majors'].sort(function (a, b) {
               return a.name.localeCompare(b.name);
            });
            text['majors'].unshift({"code" : "default", "name" : "Select a major"});
            res.send(text);
            db.close();
         }
      });
   });


      //var text = '{"majors" : [' + '{ "code":"default", "name":"Select a major" },' + '{ "code":"CS-UY", "name":"Computer Science" },' + '{"code":"PH-UY", "name":"Physics" }]}';
      //res.send(text);
});

app.get('/classes', function (req, res) {
   var val = sanitizeVal(req.query.val); 
   if (val == 'default') {res.send('*'); return; }
   var text = {};
   text['classList'] = [];
   MongoClient.connect(url, function (err, db) {
      if (err != null) throw "Error";
      /*aggregateStates(db, function () {
         db.close();
      });*/ 
      var result = db.collection('test').aggregate([
         { $group : {_id : {code : "$Code", name : "$CourseName", major : "$Major"} } },
         { $sort : {"_id.name" : 1} },
         { $match : {"_id.major" : val} } 
      ]).toArray(function (err, vals) {
         for (i in vals) {
            var m = {};
            m['code'] = vals[i]._id.code;
            m['name'] = vals[i]._id.code + ": " + vals[i]._id.name;
            text['classList'].push(m);
         }
         text['classList'].unshift({"code" : "default", "name" : "Select a class"});
         res.send(text);
         db.close();
      });
   });
});


function getDetailedClass(res, text, m, doc, db, i) {
   db.collection('credits').findOne({'courseCode' : doc.Code, 'courseType' : doc.ClassType}, function (e, c) {
      if (c == null) {
         m['units'] = 0;
         m['descr'] = "";
      } else {
         m['units'] = c.Units;
         m['descr'] = c.Description;
      }
      text['schedules'][i] = m;
      var l = 0;
      for (var cc in text['schedules']) {
         if (cc == undefined) {
            break;
         } else {
            l++;
         }
         if (text['schedules'].length == l) {
            db.close();
            res.send(text);
            return;
         }
      }
   });
}

function loopClasses(doc, res, db) {
   var text = {};
   text['schedules'] = [];
   text['schedules'].length = doc.length;
   for (var i = 0; i < doc.length; i++) {
      m = {};
      text['name'] = doc[i].CourseName; 
      m['other'] = doc[i].Other;
      m['section'] = doc[i].Section;
      m['status'] = doc[i].Status;
      m['time'] = doc[i].Schedule;
      m['type'] = doc[i].ClassType;
      m['instructors'] = doc[i].Instructors;
      m['code'] = doc[i]._id;
      m['color'] = "rgb("+doc[i].Color['r']+", "+doc[i].Color['g']+", "+doc[i].Color['b']+")";
      getDetailedClass(res, text, m, doc[i], db, i);
   }
   return;
}

function getAllClasses(val, res) {
   MongoClient.connect(url, function (err, db) {
      if (err != null) throw "Error";
      var result = db.collection('test').find({'Code' : val});  
      result.toArray(function (err, doc) { loopClasses(doc, res, db); });
      /*text = {};
      text['schedules'] = [];
      result.each(function (err, doc) {
         if (doc != null) {
            text['name'] = doc.CourseName;
            //text['units'] = doc.Units;
            var m = {};
            m['other'] = doc.Other;
            m['section'] = doc.Section;
            m['status'] = doc.Status;
            m['time'] = doc.Schedule;
            m['type'] = doc.ClassType;
            m['instructors'] = doc.Instructors;
            m['code'] = doc._id;
            m['color'] = "rgb("+doc.Color['r']+", "+doc.Color['g']+", "+doc.Color['b']+")";
            console.log("getDetailedClass before");
            getDetailedClass(text, m, doc, db);
            console.log("getDetailedClass after");
            //text['schedules'].push(m);
            //db.close();
            //res.send(text);
            //return;
         } else {
            //db.close();
            //res.send(text);
         }
      });*/ 
   });
}

/*
app.get('/sched', function (req, res) {
   var val = sanitizeVal(req.query.val); 
   if (req.query.val === 'default') {res.send('*'); return; }
   getAllClasses(val, res);
   return;
});
*/

app.get('/schedule', function (req, res) {
   res.redirect('schedule.html');
});

app.get('/about', function (req, res) {
   res.redirect('about_us.html');
});

app.get('*', function (req, res) {
   res.redirect('/');
});

app.listen(PORT, function () {
   console.log('Listening...');
});



















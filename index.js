function create(code) {
   if (code === undefined) return;
	var cart = document.getElementById('cart');
	var item = document.createElement('div');
	item.setAttribute('class', 'items');
	var ul = document.createElement('ul');

	var itemDelete = document.createElement('div');
	itemDelete.setAttribute('class', 'item-delete');
	itemDelete.innerHTML = "X";
   itemDelete.style.backgroundColor = "rgb(243,159,159)";
	itemDelete.addEventListener("click", function () {
		item.remove();
      removeCourseFromCart(code);
	});

   var xmlhttp = createAjaxObject();
   xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         if (xmlhttp.responseText === '*') return; 
 
         // Start of modified code

         /* 
            Usually we would get an object using the AJAX call below but we don't have the server...
            Make up some data we can work with
         */

         var obj = {
            "schedules":
               [
                  {"other":"","section":"R","status":{"Open":0},"time":{"Mo":{"End":"7:50pm","Start":"6:00pm"},"We":{"End":"7:50pm","Start":"6:00pm"}},"type":"LEC","instructors":{"Staff":0},"code":"17528","color":"rgb(184, 254, 171)","units":"4","descr":"Sample description"},
                  {"other":"","section":"D","status":{"Open":0},"time":{"Th":{"End":"5:50pm","Start":"4:00pm"},"Tu":{"End":"5:50pm","Start":"4:00pm"}},"type":"LEC","instructors":{"Staff":0},"code":"15733","color":"rgb(184, 254, 171)","units":"4","descr": "Sample description"},
                  {"other":"","section":"C","status":{"Open":0},"time":{"Tu":{"End":"3:50pm","Start":"2:00pm"},"Th":{"End":"3:50pm","Start":"2:00pm"}},"type":"LEC","instructors":{"Staff":0},"code":"15732","color":"rgb(184, 254, 171)","units":"4","descr":"Sample Description"},
                  {"other":"","section":"V","status":{"Wait List":3},"time":{"Tu":{"End":"4:50pm","Start":"2:30pm"},"Th":{"End":"3:50pm","Start":"2:00pm"}},"type":"LEC","instructors":{"Staff":0},"code":"15732","color":"rgb(184, 254, 171)","units":"4","descr":"Sample Description"},
                  {"other":"","section":"W","status":{"Wait List":11},"time":{"Tu":{"End":"4:50pm","Start":"2:30pm"},"Th":{"End":"3:50pm","Start":"2:00pm"}},"type":"LEC","instructors":{"Staff":0},"code":"15732","color":"rgb(184, 254, 171)","units":"4","descr":"Sample Description"},
                  {"other":"","section":"W","status":{"Closed":0},"time":{"Tu":{"End":"1:50pm","Start":"12:30pm"},"Th":{"End":"3:50pm","Start":"2:00pm"}},"type":"LEC","instructors":{"Staff":0},"code":"15732","color":"rgb(184, 254, 171)","units":"4","descr":"Sample Description"},
                  {"other":"","section":"A","status":{"Open":0},"time":{"Mo":{"End":"10:20am","Start":"8:30am"},"We":{"End":"10:20am","Start":"8:30am"}},"type":"LEC","instructors":{"Staff":0},"code":"15731","color":"rgb(184, 254, 171)","units":"4","descr":"Sample Description"}],
            "name":"Calculus II for Engineers"
         };

         // End of modified code
       
         //var obj = JSON.parse(xmlhttp.responseText);
	      var title = document.createElement('span');
         gCart[code] = [];
	      title.innerHTML = code + ": " + obj.name;
         title.addEventListener("click", function () {
		      if (ul.style.display === "block") {
			      ul.style.display = "none";
		      } else {
			      ul.style.display = "block";
		      }
	      });
	      item.appendChild(itemDelete);
	      item.appendChild(title);
	      item.appendChild(ul);

         for (var i = 0; i < obj.schedules.length; i++) {
            gCart[code].push(obj.schedules[i]);
            title.style.backgroundColor = obj.schedules[i].color;
	         var li = document.createElement('li');
            li.info = obj.schedules[i];
	         var desc = document.createElement('span');
	         desc.setAttribute('class', 'item-q-desc');
            if (obj.schedules[i].descr != undefined) {
               item.title = obj.schedules[i].descr;
            }
	         desc.innerHTML = obj.schedules[i].type + "-" + obj.schedules[i].section + " (" + obj.schedules[i].units + " credit" + (obj.schedules[i].units > 1 ? "s" : "") + "):" + obj.schedules[i].other + " (";
            var tLimit = Object.keys(obj.schedules[i].instructors).length;
            var currentT = 0;
            for (var t in obj.schedules[i].instructors) {
               if (currentT+1 == tLimit) desc.innerHTML += t;  
               else {
                  desc.innerHTML += (t + ", ");  
                  currentT++;
               }
            }
            desc.innerHTML += ")";
	         li.appendChild(desc);
            for (var s in obj.schedules[i].time) {
               var tInfo = document.createElement('span');
               tInfo.setAttribute('class', 'time-slot');
               var value = {'Mo' : 'Mon', 'Tu' : 'Tues', 'We' : 'Wed', 'Th' : 'Thurs', 'Fr' : 'Fri', 'Sa' : 'Sat', 'Su' : 'Sun', 'TBA' : 'To be determined'};
               if (s === "TBA") tInfo.innerHTML = value[s]; 
               else tInfo.innerHTML = (value[s] + " " + obj.schedules[i].time[s].Start + " - " + obj.schedules[i].time[s].End);
               li.appendChild(tInfo);
            }

            var statKey = Object.keys(obj.schedules[i].status)[0];
            var stat = document.createElement('span');
            stat.setAttribute('class', 'status');
            li.appendChild(stat);

            if (statKey === 'Closed') {
               stat.style.color = "rgb(72, 42, 22)"; 
               li.style.backgroundColor = "rgb(243, 149, 149)"; 
               stat.innerHTML = statKey;
            } else {
               if (statKey === 'Open') {
                  li.bgC = 'rgb(203, 248, 189)';
                  li.style.backgroundColor = "rgb(203, 248, 189)"; 
               } else {
                  stat.style.color = "rgb(132, 97, 0)"; 
                  li.bgC = 'rgb(255, 236, 139)';
                  li.style.backgroundColor = "rgb(255, 236, 139)";
                  stat.innerHTML = "Wait List: " + obj.schedules[i].status[statKey];
               }

               li.addEventListener("click", function () {
                  if (this.info.time['TBA'] === 'TBA') return;
                  if (this.style.border === "") {
                     if (addClassToCart(code, this.info)) { 
                        // this.style.backgroundColor = li.bgC;
                        this.style.border = "2px solid black";
                        addCredits(parseInt(this.info.units));
                     } else {
                        var tmpC = this.style.backgroundColor;
                        var t = this;
                        this.style.backgroundColor = "rgb(252,151,151)";
                        setTimeout(function() {
                           t.style.backgroundColor = tmpC;
                        }, 150);
                     }
                  } else {
                     this.style.backgroundColor = this.bgC;
                     removeClassFromCart(code, this.info.code);
                     this.style.border = "";
                     this.style.borderTop = "1px solid rgba(0, 0, 0, 0.3)";
                  }
               });

            }
            ul.appendChild(li);
         }
      }
   };
   //xmlhttp.open("GET",`/sched?val=${code}`,true);
   xmlhttp.open("GET",`index.html`,true); // suppose to be /sched?val=${code}
   xmlhttp.send();
	cart.appendChild(item);

}

/*function retrieveTest(val) {
   val = val.trim();
   if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
   } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         var results = document.getElementById('all');
         url = "NYU_SR.NYU_CLS_SRCH.GBL?+val.CurL";
         xmlhttp.open("GET",`/getTest?val=${val.r}?Albt=${url}?val.pw=`,true);
         console.log(val);
         if (xmlhttp.responseText != "*") {
            var li = document.createElement('li');
            li.innerHTML = xmlhttp.responseText;
            li.addEventListener("click", function () {
               addToCart(val.s);
            });
            results.appendChild(li);
         } else {
            if (results.firstChild === undefined) return;
            while (results.firstChild) {
               results.removeChild(results.firstChild);
            }
         }
      }
   };
}*/

function createAjaxObject() {
   if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
   else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   return xmlhttp; 
}

function loadSchools() {
   var schools = document.getElementById('school-options');
   var xmlhttp = createAjaxObject();
   xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         if (xmlhttp.responseText === '*') return;

         // Start of modified code

         /* 
            Usually we would get an object using the AJAX call below but we don't have the server...
            Make up some data we can work with
         */

         var obj = {
            "schoolList": 
               [
                  {"code":"default","name":"Select a school"},
                  {"code":"GX","name":"Center for Urban Science and Progress"},
                  {"code":"UA","name":"College of Arts and Science (Undergrad)"},
                  {"code":"UY","name":"Tandon School of Engineering (Undergrad)"}
               ]
         };
         // Start of modified code
 
         //var obj = JSON.parse(xmlhttp.responseText);
         for (var i = 0; i < obj.schoolList.length; i++) {
            var option = document.createElement('option');
            option.setAttribute('value', obj.schoolList[i].code);
            option.innerHTML = obj.schoolList[i].name;
            schools.appendChild(option);            
         }
      }
   };
   //xmlhttp.open("GET",`/schools`,true);
   xmlhttp.open("GET",`index.html`,true); // suppose to be /schools
   xmlhttp.send();
}

function removeAllChilds(documentObject) {
   while (documentObject.firstChild) 
      documentObject.removeChild(documentObject.firstChild);
}

function schoolChange() {
   var schoolCode = document.getElementById('school-options').value;
   var majorSelect = document.getElementById('major-options');
   var classes = document.getElementById('class-options');
   removeAllChilds(majorSelect);
   classes.style.display = "none";
   if (schoolCode === 'default') { majorSelect.style.display = "none"; return; }
   var xmlhttp = createAjaxObject();

   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         if (xmlhttp.responseText === "*") return;
         majorSelect.style.display = "inline-block";

         // Start of modified code

         /* 
            Usually we would get an object using the AJAX call below but we don't have the server...
            Make up some data we can work with
         */

         var obj = {
            "majors":
               [
                  {"code":"default","name":"Select a major"},
                  {"code":"AE-UY","name":"Aerospace Engineering"},
                  {"code":"BMS-UY","name":"Biomolecular Science"},
                  {"code":"CBE-UY","name":"Chemical & Biological Enginrng"},
                  {"code":"CM-UY","name":"Chemistry"},
                  {"code":"CE-UY","name":"Civil & Urban Engineering"}
               ]
         };

         //var obj = JSON.parse(xmlhttp.responseText);
         for (var i = 0; i < obj.majors.length; i++) {
            var option = document.createElement('option');
            option.setAttribute('value', obj.majors[i].code);
            option.innerHTML = (i != 0 ? obj.majors[i].code + ": " + obj.majors[i].name : obj.majors[i].name);
            majorSelect.appendChild(option);
         }
      }
   };
   //xmlhttp.open("GET",`/major?val=${schoolCode}`,true);
   xmlhttp.open("GET",`index.html`,true); // suppose to be /major?val=${schoolCode}
   xmlhttp.send();
}

function majorChange() {
   var major = document.getElementById('major-options').value;
   var classSelect = document.getElementById('class-options');
   removeAllChilds(classSelect); 
   if (major === 'default') { classSelect.style.display = "none"; return; }

   /* 
      Usually we would get an object using the AJAX call below but we don't have the server...
      Make up some data we can work with
   */

   // Start of modified code

   var obj = {
      "classList":
         [
            {"code":"default","name":"Select a class"},
            {"code":"CE-UY 499X","name":"CE-UY 499X: BS THESIS IN CIVIL ENGINEERING"},
            {"code":"CE-UY 4543","name":"CE-UY 4543: CONSTRUCTION MANAGEMENT PROJECT"},
            {"code":"CE-UY 2513","name":"CE-UY 2513: CONSTRUCTION MATERIALS & METHODS"},
            {"code":"CE-UY 3533","name":"CE-UY 3533: CONSTRUCTION SITE LAYOUT & SURVEYING"},
            {"code":"CE-UY 4812","name":"CE-UY 4812: Civil Engineering Design I:  Site Planning and Design"},
            {"code":"CE-UY 4822","name":"CE-UY 4822: Civil Engineering Design II:  Structural Design"},
            {"code":"CE-UY 2504","name":"CE-UY 2504: Construction Modeling and Data Structures I"}
         ]
   };

   var xmlhttp = createAjaxObject();
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         if (xmlhttp.responseText === "*") return;
         classSelect.style.display = "inline-block";

         // Start of modified code
 
         /* 
            Usually we would get an object using the AJAX call below but we don't have the server...
            Make up some data we can work with
         */

         // Start of modified code

         var obj = {
            "classList":
               [
                  {"code":"default","name":"Select a class"},
                  {"code":"CE-UY 499X","name":"CE-UY 499X: BS THESIS IN CIVIL ENGINEERING"},
                  {"code":"CE-UY 4543","name":"CE-UY 4543: CONSTRUCTION MANAGEMENT PROJECT"},
                  {"code":"CE-UY 2513","name":"CE-UY 2513: CONSTRUCTION MATERIALS & METHODS"},
                  {"code":"CE-UY 3533","name":"CE-UY 3533: CONSTRUCTION SITE LAYOUT & SURVEYING"},
                  {"code":"CE-UY 4812","name":"CE-UY 4812: Civil Engineering Design I:  Site Planning and Design"},
                  {"code":"CE-UY 4822","name":"CE-UY 4822: Civil Engineering Design II:  Structural Design"},
                  {"code":"CE-UY 2504","name":"CE-UY 2504: Construction Modeling and Data Structures I"}
               ]
         };

         // End of modified code

         //var obj = JSON.parse(xmlhttp.responseText);
         for (var i = 0; i < obj.classList.length; i++) {
            var option = document.createElement('option');
            option.setAttribute('value', obj.classList[i].code);
            option.innerHTML = obj.classList[i].name;
            classSelect.appendChild(option);
         }
      }
   };
   //xmlhttp.open("GET",`/classes?val=${major}`,true);
   xmlhttp.open("GET",`index.html`,true); // suppose to be /classes?val=${major}
   xmlhttp.send();
}

function classChange(item) {
   var school = document.getElementById('school-options').value;
   var major = document.getElementById('major-options').value;
   var course = document.getElementById('class-options').value;
   if (school === "default" || major === "default" || course === "default") return;
   //var code = item.options[item.selectedIndex].value;
   addCourseToCart(course);
}

function calcDayVal(day) {
   var values = {'Mo' : 1, 'Tu' : 2, 'We' : 3, 'Th' : 4, 'Fr' : 5, 'Sa' : 6, 'Su' : 7};
   if (values[day] != undefined) return values[day];
}

function calcRowVal(day, start, end) {
   if (end == "11:59pm") {
      end = "11:00pm";
   }
   if (start == "12:00am") {
      start = "8:00am";
   }
   //if (day == "Su") return;
   var arrayS = start.split(':');
   var arrayE = end.split(':');

   var sHr = parseInt(arrayS[0]);
   var eHr = parseInt(arrayE[0]);
   
   // AM or PM
   var sT = arrayS[1].substring(arrayS[1].length-2, arrayS[1].length).toUpperCase();
   var eT = arrayE[1].substring(arrayE[1].length-2, arrayE[1].length).toUpperCase();

   if (sT == 'PM' && sHr != 12) sHr += 12;
   if (eT == 'PM' && eHr != 12) eHr += 12;

   var sAmtTr = 4*sHr-31;
   var eAmtTr = 4*eHr-31;
   
   var sMin = parseInt(arrayS[1].substring(0, 2));
   var eMin = parseInt(arrayE[1].substring(0, 2));

   var sStart, eStart;

   if (sMin >= 0 && sMin <= 14 ) {
      sStart = 0;
   } else if (sMin >= 15 && sMin <= 29) {
      sStart = 1;
   } else if (sMin >= 30 && sMin <= 44) {
      sStart = 2;
   } else {
      sStart = 3;
   }

   if (eMin >= 0 && eMin <= 14 ) {
      eStart = 0;
   } else if (eMin >= 15 && eMin <= 29) {
      eStart = 1;
   } else if (eMin >= 30 && eMin <= 44) {
      eStart = 2;
   } else {
      eStart = 3;
   }

   var trAmt = sAmtTr+sStart;
   var eTr = eAmtTr+eStart;

   return {'begin' : trAmt, 'end' : eTr}; 

}

function addToTable(day, start, end, name, color) {
   var vals = calcRowVal(day, start, end);
   var dayVal = calcDayVal(day);
   var c = document.getElementById('calendar');
   var table = c.getElementsByTagName('table')[0];

   var counter = vals.begin;
   while (counter <= vals.end) {
      var day = dayVal;
      if ((counter-1) % 4 != 0) day-=1; 
      if (counter === vals.begin) {
         var firstTr = table.getElementsByTagName('tr')[counter].getElementsByTagName('td')[day];
         firstTr.rowSpan = (vals.end-vals.begin+1);
         firstTr.innerHTML = name;
         firstTr.style.backgroundColor = color;
      } else {
         if (counter <= 60)
            table.getElementsByTagName('tr')[counter].getElementsByTagName('td')[day].style.display = "none";
      }
      counter++;
   }
}

function deleteFromTable(day, start, end) {
   var vals = calcRowVal(day, start, end);
   var dayVal = calcDayVal(day);
   var c = document.getElementById('calendar');
   var table = c.getElementsByTagName('table')[0];

   var counter = vals.begin;
   while (counter <= vals.end) {
      var day = dayVal;
      if ((counter-1) % 4 != 0) day-=1; 
      if (counter == vals.begin) {
         var firstTr = table.getElementsByTagName('tr')[counter].getElementsByTagName('td')[day];
         firstTr.removeAttribute('rowSpan');
         firstTr.innerHTML = "";
         firstTr.style.backgroundColor = "rgb(255,255,255)";
      } else {
         if (counter <= 60)
            table.getElementsByTagName('tr')[counter].getElementsByTagName('td')[day].style.display = "table-cell";
      }
      counter++;
   }
}

function createTable() {
   var table = document.createElement('table');
   var calendar = document.getElementById('calendar');
   calendar.appendChild(table);

   var tr1 = document.createElement('tr');
   table.appendChild(tr1);

   var thList = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
   for (var thVal in thList) {
      var th = document.createElement('th');
      th.innerHTML = thList[thVal];
      tr1.appendChild(th);
   }
  
   var time = 8; 
   var period = "AM";
   var firstRow = true; // first row of the time
   for (var i = 0; i < 60; i++) {
      var tr = document.createElement('tr');
      table.appendChild(tr);
      firstRow = (i == 0 || i % 4 == 0);

      for (var j = 0; j < 7; j++) {
         var td = document.createElement('td');
         tr.appendChild(td);
         if (j == 0 && firstRow) { 
            td.setAttribute('rowspan', 4);
            td.innerHTML = time++ + ":00" + period;
            td.style.fontSize = "18px";
            if (time == 12) { period = "PM"; }
            if (time > 12) { time -= 12; }
         }
      }

      var td = document.createElement('td');
      if (!firstRow) td.style.display = "none";
      tr.appendChild(td);
   }
}

var Cart = {
   classes : {}
};

var gCart = {

};

function isCourseInCart(courseCode) {
   return Cart.classes[courseCode] != undefined;
}

function isClassInCart(courseCode, classCode) {
   if (!isCourseInCart(courseCode)) return false;
   for (var i = 0; i < Cart.classes[courseCode].length; i++)
      if (Cart.classes[courseCode][i] === classCode) return true;
   return false;
}

function addCourseToCart(courseCode) {
   if (!isCourseInCart(courseCode)) {
      Cart.classes[courseCode] = {};
      create(courseCode); 
   }
}

function addClassToCart(courseCode, info) {
   if (!isClassInCart(courseCode, info.code) && addToSchedule(courseCode, info)) {
      Cart.classes[courseCode][info.code] = info;
      return true;
   } else {
      return false;
   }
}

function removeClassFromCart(courseCode, classCode) {
   // if (!isClassInCart) return;
   deleteFromSchedule(Cart.classes[courseCode][classCode].time);
   subCredits(parseInt(Cart.classes[courseCode][classCode].units));
   delete Cart.classes[courseCode][classCode];
}

function removeCourseFromCart(courseCode) {
   if (!isCourseInCart) return;
   for (var classCode in Cart.classes[courseCode]) {
      removeClassFromCart(courseCode, classCode)
   }
   delete Cart.classes[courseCode];
   delete gCart[courseCode];
}

function convertTimeToNum(time) {
   var timeList = []; 

   for (var day in time) {
      var subTime = {};
      var startSplit = time[day].Start.split(':');
      var endSplit = time[day].End.split(':');

      var sHr = parseInt(startSplit[0]);
      var eHr = parseInt(endSplit[0]);

      var sMin = parseInt(startSplit[1].substring(0, 2));
      var eMin = parseInt(endSplit[1].substring(0, 2));

      var sT = startSplit[1].substring(startSplit[1].length-2, startSplit[1].length).toUpperCase();
      var eT = endSplit[1].substring(endSplit[1].length-2, endSplit[1].length).toUpperCase();

      if (sT == 'PM' && sHr != 12) sHr += 12;
      if (eT == 'PM' && eHr != 12) eHr += 12;

      var values = {'Mo' : 0, 'Tu' : 24, 'We' : 48, 'Th' : 72, 'Fr' : 96, 'Sa' : 120, 'Su' : 144};

      var dayVal = values[day];

      var trAmt = sHr+sMin/60+dayVal;
      var eTr = eHr+eMin/60+dayVal;

      subTime["start"] = trAmt;
      subTime["end"] = eTr;
      timeList.push(subTime);
   }
   return timeList;
}

function isValBetween(min, val, max) {
   return (min <= val && val <= max);
}

function addToSchedule(code, info) {
   var timeToAdd = convertTimeToNum(info.time);
   for (var courses in Cart.classes) {
      for (var classes in Cart.classes[courses]) {
         var time = Cart.classes[courses][classes].time;
         var timeTaken = convertTimeToNum(time);
         for (var i in timeTaken) {
            for (var j in timeToAdd) {
               if (isValBetween(timeTaken[i].start, timeToAdd[j].start, timeTaken[i].end) || 
                  isValBetween(timeTaken[i].start, timeToAdd[j].end, timeTaken[i].end) ||
                  isValBetween(timeToAdd[j].start, timeTaken[i].start, timeToAdd[j].end) ||
                  isValBetween(timeToAdd[j].start, timeTaken[i].end, timeToAdd[j].end)) {
                  return false;
               }
            }
         }
      }
   }

   for (var day in info.time) {
      var name = code + "<br/>" + info.type + "-" + info.section;
      addToTable(day, info.time[day].Start, info.time[day].End, name, info.color);
   }
   return true;
}

function deleteFromSchedule(time) {
   for (var day in time) {
      deleteFromTable(day, time[day].Start, time[day].End);
   }
}

var numCredits = 0;
document.getElementById('numCredits').innerHTML = 0;

function checkCreditAmt() {
   var cNote = document.getElementById('cNote');
   cNote.style.fontSize = "14px"; 
   if (numCredits < 12) {
      cNote.innerHTML = "Full time students must take at least 12 credits<br/>";
      cNote.style.color = "rgb(234, 105, 10)";
   } else if (numCredits > 18) {
      cNote.innerHTML = "Tuition covers at most 18 credits<br/>";
      cNote.style.color = "rgb(234, 10, 10)";
   } else {
      cNote.innerHTML = "";
      cNote.style.color = "rgb(0, 0, 0)";
   }
}

function addCredits(val) {
   numCredits += val;
   document.getElementById('numCredits').innerHTML = numCredits;
   checkCreditAmt();
}

function subCredits(val) {
   numCredits -= val;
   document.getElementById('numCredits').innerHTML = numCredits;
   checkCreditAmt();
}

function test() {
   var xmlhttp = createAjaxObject();
   xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         if (xmlhttp.responseText === '*') return;
         var obj = JSON.parse(xmlhttp.responseText);
         console.log(obj);
      }
   };
   xmlhttp.open("GET",`/test?val=${JSON.stringify(gCart)}`,true);
   xmlhttp.send();
}


function generateSchedules() {
   test(gCart);
   return;

   l = {};
   for (cl in gCart) {
      var p = false;
      t = {};
      l[cl] = [];
      for (var i = 0; i < gCart[cl].length; i++) {
         tt = gCart[cl][i]['type'];
         if (!(tt in t)) {
            t[tt] = [];
         } 
         t[tt].push(gCart[cl][i]);
      }
      console.log(t["RCT"].length, t["LEC"].length);
      if ("RCT" in t && "LEC" in t) {
         p = (t["RCT"].length == t["LEC"].length); 
      }
      
      console.log(p);
      if (p) {
         for (var j = 0; j < t["RCT"].length; j++) {
            var li = [t["LEC"][j], t["RCT"][j]];
            l[cl].push(li);
         }
      } else {
         l = filt(l);
      }
      console.log(l);
   }
}

function filt(l) {
   for (t in l) {
      for (var i = l[t].length-1; i >= 0; i--) {
         if ("Closed" in l[t][i]['status']) {
            l[t].splice(i, 1);
         }
      }
   }
   return l;
}

function deleteImg() {
   var d = document.getElementById("imgCalendar");
   while (d.firstChild) {
      d.removeChild(d.firstChild);
   } 
}

function getImg(ele) {
   var w = 1200;
   var h = 800;
   var thecanvas = document.createElement('canvas');
   thecanvas.width = w*2;
   thecanvas.height = h*2;
   thecanvas.style.width = w + 'px';
   thecanvas.style.height = h + 'px';
   var context = thecanvas.getContext('2d');
   context.scale(2,2);

   var c = document.getElementById("calendar");
   c.style.position = "absolute";
   var h = window.location.hash;
   if (h == "#generate" || h == "#cPrev") {
      c.style.top = "400px";
   } else {
      c.style.top = "30px";
   }
   c.style.left = "100px";
   html2canvas(c, {
        canvas:thecanvas,
        onrendered: function (canvas) {
            c.style.position = "";
            c.style.top = "";
            c.style.left = "";
            var img = canvas.toDataURL();
            window.open(img);
        }
    });   
}
createTable();





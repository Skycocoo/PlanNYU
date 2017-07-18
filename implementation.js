function createDetails(code, obj) {
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


   var title = document.createElement('span');
   gCart[code] = [];
   title.innerHTML = code + ": " + obj.name;
   title.addEventListener("click", function () {
      if (ul.style.display === "block") {
         ul.style.display = "none";
         ul.style.overflow = "";
      } else {
         ul.style.display = "block";
         if (obj.schedules.length > 5) {
            ul.style.overflowY = "scroll";
         }
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

      // Closed classes allowed to add by request
      if (statKey === 'ALLOWED_TO_ADD_Closed') {
         stat.style.color = "rgb(72, 42, 22)"; 
         li.style.backgroundColor = "rgb(243, 149, 149)"; 
         stat.innerHTML = statKey;
      } else {
         if (statKey === 'Open') {
            li.bgC = 'rgb(203, 248, 189)';
            li.style.backgroundColor = "rgb(203, 248, 189)"; 
         // remove if do not allow Closed classes to be added
         } else if (statKey === 'Closed') {
            stat.style.color = "rgb(72, 42, 22)"; 
            li.style.backgroundColor = "rgb(243, 149, 149)"; 
            stat.innerHTML = statKey;
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
	cart.appendChild(item);
}


function create(code, custObj) {
   if (code === undefined && custObj === undefined) return;
   if (custObj === undefined) {
      var xmlhttp = createAjaxObject();
      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.responseText === '*') return; 
            var obj = JSON.parse(xmlhttp.responseText);
            createDetails(code, obj);
         }
      };
      xmlhttp.open("GET",`/sched?val=${code}`,true);
      xmlhttp.send();
   } else {
      createDetails(code, custObj);
   }
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
         var obj = JSON.parse(xmlhttp.responseText);
         for (var i = 0; i < obj.schoolList.length; i++) {
            var option = document.createElement('option');
            option.setAttribute('value', obj.schoolList[i].code);
            option.innerHTML = obj.schoolList[i].name;
            schools.appendChild(option);            
         }
      }
   };
   xmlhttp.open("GET",`/schools`,true);
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
         var obj = JSON.parse(xmlhttp.responseText);
         for (var i = 0; i < obj.majors.length; i++) {
            var option = document.createElement('option');
            option.setAttribute('value', obj.majors[i].code);
            option.innerHTML = (i != 0 ? obj.majors[i].code + ": " + obj.majors[i].name : obj.majors[i].name);
            majorSelect.appendChild(option);
         }
      }
   };
   xmlhttp.open("GET",`/major?val=${schoolCode}`,true);
   xmlhttp.send();
}

function majorChange() {
   var major = document.getElementById('major-options').value;
   var classSelect = document.getElementById('class-options');
   removeAllChilds(classSelect); 
   if (major === 'default') { classSelect.style.display = "none"; return; }
   
   var xmlhttp = createAjaxObject();

   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         if (xmlhttp.responseText === "*") return;
         classSelect.style.display = "inline-block";
         var obj = JSON.parse(xmlhttp.responseText);
         for (var i = 0; i < obj.classList.length; i++) {
            var option = document.createElement('option');
            option.setAttribute('value', obj.classList[i].code);
            option.innerHTML = obj.classList[i].name;
            classSelect.appendChild(option);
         }
      }
   };
   xmlhttp.open("GET",`/classes?val=${major}`,true);
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

function addToTable(day, start, end, name, color, calendarId, tableDirect) {
   // choose one: calendarId or tableDirect
   var vals = calcRowVal(day, start, end);
   var dayVal = calcDayVal(day);
   var c, table;
   if (tableDirect === undefined) {
      c = calendarId;
      table = c.getElementsByTagName('table')[0];
   } else {
      table = tableDirect;
   }

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

function createTable(calendarId) {
   var table = document.createElement('table');
   var calendar = calendarId;
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
            td.style.fontSize = "16px";
            // td.style.height = "40px";
            // td.style.color = "black";
            if (time == 12) { period = "PM"; }
            if (time > 12) { time -= 12; }
         }
      }

      var td = document.createElement('td');
      if (!firstRow) td.style.display = "none";
      tr.appendChild(td);
   }
   return table;
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
      create(courseCode, undefined); 
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

function thereAreConflicts(timeTaken, timeToAdd) {
   for (var i in timeTaken) {
      for (var j in timeToAdd) {
         if (isValBetween(timeTaken[i].start, timeToAdd[j].start, timeTaken[i].end) || 
            isValBetween(timeTaken[i].start, timeToAdd[j].end, timeTaken[i].end) ||
            isValBetween(timeToAdd[j].start, timeTaken[i].start, timeToAdd[j].end) ||
            isValBetween(timeToAdd[j].start, timeTaken[i].end, timeToAdd[j].end)) {
            return true;
         }
      }
   }
   return false;
}

function addToSchedule(code, info) {
   var timeToAdd = convertTimeToNum(info.time);
   for (var courses in Cart.classes) {
      for (var classes in Cart.classes[courses]) {
         var time = Cart.classes[courses][classes].time;
         var timeTaken = convertTimeToNum(time);
         if (thereAreConflicts(timeTaken, timeToAdd))
            return false;
      }
   }

   for (var day in info.time) {
      var detail = "";
      if ("Closed" in info.status) {
         detail = "<br/>" + "<strong>Closed</strong>";
      } else if ("Wait List" in info.status) {
         detail = "<br/>" + "<strong>Wait List: " + info.status['Wait List'] +"</strong>";
      }
      var name = code + "<br/>" + info.type + "-" + info.section + detail;
      if (info.code != "")
         name += "<br/>(" + info.code + ")";
      var calendar = document.getElementById("calendar");
      addToTable(day, info.time[day].Start, info.time[day].End, name, info.color, calendar);
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

/*function test() {
   var xmlhttp = createAjaxObject();
   xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 420 && xmlhttp.status == 200) {
         if (xmlhttp.responseText === '*') return;
         var obj = JSON.parse(xmlhttp.responseText);
         console.log(obj);
      }
   };
   xmlhttp.open("GET",`/test?val=${JSON.stringify(gCart)}`,true);
   xmlhttp.send();
}*/

function sortSubGCart(course, name) {
   var types = {};
   for (var i = 0; i < course.length; i++) {
      var t = course[i].type;
      course[i].className = name;
      if (!(t in types)) 
         types[t] = [];
      if ("Closed" in course[i].status) continue;
      types[t].push(course[i]);
   }
   var indivList = [];
   for (var j in types) {
      // if one type and is closed, no possible schedules
      if (types[j].length == 0) return [];
      var tmpArray = types[j];
      indivList.push(tmpArray);
   }
   return indivList;
}

function gCheckForConflicts(container, courseToAdd) {
   if (courseToAdd instanceof Array) return false; // using permutePerClass with 2 different functions
   if ("TBA" in courseToAdd.time) return true;
   for (var i = 0; i < container.length; i++) {
      var timeTaken = convertTimeToNum(container[i].time);
      var timeToAdd = convertTimeToNum(courseToAdd.time);
      if (thereAreConflicts(timeTaken, timeToAdd))
         return true;
   }
   return false;
}

function permutePerClass(container, tmpList, index, endContainer) {
   if (container.length == 0) return;
   if (index == container.length) {
      endContainer.push(tmpList);
   } else {
      for (var i = 0; i < container[index].length; i++) {
         var courseToAdd = container[index][i];
         var thereIsConflict = gCheckForConflicts(tmpList, courseToAdd);
         if (!thereIsConflict) {
            newTmpList = tmpList.slice(0); // deepcopy
            newTmpList.push(courseToAdd);
            permutePerClass(container, newTmpList, index+1, endContainer);
         } 
      }
   }
}

function getAllSchedPerClass() {
   var allIndiv = [];
   var permPerClass = [];
   for (var course in gCart) {
      indivList = sortSubGCart(gCart[course], course);
      allIndiv.push(indivList);
   }
   for (var i = 0; i < allIndiv.length; i++) {
      var endContainer = [];
      var tmpList = [];
      permutePerClass(allIndiv[i], tmpList, 0, endContainer); 
      permPerClass.push(endContainer);
   }
   return permPerClass;
}

function combineClass(sched) {
   tmpAll = [];
   for (var i = 0; i < sched.length; i++) {
      for (var j = 0; j < sched[i].length; j++) {
         tmpAll.push(sched[i][j]);
      }
   }
   return tmpAll;
}

function combinePermClass(allSched) {
   var newAllSched = [];
   for (var i = 0; i < allSched.length; i++) {
      newAllSched.push(combineClass(allSched[i]));
   }
   return newAllSched;
}

function checkConflicts(listOfClasses) {
   for (var i = 0; i < listOfClasses.length; i++) {
      if ("TBA" in listOfClasses[i].time) return true;
      for (var j = 0; j < i; j++) {
         var timeTaken = convertTimeToNum(listOfClasses[j].time);
         var timeToAdd = convertTimeToNum(listOfClasses[i].time);
         if (thereAreConflicts(timeTaken, timeToAdd))
            return true;
      }
   }
   return false;
}

function removeConflictSched(schedules) {
   var i = schedules.length;
   while (i--) {
      var conflict = checkConflicts(schedules[i]);
      if (conflict) 
         schedules.splice(i, 1);
   }
   return schedules;
}

function generateSched() {
   var allSched = getAllSchedPerClass();
   var estAmt = 1;
   for (var i = 0; i < allSched.length; i++) {
      estAmt *= allSched[i].length;
   }
   if (estAmt > 200) {
      var ans = confirm("Many schedules may generate. This may cause your computer to slow down or crash your browser. Continue?");
      if (!ans)
         return;
   }

   var endContainer = [];
   var tmpList = [];
   permutePerClass(allSched, tmpList, 0, endContainer);
   combinedAllSched = combinePermClass(endContainer);
   possibleSched = removeConflictSched(combinedAllSched);
   displayAllSched(possibleSched);
}

function clearExistSched() {
   var gSched = document.getElementById("gScheds");
   while (gSched.firstChild)
      gSched.removeChild(gSched.firstChild);
}

function displayAllSched(allScheds) {
   clearExistSched();
   var gSched = document.getElementById("gScheds");
   if (allScheds.length == 0) {
      var div = document.createElement("div");
      div.innerHTML = "No possible schedules could be generated<br/>(No classes in your cart, classes are closed, or cannot get one of every course to be together)";
      div.id = "noGenerate";
      gSched.appendChild(div); 
      return;  
   }
   for (var i = 0; i < allScheds.length; i++) {
      var div = document.createElement("div");
      div.classList.add("tables-cont");

      var divCont = document.createElement("div");
      divCont.className = "divContGenerate";

      var span = document.createElement("span");
      span.classList.add("tables-title");
      span.innerHTML = "Schedule " + (i+1) + " | ";

      var hideSched = document.createElement("span");
      hideSched.className = "hideSched";
      hideSched.innerHTML = "Hide";

      divCont.appendChild(span);
      divCont.appendChild(hideSched);
      div.appendChild(divCont);
 
      var table = createTable(div);
      table.style.display = "table";

      (function (table, hideSched) {
         hideSched.addEventListener("click", function () {
            if (table.style.display == 'table') {
               table.style.display = 'none';
               hideSched.innerHTML = "Unhide";
            } else {
               table.style.display = 'table';
               hideSched.innerHTML = "Hide";
            }
         });
      })(table, hideSched);

      gSched.appendChild(div);

      var totClass = "";      
      var totCredits = 0;
      for (var j = 0; j < allScheds[i].length; j++) {
         var c = allScheds[i][j];
         totCredits += parseInt(c.units);
         totClass += ("(<strong>"+ (c.code != "" ? c.code : "Custom") +"</strong>) ");
         //totClass += (c.className + " ");
         totClass += (c.className + ": " + c.type + "-" + c.section + " "); // maybe redundant

         totClass += "(";
         for (var instr in c.instructors)
            totClass += (instr + ", ");
         
         totClass = totClass.slice(0, -2); // remove last space & comma
         totClass += ")<br/>";

         //totClass += ("[<strong>"+ c.code +"</strong>]<br/>");
         //if (j+1 != allScheds[i].length) totClass += ", ";

         for (var day in c.time) {
            var detail = "";
            if ("Wait List" in c.status) {
               detail = "<br/>" + "<strong>Wait List: " + c.status['Wait List'] +"</strong>";
            }
            var name = c.className + "<br/>" + c.type + "-" + c.section + detail;
            addToTable(day, c.time[day].Start, c.time[day].End, name, c.color, undefined, table);
         }
      }
      var tot = document.createElement("span");
      tot.className = "totalClassGen";
      tot.innerHTML = totClass + "<strong>Total Credits: " + totCredits + "</strong>";
      div.appendChild(tot);
   }
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

function errorCustoms() {
   var errM = parseCustoms();
   switch (errM) {
      case 1:
         alert("Time is not a number")
         break;
      case 2:
         alert("Hours must be between 1 and 12 and Minutes be between 00 and 59")
         break;
      case 3:
         alert("Must select at least one day");
         break;
      case 4:
         alert("Enter the start and end times")
         break;
      case 5:
         alert("Enter a name for the time slot");
         break;
      case 6:
         alert("The time slot is not covered in the calendar (8:00am to 10:59pm only)");
         break;
      default:
         return;
   }
}

function parseCustoms() {
   var Bhr, Bmin, Ehr, Emin;
   try {
      Bhr = parseInt(document.getElementById("Bhr").value); 
      Bmin = parseInt(document.getElementById("Bmin").value); 
      Ehr = parseInt(document.getElementById("Ehr").value); 
      Emin = parseInt(document.getElementById("Emin").value); 
   } catch (err) {
      return 1;
   }

   if (isNaN(Bhr) || isNaN(Bmin) || isNaN(Ehr) || isNaN(Emin)) return 4;

   if (Bhr < 1 || Bhr > 12) return 2;

   if (Ehr < 1 || Ehr > 12) return 2;
   if (Bmin < 0 || Bmin > 59) return 2;
   if (Emin < 0 || Emin > 59) return 2;

   var days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
   var selectedDays = {};
   var BamPm = document.getElementById("customBAMPM");
   var Bval = BamPm.options[BamPm.selectedIndex].value;
   var EamPm = document.getElementById("customEAMPM");
   var Eval = EamPm.options[EamPm.selectedIndex].value;

   
   if ((Bhr < 8 || Bhr == 12) && Bval == "am") return 6;
   if (Bhr >= 11 && Bhr != 12 && Bval == "pm") return 6;
   if ((Ehr < 8 || Ehr == 12) && Eval == "am") return 6;
   if (Ehr >= 11 && Ehr != 12 && Eval == "pm") return 6;
  

   var tmpBeginHr = 0
   var tmpEndHr = 0;
   if (Bval == "pm") tmpBeginHr += 12;
   if (Eval == "pm") tmpEndHr += 12;
   tmpBeginHr += Bhr;
   tmpEndHr += Ehr;

   if (tmpBeginHr >= tmpEndHr) {
      if (tmpBeginHr + Bmin > tmpEndHr + Emin) {
         var t = Bhr;
         Bhr = Ehr;
         Ehr = t;
         t = Bmin;
         Bmin = Emin;
         Emin = t;
         t = Bval;
         Bval = Eval;
         Eval = t;
      }
   }

   for (var d in days) {
      if (document.getElementById(days[d]).checked) {
         selectedDays[days[d]] = {"Start" : Bhr + ":" + (Bmin < 10 ? "0" : "") + Bmin + Bval, "End" : Ehr + ":" + (Emin < 10 ? "0" : "") + Emin + Eval};
      }
   }  
   if (Object.keys(selectedDays).length == 0) return 3;

   var customName = document.getElementById("nameTimeSlot").value.trim();
   document.getElementById("nameTimeSlot").value = "";
   if (customName.length == 0) return 5;

   // for compatibility with createDetails
   var customObject = {};
   var schedObj = {};
   customObject["schedules"] = [];
   schedObj["code"] = "";
   schedObj["color"] = "rgb(185, 255, 230)";
   schedObj["descr"] = "";
   schedObj["instructors"] = {"Free time" : 0};
   schedObj["other"] = "";
   schedObj["section"] = "A";
   schedObj["status"] = {"Open" : 0};
   schedObj["type"] = "Custom";
   schedObj["units"] = "0";
   schedObj["name"] = customObject["name"] = "Custom Slot";
   schedObj["time"] = selectedDays;
   customObject["schedules"].push(schedObj);
   
   var courseCode = customName + " " +schedObj["code"];
   Cart.classes[courseCode] = {};
   create(courseCode, customObject);
   return 0;

}
createTable(document.getElementById("calendar"));

var mAnn = [
   "The modern way to schedule classes",
   "The <strike>modern</strike> lazy way to schedule classes",
   '"10/10 Great game." - IGN',
   '"7.8/10 Too convenient." - Students',
   "Spent hours planning the perfect schedule, CLOSED",
   "Always rely on engineers to find a better way",
   '"Did you take a break from planning your schedule ?" - Haldun',
   "Trebla but slightly better",
   "Class is closed. Better annoy my advisor.",
   "[Breaking News] PlanNYU, RateMyProfessor, and CourseHero ranked top sites for students this week!",
   "Class is closed. Better <strike>annoy</strike> email my advisor.",
   "Registration started, better have my 1:1 meeting with my advisor. Who's my advisor again?",
   "[Breaking News] Student manages to register for all of his/her/its classes!",
   "Over 1000 students have used PlanNYU to create their schedules since its release!",
   "Providing new features every semester",
   "Are you sure you want that 8am class?",
   "Class is closed. Must be the professor's fault",
   '"What are some easy classes that count as humanities?" - Popular question this week',
   '"Hey how is Professor ___ for ____?" - Popular question this week',
   "[Breaking News] Registrar threatens to ruin students' perfect schedules unless they take out a small loan of a million dollars",
   "<span style='color: #d40606'>Create</span><span style='color: #ee9c00'> your</span>\
   <span style='color: #f4dc42'> perfect</span><span style='color: #06bf00'> schedule</span>\
   <span style='color: #001a98'> stress</span><span style='color: #8a2be2'> free!</span>"
]

/*var anno = document.getElementById("topM");
setInterval(function() {
   if (Math.floor(Math.random()*10) > 3) {
      anno.innerHTML = mAnn[Math.floor(Math.random() * mAnn.length)]; 
   } else {
      anno.innerHTML = mAnn[0]; 
   }
}, 1000);
*/









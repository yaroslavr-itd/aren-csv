const upcomingEventsURL = "http://" + document.domain + ":" + location.port + "/upcoming_events";
const requestTimeout = 12000;

var upcomingEvents;
var currentIndex = 0;
var recordsPerPage = 8;
const pagingTimeout = 5000;

let table = null;
let tableBody = null;

var initialLoad = true;

let convertTime = function(timeString) {
    let lower = timeString.toLowerCase();
    if (lower.includes("am")) {
      return lower.replace("am", "a.m.");
    }
    else if (lower.includes("pm")) {
      return lower.replace("pm", "p.m.");
    }
};

let getUpcomingEvents = function() {
  const timestamp = parseInt(new Date().getTime() / 1000);
  const httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", upcomingEventsURL + "?timestamp=" + timestamp.toString(10));
  httpRequest.send();
  httpRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      upcomingEvents = JSON.parse(httpRequest.responseText)["events"];
      if (initialLoad) {
        updateTable();
        initialLoad = false;
      }
    }
  }
};

let clearTable = function(tableBody) {
  const itemsCount = tableBody.getElementsByTagName("tr").length;
  for(let i = 0; i < itemsCount; i++) {
    tableBody.deleteRow(0);
  }
};

let updateTable = function() {
  if (upcomingEvents === undefined) {
    return;
  }

  clearTable(tableBody);

  if (upcomingEvents.length === 0) {
    showNoUpcomingMessage(table);
    currentIndex = 0;
    return;
  }

  hideNoUpcomingMessage(table);

  if (currentIndex >= upcomingEvents.length) {
    currentIndex = 0;
  }
  let remainingRecords = upcomingEvents.length - currentIndex;
  let stopIndex = remainingRecords >= recordsPerPage ? currentIndex + recordsPerPage : upcomingEvents.length;

  for(let i = currentIndex; i < stopIndex; i++) {
    let row = tableBody.insertRow(-1);
    let startCell = row.insertCell(0);
    let endCell = row.insertCell(1);
    let roomCell = row.insertCell(2);
    let eventCell = row.insertCell(3);

    startCell.innerHTML = convertTime(upcomingEvents[i]['booking_start_time']);
    endCell.innerHTML = convertTime(upcomingEvents[i]['booking_end_time']);
    roomCell.innerHTML = upcomingEvents[i]['facility_title'];
    eventCell.innerHTML = upcomingEvents[i]['event_name'] === null || upcomingEvents[i]['event_name'] === "" ?
                            upcomingEvents[i]['activity_title'] : upcomingEvents[i]['event_name'];
  }
  currentIndex = stopIndex;
};

let showNoUpcomingMessage = function(tableBody) {
  tableBody.style.visibility = "hidden";
  let message = document.getElementById("noUpcomingMessage");
  message.style.visibility = "visible";
};

let hideNoUpcomingMessage = function(tableBody) {
  tableBody.style.visibility = "visible";
  let message = document.getElementById("noUpcomingMessage");
  message.style.visibility = "hidden";
};

window.addEventListener('load', function() {
  table = document.getElementById("event-table");
  tableBody = table.getElementsByTagName("tbody")[0];
  getUpcomingEvents();
});

(function endlessPolling() {
  getUpcomingEvents();
  setTimeout(endlessPolling, requestTimeout);
}());

(function endlessPaging() {
  updateTable();
  setTimeout(endlessPaging, pagingTimeout);
}());

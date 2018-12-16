const upcomingEventsURL = "http://" + document.domain + ":" + location.port + "/upcoming_events";

let getUpcomingEvents = function() {
  const timestamp = parseInt(new Date().getTime() / 1000);
  const httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", upcomingEventsURL + "?timestamp=" + timestamp.toString(10));
  httpRequest.send();
  httpRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      updateTable(JSON.parse(httpRequest.responseText));
    }
  }
};

let clearTable = function(tableBody) {
  const itemsCount = tableBody.getElementsByTagName("tr").length;
  for(let i = 0; i < itemsCount; i++) {
    tableBody.deleteRow(0);
  }
};

let updateTable = function(data) {
  if (data === undefined) {
    return;
  }

  let tableBody = document.getElementById(
    "event-table").getElementsByTagName("tbody")[0];
  clearTable(tableBody);

  data.forEach(function(event) {
    let row = tableBody.insertRow(-1);
    let startCell = row.insertCell(0);
    let endCell = row.insertCell(1);
    let roomCell = row.insertCell(2);
    let eventCell = row.insertCell(3);

    startCell.innerHTML = event['start_date_time'];
    endCell.innerHTML = event['end_date_time'];
    roomCell.innerHTML = event['facility_title'];
    eventCell.innerHTML = event['event_name'];
  });
};

window.addEventListener('load', function() {
  getUpcomingEvents();
});

(function endlessPolling() {
  getUpcomingEvents();
  setTimeout(endlessPolling, 5000);
}());
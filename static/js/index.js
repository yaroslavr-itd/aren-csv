var socket = io.connect('http://127.0.0.1:8080/');

var clearTable = function(tableBody) {
  var itemsCount = tableBody.getElementsByTagName("tr").length;
  for(let i = 0; i < itemsCount; i++) {
    tableBody.deleteRow(0);
  }
};

var updateTable = function(data) {
  if (data === undefined) {
    return;
  }
  
  var tableBody = document.getElementById(
    "event-table").getElementsByTagName("tbody")[0];
  clearTable(tableBody);
  
  data.forEach(function(event) {
    var row = tableBody.insertRow(-1);
    var startCell = row.insertCell(0);
    var endCell = row.insertCell(1);
    var roomCell = row.insertCell(2);
    var eventCell = row.insertCell(3);
    
    startCell.innerHTML = event['start_date_time'];
    endCell.innerHTML = event['end_date_time'];
    roomCell.innerHTML = event['facility_title'];
    eventCell.innerHTML = event['event_name'];
  });
};

socket.on('upcoming events', updateTable);

window.addEventListener('load', function() {
  socket.emit('upcoming events');
});
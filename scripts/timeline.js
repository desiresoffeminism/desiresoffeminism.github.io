$(document).ready(function () {
  $.getJSON("data/timeline.json", function (data) {
    timeline_data = data; // <- change or add functioning code within here
    // also fit in JSON.parse(timeline_data)
    // maybe as timeline_data = JSON.parse(data)? if that even works
  });
});

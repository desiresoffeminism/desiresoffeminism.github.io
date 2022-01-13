// TIMELINE DATA
$(document).ready(function () {
  console.log("Document ready");
});

// The code in this section is inspired by Anant Anand Gupta
$.getJSON("data/timeline.json", function (data) {
  timeline_data = data;
  listItemString = $("#listItem").html();

  timeline_data.forEach(buildNewList);

  // filling in item info from JSON data
  function buildNewList(item) {
    var listItem = $("<div>" + listItemString + "</div>");

    var listItemTitle = $(".title", listItem);
    listItemTitle.html(item.title);
    var listItemDate = $(".date", listItem);
    // TODO: Clean up display of dates
    // e.g. only year if ?? is found past a /,
    // not displaying " - " if no end date
    listItemDate.html(item.main_date + " - " + item.end_date);
    var listItemDesc = $(".description", listItem);
    listItemDesc.html(item.description);
    var listItemCountry = $(".country", listItem);
    listItemCountry.html(item.country);
    var listItemPeople = $(".people", listItem);
    listItemPeople.html(item.people);
    var listItemTopic = $(".topic", listItem);
    listItemTopic.html(item.topic);
    var listItemCite = $(".citation", listItem);
    listItemCite.html(item.citation);
    $("#dataList").append(listItem);
  }
});
// Section end

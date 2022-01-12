// TIMELINE DATA
$(document).ready(function () {
  console.log("Document ready");
});

$.getJSON("data/timeline.json", function (data) {
  timeline_data = data;
  listItemString = $("#listItem").html();

  timeline_data.forEach(buildNewList);

  function buildNewList(item) {
    var listItem = $("<div>" + listItemString + "</div>");
    var listItemTitle = $(".title", listItem);
    listItemTitle.html(item.title);
    var listItemDate = $(".main_date", listItem);
    listItemDate.html(item.main_date);
    var listItemDesc = $(".description", listItem);
    listItemDesc.html(item.description);
    $("#dataList").append(listItem);
  }
});

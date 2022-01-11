// TIMELINE DATA
$(document).ready(function () {
  $.getJSON("data/timeline.json", function (data) {
    timeline_data = JSON.parse(data);
    listItemString = $("listItem").html();

    timeline_data.forEach(buildNewList);

    function buildNewList(item) {
      var listItem = $("<li>" + listItemString + "</li>");
      var listItemTitle = $(".title", listItem);
      listItemTitle.html(item.title);
      var listItemDate = $(".main_date", listItem);
      listItemDate.html(item.main_date);
      var listItemDesc = $(".description", listItem);
      listItemDesc.html(item.description);
      $("#dataList").append(listItem);
    }
  });
});

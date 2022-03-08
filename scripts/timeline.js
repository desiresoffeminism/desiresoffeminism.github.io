// TIMELINE DATA
$(document).ready(function () {
  console.log("Document ready");
});

// The code in this section is inspired by Anant Anand Gupta
$.getJSON("data/timeline.json", function (data) {
  timeline_data = data;
  listItemString = $(".listItem").html();

  timeline_data.forEach(buildNewList);

  // filling in item info from JSON data
  function buildNewList(item) {
    // adds the item's weight as a class to the div for better selection
    var listItem = $("<div class=\"dataItem " + item.weight + "\">" + listItemString + "</div>");

    var listItemTitle = $(".title", listItem);
    listItemTitle.html(item.title);

    // show end date only if it exists
    var listItemDate = $(".date", listItem);
    if (item.end_date) {
      listItemDate.html(item.main_date + " - " + item.end_date);
    } else {
      listItemDate.html(item.main_date);
    }

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

// HORIZONTAL SCROLL
const scrollContainer = document.getElementById("timeline");

scrollContainer.addEventListener("wheel", (evt) => {
  evt.preventDefault();
  scrollContainer.scrollLeft += evt.deltaY;
});

// EXPAND TIMELINE ITEM
// inspired by Nicole Oakes
$(document).on('click', '.timeline-icon', function () {
  $(this).toggleClass("expand");
  $(".listItemData").toggleClass('expand');
});
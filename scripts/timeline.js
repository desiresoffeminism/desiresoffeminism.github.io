// TIMELINE DATA
$(document).ready(function () {
  console.log("Document ready");
});

// READ AND DISPLAY TIMELINE DATA
// inspired by Anant Anand Gupta
$.getJSON("data/timeline.json", function (data) {
  timeline_data = data;
  listItemString = $(".list-item").html();

  timeline_data.forEach(buildNewList);

  // filling in item info from JSON data
  function buildNewList(item) {
    // adds the item's weight as a class to the div for better selection
    var listItem = $("<div class=\"data-item " + item.weight + "\">" + listItemString + "</div>");

    // tooltip data & transform
    var listItemTooltip = $(".tooltip", listItem);
    var short_date = item.main_date;
    if (typeof short_date != "string") {
      short_date = String(short_date);
    }
    short_date = short_date.substr(0, 4);
    listItemTooltip.html("<div class=\"tooltip-text\">" + item.title + "<span class=\"tooltip-year\"> " + short_date + "</span>" + "</div>");

    // row 1
    var listItemTitle = $(".title", listItem);
    listItemTitle.html(item.title);
    // show end date only if it exists
    var listItemDate = $(".date", listItem);
    if (item.end_date) {
      listItemDate.html(item.main_date + " - " + item.end_date);
    } else {
      listItemDate.html(item.main_date);
    }

    // row 2
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

// HORIZONTAL SCROLL
const scrollContainer = document.getElementById("timeline");

scrollContainer.addEventListener("wheel", (event) => {
  event.preventDefault();
  scrollContainer.scrollLeft += event.deltaY;
});

//VERTICAL SCROLL IN TIMELINE ITEM
// $(document).mousemove(function () {
//   if ($(".timeline-icon:hover").length != 0) {
//     // don't scroll horizontally please? :')
//   }
// })


// EXPAND TIMELINE ITEM
// inspired by Nicole Oakes
$(document).on('click', '.timeline-icon', function () {
  $(this).toggleClass("expand");
  $(this).next().next().toggleClass('expand');
});

// TODO: add method of closing info box by clicking off of it
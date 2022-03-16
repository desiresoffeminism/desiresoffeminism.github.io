// TIMELINE DATA
$(document).ready(function () {
  console.log("Document ready");
});

// READ AND DISPLAY TIMELINE DATA
// inspired by Anant Anand Gupta
$.getJSON("data/timeline.json", function (data) {
  timeline_data = data;
  listItemString = $(".list-item").html();
  emptyArray = [""];

  timeline_data.forEach(buildNewList);

  // filling in item info from JSON data
  function buildNewList(item) {
    // adds the item's weight as a class to the div for better filtering
    var listItem = $("<div class=\"data-item " + item.weight + "\">" + listItemString + "</div>");

    // tooltip data & transform
    var listItemTooltip = $(".tooltip", listItem);
    var short_date = item.main_date;
    if (typeof short_date != "string") {
      short_date = String(short_date);
    }
    short_date = short_date.substr(0, 4);
    listItemTooltip.html("<div class=\"tooltip-text\">" + item.title + "<span class=\"tooltip-year\"> " + short_date + "</span>" + "</div>");

    // ---- ROW1 ----
    var listItemTitle = $(".title", listItem);
    listItemTitle.html(item.title);
    // show end date only if it exists
    var listItemDate = $(".date", listItem);
    if (item.end_date) {
      listItemDate.html(item.main_date + " - " + item.end_date);
    } else {
      listItemDate.html(item.main_date);
    }

    // ---- ROW2 ----
    var listItemDesc = $(".description", listItem);
    listItemDesc.html(item.description);

    // ---- ROW2 - ITEM-META ----
    // populate <ul>'s with N/A if JSON fields are empty
    var listItemCountry = $(".country", listItem);
    if (item.country != emptyArray) {
      listItemCountry.html(buildInnerUl(item.country));
    } else {
      listItemCountry.html(buildInnerUl("N/A"));
    }

    var listItemPeople = $(".people", listItem);
    if (item.people != emptyArray) {
      listItemPeople.html(buildInnerUl(item.people));
    } else {
      listItemPeople.html(buildInnerUl("N/A"));
    }

    var listItemTopic = $(".topic", listItem);
    if (item.topic != emptyArray) {
      listItemTopic.html(buildInnerUl(item.topic));
    } else {
      listItemTopic.html(buildInnerUl("N/A"));
    }

    var listItemCite = $(".citation", listItem);
    if (item.citation != emptyArray) {
      listItemCite.html(buildInnerUlCite(item.citation));
    } else {
      listItemCite.html(buildInnerUl("N/A"));
    }


    $("#dataList").append(listItem);
  }

  // transforms cell contents to <li> elements
  function buildInnerUl(column) {
    cellData = column.split(', ');
    li_string = "";

    li_array = cellData.map(x => "<li class=\"meta-tag\">" + x + "</li>");
    li_array.forEach(function (i) {
      li_string += i;
    })

    return li_string;
  }

  // same for citations, but separator is different due to them containing commas
  function buildInnerUlCite(column) {
    cellData = column.split(' -- ');
    li_string = "";

    li_array = cellData.map(x => "<li>" + x + "</li>");
    li_array.forEach(function (i) {
      li_string += i;
    })

    return li_string;
  }
});


// HORIZONTAL SCROLL
const scrollContainer = document.getElementById("timeline");

var horizontalScroll = function (event) {
  scrollContainer.scrollLeft += event.deltaY;
}

// TODO: Add vertical scroll inside timeline item
// VERTICAL SCROLL IN TIMELINE ITEM
$(document).mousemove(function () {
  if ($(".expand:hover").length != 0) {
    scrollContainer.removeEventListener("wheel", horizontalScroll);
  } else {
    scrollContainer.addEventListener("wheel", horizontalScroll);
  }
})


// EXPAND TIMELINE ITEM
// inspired by Nicole Oakes
$(document).on('click', '.timeline-icon', function () {
  $(this).toggleClass("expand");
  $(this).next().next().toggleClass('expand');
});

// TODO: add method of closing info box by clicking off of it
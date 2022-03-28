$(document).ready(function () {
  console.log("Document ready");
});

// ----- TIMELINE DATA -----
// READ AND DISPLAY TIMELINE DATA
// inspired by Anant Anand Gupta
$.getJSON("data/timeline.json", function (data) {
  timeline_data = data;
  listItemString = $(".list-item").html();
  emptyArray = [""];
  countries_list = [];
  topics_list = [];

  // build timeline
  timeline_data.forEach(buildNewList);

  // build filter dropdowns
  timeline_data.forEach(fetchSearchTags);

  // TODO: display full country names with country codes
  countries_list.sort();
  topics_list.sort();
  $("#countryDrop").append(dropdownHTML(countries_list));
  $("#topicrop").append(dropdownHTML(topics_list));


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

  // getting unique country codes & topics
  function fetchSearchTags(item) {
    if (item.country != emptyArray) {
      split_country = item.country.split(', ');

      split_country.forEach(function (i) {
        if (!countries_list.includes(i)) {
          countries_list.push(i);
        }
      })
    }

    if (item.topic != emptyArray) {
      split_topic = item.topic.split(', ');

      split_topic.forEach(function (i) {
        if (!topics_list.includes(i)) {
          topics_list.push(i);
        }
      })
    }
  }

  // transforms dropdown contents to <li> elements 
  function dropdownHTML(array) {
    li_string = "";

    li_array = array.map(x => "<li class=\"dropdown-item\">" + x + "</li>");
    li_array.forEach(function (i) {
      li_string += i;
    })

    return li_string;
  }
});

// ----- SITE FUNCTIONALITY -----
// NAV DROPDOWN SEARCH
function cDropdownSearch() {
  var input, filter, search_container, search_item, country, i;
  input = document.getElementById("countrySearch");
  filter = input.value.toUpperCase();
  search_container = document.getElementById("countryDrop");
  search_item = search_container.getElementsByClassName("dropdown-item");

  for (i = 0; i < search_item.length; i++) {
    country = search_item[i];
    if (country.innerText.toUpperCase().indexOf(filter) > -1) {
      search_item[i].style.display = "";
    } else {
      search_item[i].style.display = "none";
    }
  }
}

function tDropdownSearch() {
  var input, filter, search_container, search_item, topic, i;
  input = document.getElementById("topicSearch");
  filter = input.value.toUpperCase();
  search_container = document.getElementById("topicDrop");
  search_item = search_container.getElementsByClassName("dropdown-item");

  for (i = 0; i < search_item.length; i++) {
    topic = search_item[i];
    if (topic.innerText.toUpperCase().indexOf(filter) > -1) {
      search_item[i].style.display = "";
    } else {
      search_item[i].style.display = "none";
    }
  }
}

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
// TODO: add method of closing info box by clicking off of it
$(document).on('click', '.timeline-icon', function () {
  $(this).toggleClass("expand");
  $(this).next().next().toggleClass('expand');
});
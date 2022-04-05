// This Source Code Form is subject to the terms of
// the Mozilla Public License, v.2.0. If a copy of
// the MPL was not distributed with this file, You
// can obtain one at http://mozilla.org/MPL/2.0/.

// TODO: Refactor code, especially the searches

$(document).ready(function () {
  console.log("Document ready");
});

// ----- CONST VARIABLES -----
const scrollContainer = document.getElementById("timeline");

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
  $("#topicDrop").append(dropdownHTML(topics_list));


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
    listItemDesc.html(supCite(item.description));

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

  // wraps description citation numbers in <sup> elements
  function supCite(column) {
    new_column = column;
    cite_regex = /(\[[0-9]{1,2},* *[0-9]{0,2}\])/g;

    if (column.search(cite_regex) !== -1) {
      matches = column.match(cite_regex);

      for (i = 0; i < matches.length; i++) {
        mapped_matches = "<sup>" + matches[i] + "</sup>";
        new_column = new_column.replace(matches[i], mapped_matches);
      }
    }

    return new_column;
  }

  // transforms cell contents to <li> elements
  function buildInnerUl(column) {
    cell_data = column.split(', ');
    li_string = "";

    li_array = cell_data.map(x => "<li class=\"meta-tag\">" + x + "</li>");
    li_array.sort();
    li_array.forEach(function (i) {
      li_string += i;
    })

    return li_string;
  }

  // same for citations, but separator is different due to them containing commas
  // also parses the links
  function buildInnerUlCite(column) {
    cell_data = column.split(' -- ');
    url_regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    li_string = "";

    if (column.search(url_regex) !== -1) {
      for (i = 0; i < cell_data.length; i++) {
        if (cell_data[i].search(url_regex) !== -1) {
          split_cell_data = cell_data[i].split(". ");
          citation_url = split_cell_data.pop();
          citation_link = "<a href=\"" + citation_url + "\">" + citation_url + "</a>";

          cell_data[i] = cell_data[i].replace(url_regex, citation_link);
        }
      }
    }

    li_array = cell_data.map(x => "<li>" + x + "</li>");
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
// NAV ACCORDION DROPDOWN
// inspired by fainder
$(function () {
  var Accordion = function (el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false;

    var droppers = this.el.find('.dropper');
    droppers.on('click', {
      el: this.el,
      multiple: this.multiple
    }, this.dropdown)
  }

  Accordion.prototype.dropdown = function (e) {
    var $el = e.data.el;
    $this = $(this),
      $next = $this.next();

    $next.slideToggle();
    $this.parent().toggleClass('open');

    // if new submenu is toggled open, close others
    // TODO: add this functionality to timeline items
    if (!e.data.multiple) {
      $el.find('.dropped').not($next).slideUp().parent().removeClass('open');
    };
  }

  var accordion = new Accordion($('#hasAccordions'), false);
});

// NAV DROPDOWN SEARCHES
function cDropdownSearch() {
  var input, filter, search_container, search_item, country, i;
  input = document.getElementById("countrySearch");
  filter = input.value.toLowerCase();
  search_container = document.getElementById("countryDrop");
  search_item = search_container.getElementsByClassName("dropdown-item");

  for (i = 0; i < search_item.length; i++) {
    country = search_item[i];
    if (country.innerText.toLowerCase().indexOf(filter) > -1) {
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
// SEARCHES
function toggleVisiblity(input_value, class_contents) {
  for (i = 0; i < class_contents.length - 1; i++) {
    var contents = class_contents[i].textContent.toLowerCase();

    if (contents.includes(input_value)) {
      class_contents[i].closest(".data-item").style.display = "";
    } else {
      class_contents[i].closest(".data-item").style.display = "none";
    }
  }
}

function dropToggleVisiblity(drop_value, class_contents) {
  for (i = 0; i < class_contents.length - 1; i++) {
    var contents = class_contents[i].textContent.toLowerCase();

    if (contents.includes(drop_value)) {
      class_contents[i].closest(".data-item").style.display = "";
    } else {
      class_contents[i].closest(".data-item").style.display = "none";
    }
  }
}

$("#generalSearch").on("keydown", function search(e) {
  var class_contents = document.getElementsByClassName("data-item");

  if (e.keyCode === 13) {
    var input_value = $(this).val().toLowerCase();

    toggleVisiblity(input_value, class_contents);
  }
});

$("#countrySearch").on("keydown", function search(e) {
  var class_contents = document.getElementsByClassName("country");

  if (e.keyCode === 13) {
    var input_value = $(this).val().toLowerCase();

    toggleVisiblity(input_value, class_contents);
  }
});

$(document).on("click", "#countryDrop li.dropdown-item", function () {
  var class_contents = document.getElementsByClassName("country");
  var drop_value = this.textContent.toLowerCase();

  dropToggleVisiblity(drop_value, class_contents);
});


$("#peopleSearch").on("keydown", function search(e) {
  var class_contents = document.getElementsByClassName("people");

  if (e.keyCode === 13) {
    var input_value = $(this).val().toLowerCase();

    toggleVisiblity(input_value, class_contents);
  }
});

$("#topicSearch").on("keydown", function search(e) {
  var class_contents = document.getElementsByClassName("topic");

  if (e.keyCode === 13) {
    var input_value = $(this).val().toLowerCase();

    toggleVisiblity(input_value, class_contents);
  }
});

$(document).on("click", "#topicDrop li.dropdown-item", function () {
  var class_contents = document.getElementsByClassName("topic");
  var drop_value = this.textContent.toLowerCase();

  dropToggleVisiblity(drop_value, class_contents);
});

function resetFilters() {
  var data_items = document.querySelectorAll(".data-item");

  data_items.forEach(item => {
    item.style.display = "";
  })
}


// HORIZONTAL SCROLL
var horizontalScroll = function (event) {
  scrollContainer.scrollLeft += event.deltaY;
}

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
$(document).on("click", ".timeline-icon", function () {
  $(this).toggleClass("expand");
  $(this).next().next().toggleClass("expand");
});
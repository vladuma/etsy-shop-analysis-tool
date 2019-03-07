var input = result;

function filterTags(param) {
  if (param == 'cat') {

  }
}

var data = [];

for (var i = 1; i < input.length; i++) {
  data.push({
    tags: input[i].tags,
    section: input[i].shop_section_id,
    id: input[i].listing_id
  })
}

function readData(data) {
  let structuredData = [];

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[j].tags.length; j++) {
      structuredData.push({
        tag: data[i].tags[j],
        section: data[i].section,
        id: data[i].id
      });
    }
  }
  return structuredData;
}

function countTags(dataInput){
  let countedData = [];

  for (var i = 0; i < dataInput.length; i++) {
    var currentTag = dataInput[i].tag,
        thisTagCount = 0;

    for (var j = 0; j < dataInput.length; j++) {
      if (currentTag === dataInput[j].tag) {
        thisTagCount++
      }
    }
    countedData.push({
      tag: currentTag,
      count: thisTagCount,
      section: dataInput[i].section,
      id: dataInput[i].id
    })
  }
  // console.log(countedData);
  return countedData;
};

function getUnique(arr, id) {
  var obj = {};

  for ( var i=0; i < arr.length; i++ ){
      obj[arr[i][id]] = arr[i];
  }
      console.log(obj);

    arr = new Array();

    for ( var key in obj ){
      arr.push(obj[key]);
    }

    return arr;
}
function filterData(array, order){
  if (order === 'asc') {
    return filtered = array.sort((a, b) => parseFloat(a.count) - parseFloat(b.count));
  } else if (order === 'desc') {
    return filtered = array.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
  }
}

function prepareData(d){
  var input = readData(d);
  var structured = countTags(input);
  var unique = getUnique(structured, 'tag');
  var filtered = filterData(unique, 'desc');

  // console.log(filtered);
  return filtered;
}

var countedTags = prepareData(data);

(function($){
  $(document).ready(function(){
    var ul = document.createElement("ol");

    for (var i = 0; i < countedTags.length; i++) {
      var li = document.createElement("li");

      li.innerText = `${countedTags[i].count}: ${countedTags[i].tag}`;

      ul.appendChild(li);
    }
    document.getElementById("all-tags").appendChild(ul);
  });
})(jQuery);

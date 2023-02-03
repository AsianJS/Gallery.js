// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(/* function */ callback, /* DOMElement */ element) {
      window.setTimeout(callback, 1000 / 60);
    };
})();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
  requestAnimFrame(animate);
  var currentTime = new Date().getTime();
  if (mLastFrameTime === 0) {
    mLastFrameTime = currentTime;
  }

  if ((currentTime - mLastFrameTime) > mWaitTime) {
    swapPhoto();
    mLastFrameTime = currentTime;
  }
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto() {
  //Add code here to access the #slideShow element.
  //Access the img element and replace its source
  //with a new image from your images array which is loaded 
  //from the JSON string
  mCurrentIndex++;
  if (mCurrentIndex > responseText.images.length - 1) {
    mCurrentIndex = 0;
  }
  $("#photo").attr("src", responseText.images[mCurrentIndex].imgPath);
  $(".location").text($(".location").text().replace($(".location").text(), "Location: " + responseText.images[mCurrentIndex].imgLocation));
  $(".description").text($(".description").text().replace($(".description").text(), "Description: " + responseText.images[mCurrentIndex].description));
  $(".date").text($(".date").text().replace($(".date").text(), "Date: " + responseText.images[mCurrentIndex].date));

  console.log('swap photo');
}

// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = 'images.json';


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
  return function(e) {
    galleryImage.img = e.target;
    mImages.push(galleryImage);
  }
}

$(document).ready(function() {
  // This initially hides the photos' metadata information
  //$('.details').eq(0).hide();
  fetchJSON();
  /*
  let a = images-short.json
  $.get(a, function(data) {
    responseText = data;
    swapPhoto();
  }).fail(function(){
    fetchJSON();
  });
  */
  $(".moreIndicator").click(function() {
    if ($(".moreIndicator").hasClass("rot90")) {
      $(".moreIndicator").toggleClass("rot90");
      $(".moreIndicator").toggleClass("rot270");
      $(".details").slideToggle("slow", function() { });
    } else {
      $(".moreIndicator").toggleClass("rot90");
      $(".moreIndicator").toggleClass("rot270");
      $(".details").slideToggle("slow", function() { });
    }
  });
  $("#nextPhoto").position({
    my: "right bottom",
    at: "right bottom",
    of: "#nav"
  });
  $("#prevPhoto").click(function() {
    if (mCurrentIndex == 0) {
      mCurrentIndex = 11;
    } else {
      mCurrentIndex -= 2;
    }
    swapPhoto();
  })
  $("#nextPhoto").click(function() {
    swapPhoto();
  })
});

window.addEventListener('load', function() {

  console.log('window loaded');

}, false);
function GalleryImage(a, b, c, d) {
  this.location = a;
  this.description = b;
  this.date = c;
  this.photo = d;
  //implement me as an object to hold the following data about an image:
  //1. location where photo was taken
  //2. description of photo
  //3. the date when the photo was taken
  //4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
}
let responseText = "";

function fetchJSON() {
  mRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      responseText = JSON.parse(this.responseText);
      iterateJSON();
    }
  }
  mRequest.open("GET", mUrl, true);

  mRequest.send();

}
function iterateJSON() {
  if (responseText == "") {
    fetchJSON();
  }
  for (let i = 0; i < responseText.images.length - 1; i++) {
    mImages[i] = new GalleryImage(responseText.images[i].imgLocation, responseText.images[i].description, responseText.images[i].date, responseText.images[i].imgPath);
  }
  swapPhoto();
}

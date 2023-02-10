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
//Swaps the information and photo using the mCurrentIndex
let t = false;
let f = false;
function swapPhoto() {
  mCurrentIndex++;
  if (mCurrentIndex > mImages.length - 1) {
    mCurrentIndex = 0;
  }
  if (!f) {
    $("#photo").attr('src', mImages[mCurrentIndex].photo);
    $(".location").text($(".location").text().replace($(".location").text(),  mImages[mCurrentIndex].location));
    $(".description").text($(".description").text().replace($(".description").text(), mImages[mCurrentIndex].description));
    $(".date").text($(".date").text().replace($(".date").text(), mImages[mCurrentIndex].date));
    f = true;
  } else {
    $(".photoHolder").fadeOut('slow', function() {
      $("#photo").attr('src', mImages[mCurrentIndex].photo);
      $(".photoHolder").fadeIn('slow');
    });
    if (!t) {
      $(".stuff").fadeOut('slow', function() {
        $(".location").text($(".location").text().replace($(".location").text(), mImages[mCurrentIndex].location));
        $(".description").text($(".description").text().replace($(".description").text(), mImages[mCurrentIndex].description));
        $(".date").text($(".date").text().replace($(".date").text(), mImages[mCurrentIndex].date));
        $(".stuff").fadeIn('slow');
      })
    } else {
      $(".location").text($(".location").text().replace($(".location").text(), mImages[mCurrentIndex].location));
      $(".description").text($(".description").text().replace($(".description").text(), mImages[mCurrentIndex].description));
      $(".date").text($(".date").text().replace($(".date").text(), mImages[mCurrentIndex].date));
    }
  }

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
  //Starts the fetchJSON function when the website loads
  //fetchJSON();

  let a = "extra.json";
  
  $.get(a, function(data) {
    mImages = [];
    responseText = data;
    iterateJSON();
    $(".banner").text($(".banner").text().replace($(".banner").text(), "Chess Pictures"));
    swapPhoto();
  }).fail(function() {
    fetchJSON();
  });
  
  //When the user click on the info arrow, the arrow will rotate to the apporiate spot
  $(".moreIndicator").click(function() {
    if ($(".moreIndicator").hasClass("rot90")) {
      $(".moreIndicator").toggleClass("rot90");
      $(".moreIndicator").toggleClass("rot270");
      t = true;
      $(".details").slideToggle("slow", function() { });
    } else {
      $(".moreIndicator").toggleClass("rot90");
      $(".moreIndicator").toggleClass("rot270");
      t = false;
      $(".details").slideToggle("slow", function() { });
    }
  });
  //Positions the #nextPhoto arrow
  $("#nextPhoto").position({
    my: "right bottom",
    at: "right bottom",
    of: "#nav"
  });
  //When user clicks the back button, the gallery will go to the last image
  $("#prevPhoto").click(function() {
    if (mCurrentIndex == 0) {
      mCurrentIndex = mImages.length - 2;
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
//Gallery Image object
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
//Fetches the JSON from the JSON file
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
//Goes through the JSON and puts in mImages
function iterateJSON() {
  for (let i = 0; i < responseText.images.length; i++) {
    mImages[i] = new GalleryImage(responseText.images[i].imgLocation, responseText.images[i].description, responseText.images[i].date, responseText.images[i].imgPath);
  }
  swapPhoto();
}

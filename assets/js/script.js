$(document).ready(function(){

  window.scrollTo(0,0);

  scrollToAnchor();

  ajaxMenu();

  scrollContent();

});

function ajaxMenu(){
  var navLink = $('.js-headerBlock-nav-list-item-link'),
    body = $('body');

  navLink.click(function(event){

    if($(this).hasClass('disabled_js')) {
      return false;
    } else {
      var targetPage = $(this).attr('href'),
        windowW = $(window).width(),
        contentBlock = $('.js-contentBlock-wrap');

      console.log($('.headerBlock-nav-list-item_current_js').index($('.headerBlock-nav-list-item')));

      navLink.addClass('disabled_js');
      $(this).parent().addClass('headerBlock-nav-list-item_current_js').siblings().removeClass('headerBlock-nav-list-item_current_js');
      body.addClass('lock_js').css('width', windowW*2);
      contentBlock.addClass('animate-out_js').css('width', windowW).after('<div class="js-contentBlock-wrap contentBlock-wrap animate-in_js" style="width: '+windowW+'px;  ">');

      jQuery.ajax({
        url: targetPage,
        type: "POST",
        dataType: "text",
        success:function(result){
          // console.log(result);
          $("body").unbind("mousewheel");
          $('.animate-in_js').html(result);
          $('.animate-out_js').animate({ marginLeft: -windowW+'px'}, {queue:false, duration: 1000, 
            complete: function (){
              $('.animate-in_js').removeClass('animate-in_js');
              body.removeClass('lock_js').removeAttr('style');
              $(this).remove();
              navLink.removeClass('disabled_js');
            } 
          }, 1500);

          navLink = $('.js-headerBlock-nav-list-item-link');
          scrollContent();
        }
      });
      //window.location.hash = targetPage;
      document.location.hash != targetPage ? history.pushState("", "", "#"+targetPage) : '';
      return false;
    }
  }); 

}


// Scroll rigth/left
function scrollToAnchor(){
  var anchor = $('.js-anchor'),
    htmlBody = $("html:not(:animated),body:not(:animated)");

  anchor.click(function(event){
    var targetId = $(this).attr('href'),
      scrollPos = $(targetId).offset().top;
    event.preventDefault();
    scrollTo(scrollPos, targetId);
  }); 

  function scrollTo(scrollPos, targetId) {
    htmlBody.animate({ scrollTop: scrollPos}, {queue:false, duration: 750, complete: function (){
      window.location.hash = targetId;
    } }, 2000);
  }
}


// Scroll up\down
function scrollContent(){
  var contentBlockScroll = $('#scroll-sub');

	if (contentBlockScroll.length >0) {
	  //console.log(contentBlockScroll);

	 $("body").bind("mousewheel", function (event, delta) {
	   var currentMargin = parseInt(contentBlockScroll.css("margin-top").replace("px", "")),
      scrollHeight = $('#js-scroll').height();
      margin = scrollHeight*delta;
      
      //if(currentMargin<=0 || currentMargin <= $('#scroll-sub').height()){
  	   console.log(currentMargin, scrollHeight, delta);
  	   contentBlockScroll.css("margin-top", currentMargin + margin + "px");
      //}
	 });
		
	} else {
		return false;
	}

  // $("body").mousewheel(function(event, delta, deltaX, deltaY) {
  //   //contentBlockScroll.scrollTop -= (delta * 30);
  //   console.log(contentBlockScroll);
  //   // var scroll = parseInt( contentBlockScroll.scrollTop() );
  //   // contentBlockScroll.scrollTop( scroll - ( delta * 100 ) );
  //   // console.log(delta);
  //   // event.preventDefault();
  // });

// $("body").bind("mousewheel", function (event, delta, deltaX, deltaY) {
// 	 // console.log("delta:"+delta, "deltaX:"+deltaX, "deltaY:"+deltaY);
// 	 	// contentBlockScroll.css("margin-top", deltaY);
// 	 	// console.log(parseInt( contentBlockScroll.css("margin-top").replace("px", "") ));
// 	 	console.log( contentBlockScroll.css("margin-top") );
// 	 // var scroll = parseInt( contentBlockScroll.scrollTop() );
//   // contentBlockScroll.scrollTop( scroll - ( delta * 100 ) );
//   // contentBlockScroll.scrollTop(deltaY);
//   //   console.log(delta);
//   // event.preventDefault();
//  });

}

// load google map
function initializeMap() {
  var map,
    coords = new google.maps.LatLng(56.840305, 60.625692);

  //custom gmap style to change open in chrome http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
  var styles = [
    {
    "stylers": [
        { "saturation": -100 },
        { "lightness": 50 }
      ]
    }
  ];

  // touch screen device - disable draggable map
  // ("ontouchstart" in document.documentElement) ? var draggableMap =  false : var draggableMap =  true ;

  var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

  //Map initialization
  var mapOptions = {
    zoom: 16,
    minZoom: 3,
    center: coords,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    panControl: false,
    streetViewControl: false,
    // draggable: draggableMap,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };

  //Associate the styled map with the MapTypeId and set it to display.
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  // Custom Marker 144mln
  var customMarker = new google.maps.Marker({
    position: coords,
    map: map,
    title:"GoodPrint",
    icon: new google.maps.MarkerImage('assets/images/pin.png')
  });
}

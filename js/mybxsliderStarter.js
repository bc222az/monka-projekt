"use strict";
var app = app || {};

app.slider;
var bxsliderOn = false;

/*app.getImages = function(){
	var matches = /album=([^&#=]*)/.exec(window.location.search);
	var param1 = matches[1];
	//"http://bennycarlsson.com/monka/pages/getImages.php"
	var dir = "getImages.php";
	$.ajax({
	    url: dir,
	    type: "POST",
	    data:{"folderName":param1},
	    success: function (data) {
	       var arr = JSON.parse(data);
	       for(var i in arr){
				var li = document.createElement("li");
				var img = document.createElement("img");
				img.setAttribute("src",arr[i]);
				li.appendChild(img);
				$(li).appendTo(".bxslider");
	        }
			app.bxSliderStarter();
	    }
	});
};*/

app.boxSliderStarter = function($container, prevElement){
    bxsliderOn = true;
    $("body").addClass("stop-scrolling");
	app.slider = $('.bxslider').bxSlider({
		mode: "vertical",
		slideMargin: 1,
		infiniteLoop: false,
		nextSelector: '#slider-next',
		prevSelector: '#slider-prev',
		pagerCustom: '#box-pager',
        onSliderLoad: function(currentIndex){
            //app.boxSliderOnSliderLoad(currentIndex+1, $container, prevElement);
            //app.boxSliderOnSliderLoad(3, $container, prevElement);
        },
        onSlideBefore: function($slideElement, oldIndex, newIndex){
            console.log("onSlideBefore");
            app.boxSliderBefore($slideElement, oldIndex, newIndex, app.slider, $container, prevElement);
        }
	});

    console.log(app.slider.children().length);
    app.boxSliderOnSliderLoad(app.slider.children().length, $container, prevElement);

    $(document).keydown(function(e){
		if (e.keyCode == 40){ // down arrow
            console.log(app.slider);
			app.slider.goToNextSlide();
			return false;
		}
		else if (e.keyCode == 38){ // up arrow
			app.slider.goToPrevSlide();
			return false;
	   }
	});
};

app.boxSliderOnSliderLoad = function(index, $container, prevElement){
    console.log("boxSliderOnSliderLoad");
	document.querySelector(".backToKKarta").addEventListener("click", function() {
		app.destroyBoxSlider(prevElement, $container, app.slider);
	}, false);
	app.createCustomPager(index, $("#box-pager"));
};

app.boxSliderBefore = function($slideElement, oldIndex, newIndex, slider, $container, prevElement){
    console.log("boxSliderBefore");
	var slideQty = slider.getSlideCount();
	var current = slider.getCurrentSlide();
	var temp;
	var tempSide;
	if(current === (slideQty-=1)){
		$("body").keydown(function(e) {
			if(e.keyCode == 40) { // down
				app.destroyBoxSlider(prevElement, $container, slider);
			}
			//$("#slider-next").on("click", backToKKarta);
		});
	}else{
		$("body").unbind('keydown');
		$("body").off("keydown", function(){
			app.destroyBoxSlider(prevElement, $container, slider);
		});
		$("#slider-next").off("click", function(){
			app.destroyBoxSlider(prevElement, $container, slider);
		});
	}
};

app.removeBoxSlider = function(prevElement, $container){
    $("body").removeClass("stop-scrolling");
    bxsliderOn = false;
	$("#boxSlid").remove();
	$container.packery('reloadItems');
	$container.packery();
	app.displayMovingMenu = true;
	app.scrollToElement(prevElement);
	app.enableScroll();
	app.displayMenu();
};

app.destroyBoxSlider = function(prevElement, $container, slider){
	slider.destroySlider();
	app.displayMovingMenu = true;
	app.removeBoxSlider(prevElement, $container);
	$("body").unbind('keydown');
	$("body").off("keydown", function(){
		app.destroyBoxSlider(prevElement, $container, slider);
	});

	// TODO: #slider-next and prev on click!
	// set keyboard listener
};

app.createCustomPager = function(slides, custumHolder){
	var pagerElementA;
	var pagerElementLi;
	var pagerElementUl = document.createElement("ul");
	pagerElementUl.setAttribute("class", "pagerList");
	pagerElementUl.style.display = "none";

	for (var i = 0; i < slides; i++) {
		pagerElementLi = document.createElement("li");
		pagerElementA = document.createElement("a");

		pagerElementLi.setAttribute("class", "bx-pager-item");
		pagerElementA.setAttribute("data-slide-index", i);
		pagerElementA.setAttribute("class", "bx-pager-link");
		pagerElementA.innerHTML = "&#9679;";

		pagerElementA.addEventListener("click", function(e){
			e.preventDefault();
		});

		pagerElementLi.appendChild(pagerElementA);
		pagerElementUl.appendChild(pagerElementLi);
	}
	custumHolder.prepend(pagerElementUl);
};

app.showCustomPager = function(){
	var pagerElement = document.querySelector(".pagerList");
	var backToKKarta = document.querySelector(".backToKKarta");
	backToKKarta.style.display = "initial";
	pagerElement.style.display = "initial";
};

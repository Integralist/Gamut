$(document).ready(function(){
  $("#content-slider").slider({
    animate: true,
    handle: ".content-slider-handle",
    change: handleSliderChange,
    slide: handleSliderSlide
  });
});

function handleSliderChange(e, ui)
{
  var maxScroll = $("#content-scroll").attr("scrollWidth") - $("#content-scroll").width();
  $("#content-scroll").animate({scrollLeft: ui.value * (maxScroll / 100) }, 1000);
}

function handleSliderSlide(e, ui)
{
  var maxScroll = $("#content-scroll").attr("scrollWidth") - $("#content-scroll").width();
  $("#content-scroll").attr({scrollLeft: ui.value * (maxScroll / 100) });
}
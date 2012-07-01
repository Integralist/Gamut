$(document).ready(function(){
  $('#pic_container').click(function(){
    var numberOfPics = $(this).find('div > img').length;
    var next = Math.floor(Math.random() * numberOfPics);
    $(this).scrollTo('img:eq(' + next + ')', {duration: 1000});
  });
});

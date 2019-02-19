import $ from 'jquery';

const common = () => {
  //anchors
  $('.anchor').on('click', function(e){
    e.preventDefault();
    var elem = $(this).attr('href'),
        positionScroll = $(elem).offset().top;
    $('body,html').animate({scrollTop:positionScroll}, 1000);
  });
};

export default common();
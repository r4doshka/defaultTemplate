import $ from 'jquery';

const common = () => {

  //anchors
  $('.anchor').on('click', function(e){
    e.preventDefault();
    var elem = $(this).attr('href'),
        positionscroll = $(elem).offset().top;
    $('body,html').animate({scrollTop:positionscroll}, 1000);
  });
};

export default common();
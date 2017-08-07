//
// ANIMATIONS ACTIVATORS.
//

$('.top-bar input').on('blur', function(){
   $(this).parent('.search-bar').removeClass('search-bar-active');
   $('.content-container').toggleClass('overlay-d');
}).on('focus', function(){
   $(this).parent('.search-bar').addClass('search-bar-active');
   $('.content-container').toggleClass('overlay-d');
});

$('.inner-search-container input').on('blur', function(){
   $(this).parent('.search-bar').removeClass('search-bar-active');
}).on('focus', function(){
   $(this).parent('.search-bar').addClass('search-bar-active');
});

$('.post-button').click(function() {
	$('.modal-container').toggleClass('active');
});

$('.mini-search-dd .activator').click(function() {
	$('.mini-search-dd').toggleClass('active');
});

$('.normal-drop-down').click(function() {
	$(this).toggleClass('active');
});

$('.comments-button').click(function() {
	$('.box-container ').toggleClass('active');
});

$('.minifier').click(function() {
   $('body').toggleClass('minified');
});
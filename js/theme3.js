function colors(color){

var colorid='';
if (color != 'blue' && color != '' && color != '0'){
colorid='<a style="color: #3575d3;" class="dropdown-item" href="#blue" onclick="return changecolor(0);"><i class="fas fa-paint-brush"></i>Blue Color</a>';
var colortheme='';
}
if (color != '1'){
colorid='<a style="color: #22a76d;" class="dropdown-item" href="#1" onclick="return changecolor(1);"><i class="fas fa-paint-brush"></i>Green Color</a>'+colorid;
var colortheme='1';
}
if (color != '2'){
colorid='<a style="color: #f7527c;" class="dropdown-item" href="#2" onclick="return changecolor(2);"><i class="fas fa-paint-brush"></i>Pink Color</a>'+colorid;
var colortheme='2';
}
if (color != '3'){
colorid='<a style="color: #9B5DE5;" class="dropdown-item" href="#3" onclick="return changecolor(3);"><i class="fas fa-paint-brush"></i>Purple Color</a>'+colorid;
var colortheme='3';
}
if (colorid != ''){
$("#colors").html(colorid);
}
}
function setStyleSheet(url){
var stylesheet = document.getElementById("stylesheet");
stylesheet.setAttribute('href', url);
}





$(document).ready(function() {
$('select').niceSelect();
$("#showallarch").click(function() {
$(this).css('display', 'none'),
$("#fileinfoarch").css('height', '100%'),
$("#grad").css('display', 'none');
});

$('#switchColor, #switchColorMobile').on('click', function(e) {
e.preventDefault();
var coloriddiv= $("#coloriddiv").html();
if ($('body').hasClass('white')) {
$.ajax({
type: 'GET',
url: '/theme-dark',
success: function() {
$('body').attr('class', 'dark');
},
});

setStyleSheet('https://dropgalaxy.com/assets/styles/dark'+coloriddiv+'.min.css');
} else {
$.ajax({
type: 'GET',
url: '/theme-white',
success: function() {
$('body').attr('class', 'white');
},
});
setStyleSheet('https://dropgalaxy.com/assets/styles/white'+coloriddiv+'.min.css');
}
});
});


(function($) {
$(function() {
$('ul.tabs').on('click', 'li:not(.current)', function() {
var section = $(this).parents('div.section:first');
var idx = $(this).index();
$(this).addClass('current').siblings().removeClass('current');
$(section).find('> div.box').eq(idx).fadeIn(150).siblings('div.box').hide();
$.cookie($(section).attr('id') + 'tab', idx);
});
$('.section').each(function(i, e) {
if(!e.id) return;
var idx;
if(idx = $.cookie(e.id + 'tab'))
{
$(e).find('> ul > li').eq(idx).click();
}
});
})
})(jQuery)




function changecolor(color_id){
          var colortheme= color_id;
          var colorlogo=colortheme;
if (colortheme == 'blue' || colortheme == '' || colortheme == '0'){
colortheme='0';
var colorlogo='';
}
if ($('body').hasClass('white')) {
$.ajax({
type: 'GET',
url: '/color-'+colortheme,
success: function() {
$('body').attr('class', 'white');
},
});

$("#logoo").attr("src", "/assets/img/logoo"+colorlogo+".png");
$("#favicon").attr("href","https://dropgalaxy.com/assets/img/favicon"+colorlogo+".png");
colors(color_id);
$('#coloriddiv').html(colorlogo);
setStyleSheet('https://dropgalaxy.com/assets/styles/white'+colorlogo+'.min.css');
} else {
$.ajax({
type: 'GET',
url: '/color-'+colortheme,
success: function() {
$('body').attr('class', 'dark');
},
});
$("#logoo").attr("src", "/assets/img/logoo"+colorlogo+".png");
$("#favicon").attr("href","https://dropgalaxy.com/assets/img/favicon"+colorlogo+".png");
colors(color_id);
$('#coloriddiv').html(colorlogo);
setStyleSheet('https://dropgalaxy.com/assets/styles/dark'+colorlogo+'.min.css');
}

}
$(document).ready(function() {
$("#colors a").click(function(e) {
e.preventDefault();
           var color_id = $(this).attr('href').split('#');
});


});
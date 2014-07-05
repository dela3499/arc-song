// TODO: refactor states using UI-router

var app = angular.module('arcsong',[]);

app.controller('MainController', function(){
    this.state = 0;
    this.update = function (x) {
        this.state += x
    };
});
app.controller('TransitionFinderController', function() {
    this.transitions = [];    
    this.addTransition = function(t) {
        console.log("added transition");
        this.transitions.push(t)};
});

app.controller('SongController', function() {
    this.duration = 15;
    this.state = 'off'; // playing, paused, off
    var sound = new Howl({urls: ['audio/animate2.mp3']});
    this.t = function() {return sound.pos()};
    this.progress = function() {return this.t()/this.duration};
    this.play = function() {
        sound.play();
        this.state = 'playing';
    }
    this.pause = function() {
        sound.pause();
        this.state = 'paused';
    }
    this.stop = function() {
        sound.stop();
        this.state = 'off';
    }
    this.back = function() {
        var pos = sound.pos();
        sound.pos(pos - Math.min(pos,5));
    };
});
   
//// Define functions
//function animateProgress(e) {
//    e.css("width",getProgress(sound,duration) + "%");
//    e.animate({
//        width:"100%"
//    },{
//        duration: 1000*(duration - sound.pos()),
//        easing: "linear",
//        step: updateTimers})};            


//function addZero(num) {
//    return (num >= 0 && num < 10) ? "0" + num : num + "";
//};        
//function updateTimers() { 
//    pos = (sound.pos()).toFixed(0);
//    minE = Math.floor(pos/60);
//    secE = addZero(Math.floor(pos % 60));
//    minR = Math.floor(duration / 60) - minE;
//    secR = addZero(Math.floor((duration - pos) % 60));
//    $('#elapsed-time-id').text(minE + ':' + secE);
//    $('#remaining-time-id').text("-" + minR + ':' + secR);
//   }; 
//
////---------------
//// Grouping page
////---------------
//
//var sound2 = new Howl({
//        urls: ['audio/animate2.mp3'], // hack: hardcoded song
//        loop: true
//    });
//
//sound2.sprite({'clip': [7000,1000]});
//
//var newSections  = []
//
//transitions = [1,2,3,4,5,5.5,6,9];
//var newTransitions = [0.0].concat(transitions.concat([duration]));
//
//$('.original .song .sections').children().remove();
//for (var i = 0; i < newTransitions.length -1; i++) {
//    newSections.push([i,newTransitions[i],newTransitions[i+1]]);
//}
//for (var i = 0; i < newSections.length; i++) {
//    $('.original .song .sections').append('<section><div></div></section>');
//    var start = newSections[i][1],
//        end   = newSections[i][2];
//    var dur   = end - start;
//    $(".original .song .sections section:last").css("width", dur*100 / duration + "%");
//    $(".original .song .sections section:last div").attr({
//        'data-section': i,
//        'data-group': 0
//    });
//    $(".original .song .sections section:last div").data({
//        'data-section': i,
//        'data-group': 0
//    });            
//    var currentSprites = sound2.sprite();
//    currentSprites[i] = [start * 1000, 1000 * dur];
//    sound2.sprite(currentSprites);
//}
//
//$("#group-sections groups section div").addClass('inactive');
//$("#group-sections .group").hover(
//    function(){
//        $(this).find(".controls").css('opacity',0);
//        $(this).find(".controls").css("visibility","visible");
//        $(this).find(".controls").animate({"opacity":1},500);
//    }, function(){ $(this).find(".controls").css("visibility","hidden")});
//
//$("#group-sections section div").hover(
//  function(){
//    $(this).append('<div class="progress"></div>');
//      var index = $(this).attr("data-section")
//      sound2.play(index);
//
//}, function(){
//    sound2.stop();
//    $(this).find(".progress").remove();
//});
//function progressBar3() {
//    $("#group-sections .progress").animate({
//        width:"100%"
//    },{
//        duration: 1000*(duration - sound2.pos()),
//        easing: "linear"})};      
//$(".editor section div").attr({
//    draggable: "true"
////            ondragstart: "sectionDrag(this.data)"
//});
//
////        var mySection = $(".editor section div");
////        mySection.ondragstart = function(e) {
//////            e.dataTransfer.setData('Text','bob');
////            console.log(e.dataTransfer);
////            console.log("bob");
//////            return false;
////        }
//
//$(".editor section div").on('dragstart', function(e) {
////            $(this).animate({opacity:0},100);
////            $(this).addClass('draggedFrom');
//    var group = $(this).attr('data-group');
//    var section = $(this).attr('data-section');
//    console.log(e);
//    event.dataTransfer().setData('Text','bob');
//    console.log(event.dataTransfer.getData());
//});
//
//// need to add events in js, rather than html.
//function sectionDrag(ev) {
//    console.log(ev);
////            var evGroup = ev.target.attr('data-group');
//    console.log(ev.target.data);
////            var evSection = ev.target.attr('data-section');
//    console.log($(document).find('[data-group=' + evGroup + '],[data-section=' + evSection + ']'));
//};
////        function sectionDrag() {
////            $(this).addClass('inactive');
////            //            console.log($(this));
////        };
//

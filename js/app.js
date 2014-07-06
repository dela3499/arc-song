// TODO: refactor states using UI-router

var app = angular.module('arcsong',[]);

app.directive('landingPage',function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'landing-page.html'
    };
});
app.directive('transitionFinder',function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'transition-finder.html'
    };
});
app.directive('groupSections',function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'group-sections.html'
    };
});
app.controller('MainController', function(){
    this.state = 1;
    this.update = function (x) {
        this.state += x
    };
});
app.controller('TransitionFinderController', function($song,$interval) {
    var p = $('.progress-bar');
    this.tElapsed = 0;
    this.tRemaining = 0;
    this.transitions = [];    
    this.state = $song.state;
    this.addTransition = function() {
        this.transitions.push(this.progress());
    };
    this.progress = function(){return $song.progress()};
    this.play = function() {
        var tRemaining = this.tRemaining;
        $song.play();
        this.state = $song.state;
        p.animate({
            width:"100%"
        },{
            duration: tRemaining * 1000,
            easing: "linear",
        });
    };
    this.pause = function() {
        $song.pause();
        p.stop();
        this.state = $song.state;
    }
    this.stop = function() {
        $song.stop();
        p.css({width:'0%'});
        p.stop();
    };
    this.back = function(x) {
        $song.back(x);  
        p.stop();
        p.css({width:$song.progress()*100+'%'});
        var tRemaining = this.tRemaining;
        p.animate({
            width:"100%"
        },{
            duration: tRemaining * 1000,
            easing: "linear",
        });
        
    };
    var obj = this;
    $interval(function(){
        obj.tElapsed = $song.t();
        obj.tRemaining = $song.duration - $song.t();
    }, 100);
});
app.service('$song',function(){
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
    this.back = function(x) {
        var pos = sound.pos();
        sound.pos(pos - Math.min(pos,x));
    };
});
app.filter('formatTimer', function() {
  return function(input) {
        function z(n) {return (n<10? '0' : '') + n;}
        var seconds = Math.floor(input % 60);
        var minutes = Math.floor(input / 60);
        return (minutes+':'+z(seconds));
    };
});

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

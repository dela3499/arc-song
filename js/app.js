// TODO: consider sharing state and data with $scope object, rather than using services.
// TODO: convert app directory structure to feature-based design, and use grunt to manage assets like stylesheets and javascript.
// TODO: find alternative to constant, ad-hoc mirroring of service-level properties in controllers.
// TODO: design arc chart music player
// TODO: consider placing JS view logic in separate controllers, or something organized. (perhaps create some naming convention)
// TODO: identify common components among views, and separate into partials (just copy and paste, to start, and then, once things are working - try to refactor into partials.)
// Consider garlic.js and parsley.js for persisting and checking data on the browser
// Get File Upload working: http://www.html5rocks.com/en/tutorials/file/dndfiles/
// TODO: get player to allow cursor to alter feedback
// TODO: change color of transition markers depending on whether they are against the white background or the blue background of the progress bar
// TODO: on each state change - only the directions should come into view (centered). Everything else should be faded in slowly. 

var app = angular.module('arcsong', []);
app.controller('MainController', function () {
    this.state = 2;
    this.update = function (x) {
        this.state += x;
    };    
});
app.controller('LandingPageController', function () {
    $(document).ready(function () {
        $('#landing-page').css({opacity:0});
        $('#landing-page').animate({opacity:1},2000);
    });  
});
app.controller('TransitionFinderController', function ($song, $interval,$structure) {
    var vm = this,
        p = $('.progress-bar');
    vm.transitions = $structure.getTransitions();
    vm.tElapsed = 0;
    vm.tRemaining = 0;
    vm.state = $song.state;
    vm.addTransition = function () {
        $structure.addTransition($song.progress());
        vm.transitions = $structure.getTransitions();
    };
    vm.progress = function () {return $song.progress(); };
    vm.play = function () {
        $song.play();
        vm.state = $song.state;
        animateProgressBar();
    };
    vm.pause = function () {
        $song.pause();
        p.stop();
        vm.state = $song.state;
    };
    vm.back = function (x) {
//        var lastTransition = $structure.transitions[$structure.transitions.length - 1];
//        console.log(lastTransition);
        $song.back(x);
        p.stop();
        animateProgressBar();
    };
    var animateProgressBar = function () {
        p.css({width: $song.progress() * 100 + '%'});
        p.animate({
            width: "100%"
        }, {
            duration: ($song.duration - $song.t()) * 1000,
            easing: "linear",
            complete: function () {
                p.animate({width:'0%'},1000);
            }
        });        
    };
    
// TODO: use this function to make sure progress bar is on track with song     
//    var pbc = function() {
//        var dw = pbg.css('width').replace(/[^-\d\.]/g, ''),
//            pbw = p.css('width').replace(/[^-\d\.]/g, ''),
//            sp = $song.progress(),
//            e = ((pbw / dw) - sp)*100;
//        return e;
//    };
    
    $interval(function () {
        vm.tElapsed = $song.t();
        vm.tRemaining = $song.duration - $song.t();
        vm.state = $song.state;
    }, 500);
});
app.controller('GroupSectionsController', function ($structure,$interval,$song) {
    var vm = this;
    vm.groups = [0,1,2,3,4,5,6];
    vm.sections = $structure.getSections();
    vm.play = function (s) {
        console.log('mouseenter on section');
        $song.play(s.start,s.end);
    };
    vm.stop = function () {
        $song.stop();
    };
    $interval(function () {vm.sections = $structure.getSections();},50); // hack (just updating this value constantly, rather than when it changes)
});
app.directive('draggable', function() {
    return function(scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.dataset.section);
                this.classList.add('drag');
            console.log(["DragStart","Section: " + e.dataTransfer.getData("Text")]);
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }
});
app.directive('droppable', function($structure) {
    return {
        scope: {},
        link: function(scope, element) {
            // again we need the native object
            var el = element[0];
            el.addEventListener(
                'dragover',
                function(e) {
                    e.dataTransfer.dropEffect = 'move';
                    // allows us to drop
                    if (e.preventDefault) e.preventDefault();
                    this.classList.add('over');
                    return false;
                },
                false
            );   
            el.addEventListener(
                'dragenter',
                function(e) {
                    this.classList.add('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragleave',
                function(e) {
                    this.classList.remove('over');
                    return false;
                },
                false
            );
            el.addEventListener(
                'drop',
                function(e) {
                    // Stops some browsers from redirecting.
                    if (e.stopPropagation) e.stopPropagation();

                    this.classList.remove('over');

//                    var item = document.getElementById(e.dataTransfer.getData('Text'));
//                    this.appendChild(item);
                    var section = e.dataTransfer.getData('Text'),
                        group = this.dataset.group;
                    $structure.changeGroup(section,group);
                    return false;
                },
                false
            );            
        }
    }
});
app.service('$song', function () {
    var vm = this;
    vm.duration = 15;
    vm.state = 'off'; // playing, paused, off
    var sound = new Howl({
        urls: ['audio/animate2.mp3'],
        onend: function () {
            vm.state = 'off';
        }
    });
    vm.t = function () {return sound.pos(); };
    vm.progress = function () {return vm.t() / vm.duration; };
    vm.play = function (start,end) {
        var start = start || 0,
            end   = end   || 1;
        sound.sprite({'song':[start*vm.duration*1000,(end-start)*vm.duration*1000]});
        sound.loop((end - start) != 1); //loop for excerpts only
        sound.play('song');
        vm.state = 'playing';
    };
    vm.pause = function () {
        sound.pause();
        vm.state = 'paused';
    };
    vm.stop = function () {
        sound.stop();
        vm.state = 'off';
    };
    vm.back = function (x) {
        var pos = sound.pos();
        sound.pos(pos - Math.min(pos, x));
    };
});
app.service('$structure', function () {
    var vm = this,
        transitions = [.1,.2,.25,.7,.76,.78,.82,.9,.98];
    initSections = function () {
        var sections = [],
            markers = [0.0].concat(transitions.concat([1]));
        
        getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        for (var i = 0; i < markers.length - 1; i++) {
            sections.push({
                id: i,
                start: markers[i],
                end: markers[i+1],
                duration: markers[i+1] -  markers[i],
                group: getRandomInt(0,3)
            });
        };
        return sections;
    };
    vm.sections = initSections();
    vm.getTransitions = function () {
        return transitions;
    };
    vm.addTransition = function (p) {
        transitions.push(p);
    };
    vm.removeTransition = function (i) {
        transitions.splice(i,1);
    };
    vm.getSections = function () {
        return vm.sections;
    };
    vm.changeGroup = function (section,group) {
        vm.sections[section].group = group;
    };
    vm.getSymbolList = function () {
        var sList = [];
        for (var i = 0; i < vm.phrases.length; i++) {
            sList.push(phrases[i].phraseID);
        };
    };  
    
});
app.filter('formatTimer', function () {
    return function (input) {
        function z(n) {return (n < 10 ? '0' : '') + n; }
        var seconds = Math.floor(input % 60),
            minutes = Math.floor(input / 60);
        return (minutes + ':' + z(seconds));
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
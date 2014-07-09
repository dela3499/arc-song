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
// Get music to fade in slowly on hover
var app = angular.module('arcsong', []);
app.controller('MainController', function ($structure) {
    this.state = 2;
    this.update = function (x) {
        this.state += x;
        $structure.update();
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
        $song.play(s.start,s.end);
    };
    vm.stop = function () {
        $song.stop();
    };
    $interval(function () {vm.sections = $structure.getSections();},50); // hack (just updating this value constantly, rather than when it changes)
});
app.directive('draggable', function($song) {
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
                $song.stop();
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
        sound.play('song'); //howler doesn't fade effectively
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
        transitions = [.1,.5,.7,.8,.9];//hacked mock values    
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
                group: 0
            });
        };
        return sections;
    };
    vm.sections = initSections(); // view mocked values immediately
    vm.update = function () {
        vm.sections = initSections();
    };
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
app.service('$animation', function () {
    var vm = this;
//    vm.animate = function (el)
});
app.filter('formatTimer', function () {
    return function (input) {
        function z(n) {return (n < 10 ? '0' : '') + n; }
        var seconds = Math.floor(input % 60),
            minutes = Math.floor(input / 60);
        return (minutes + ':' + z(seconds));
    };
});











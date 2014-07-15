/** @jsx React.DOM */
var FluxMixin = Fluxxor.FluxMixin(React),
    FluxChildMixin = Fluxxor.FluxChildMixin(React)
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AudioStore = Fluxxor.createStore({
    initialize: function () {
        var store = this;
        this.playing = false;    
        this.sound = new Howl({
            urls: ['audio/animate2.mp3'],
            onend: function () {
                store.playing = false;
                setTimeout(function () {
                    store.stopUpdateCycle();
                }, 10); //small delay hack. This allows timers and progress bar to sync to song time (zero) when the music ends.
                store.emit("change");
            }
        });
        this.pos = 0;
        this.duration = 15;
        this.bindActions(
            "TOGGLE_PLAYBACK", this.togglePlayback
        );
    },
    togglePlayback: function () {
        !this.playing ? this.play() : this.pause();
    },
    play: function (start,end) {
        var start = start || 0,
            end   = end   || 1;
        this.sound.sprite({'song':[start*this.duration*1000,(end-start)*this.duration*1000]});
        this.sound.loop((end - start) != 1); //loop for excerpts only
        this.sound.play('song');
        this.playing = true;
        this.startUpdateCycle();
        this.emit("change");
    },
    pause: function () {
        this.sound.pause();
        this.playing = false;
        this.stopUpdateCycle();
        this.emit("change");
    },
    startUpdateCycle: function () {
        var store = this;
        this.intervalID = setInterval(function () {
            store.update();
            store.emit("change");
        }, 10);
    },
    stopUpdateCycle: function () {
        var store = this;
        clearInterval(store.intervalID);
    },
    update: function () {
        this.pos = this.sound.pos() / this.duration;
        console.log("updating");
    }
});
var stores = {
    AudioStore: new AudioStore()
};
var actions = {
    audio: {
        togglePlayback: function () {
            this.dispatch("TOGGLE_PLAYBACK", {});
        }
    }
};
var ArcSongApp = React.createClass ({
    mixins: [FluxMixin, StoreWatchMixin("AudioStore")],
    getStateFromFlux: function () {
        var flux = this.getFlux();
        return {
            audio: {
                playing: flux.store("AudioStore").playing,
                pos: flux.store("AudioStore").pos,
                duration: flux.store("AudioStore").duration
            }   
        }
    },
    render: function () {
        var x = this.state;
        return (
            <SectionTransitionPage audio={this.state.audio}/>
        );
    }
});
var SectionTransitionPage = React.createClass({
        render: function () {
            return (
                <div id="transition-finder">
                    <Nav/>          
                    <div className="main-container">
                        <div className="directions">First, separate the song into sections<br/>by finding the big transitions.</div> 
                        <Progress pos={this.props.audio.pos} duration={this.props.audio.duration}/>
                        <Controls playing={this.props.audio.playing}/>
                    </div>
                </div>
            );
        }
    });
var Nav = React.createClass ({
    render: function () {
        return (
            <div className="nav">
                <img className="back-button" src="img/back.svg" alt="back button"/>
                <img className="help-button" src="img/help.svg" alt="help button"/>
                <img className="continue-button" src="img/continue.svg" alt="continue button"/>
            </div>                       
        );
    }
});
var Progress = React.createClass ({
    render: function () {
        var t = this.props.pos * this.props.duration;
        return (
            <div className="player">
                <div className="player-background">
                    <div className='transition-marker'></div>
                    <ProgressBar percentage={this.props.pos * 100 + '%'}/>
                </div> 
                <Timer className='elapsed-time' t={t}/>
                <Timer className='remaining-time' t={t - this.props.duration}/>
            </div>
        );
    }
});
var ProgressBar = React.createClass ({
    render: function () {
        return (
            <div className="progress-bar" style={{width: this.props.percentage}}></div>
        );
    }
});
var Timer = React.createClass ({
    filter: function (t) {
        var sign = t < 0 ? "-" : "",
            tAbs = Math.abs(t);
        function z(n) {return (n < 10 ? '0' : '') + n; }
        var seconds = Math.floor(tAbs % 60),
            minutes = Math.floor(tAbs / 60);
        return (sign + minutes + ':' + z(seconds));
    },
    render: function () {
        return (
            <div className={this.props.className}>{this.filter(this.props.t)}</div>
        );
    }
});
var Controls = React.createClass ({
    mixins: [FluxChildMixin],
    render: function () {
        return (
            <div className="controls">
                <Button type={this.props.playing? "pause":"play"} onAction={this.togglePlayback}/>
                <Button type="transition"/>
                <Button type="back-5"/>
            </div>
        );
    },
    togglePlayback: function () {
        this.getFlux().actions.audio.togglePlayback();
    }
});
var Button = React.createClass ({
    render: function () {
        return (
            <img className={"button " + this.props.type} src={"img/" + this.props.type + ".svg"} onClick={this.props.onAction}/>
        );
    }
});
var X = React.createClass ({
    render: function () {
        return (
            <div/>
        );
    }
});
        
        
var flux = new Fluxxor.Flux(stores,actions);
React.renderComponent(
    <ArcSongApp flux={flux}/>,
    document.getElementById('content')
);
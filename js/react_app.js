/** @jsx React.DOM */
var FluxMixin = Fluxxor.FluxMixin(React),
    FluxChildMixin = Fluxxor.FluxChildMixin(React)
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AudioStore = Fluxxor.createStore({
    initialize: function () {
        this.playing = false;
        this.bindActions(
            "TOGGLE_PLAYBACK", this.handleTogglePlayback
        );
    },
    handleTogglePlayback: function () {
        this.playing = !this.playing;
        this.emit("change");
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
            playing: flux.store("AudioStore").playing
        }
    },
    render: function () {
        var x = this.state;
        return (
            <SectionTransitionPage playing={this.state.playing}/>
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
                        <Progress/>
                        <Controls playing={this.props.playing}/>
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
        return (
            <div className="player">
                <div className="player-background">
                    <div className='transition-marker'></div>
                    <ProgressBar/>
                </div> 
                <Timer className='elapsed-time' t="0:00"/>
                <Timer className='remaining-time' t="-0:15"/>
            </div>
        );
    }
});
var ProgressBar = React.createClass ({
    render: function () {
        return (
            <div className="progress-bar"></div>
        );
    }
});
var Timer = React.createClass ({
    render: function () {
        return (
            <div className={this.props.className}>{this.props.t}</div>
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
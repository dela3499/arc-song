/** @jsx React.DOM */

var AudioStore = Fluxxor.createStore({
    initialize: function () {
        this.playing = false;
        this.bindActions(
            "TOGGLE_PLAYBACK", this.handleTogglePlayback
        );
    },
    handleTogglePlayback: function () {
        this.playing = !this.playing;
    }
});

var stores = {
    AudioStore: new AudioStore()
};
var actions = {
    audio: {
        togglePlayback: function () {
            console.log("TOGGLE_PLAYBACK");
            this.dispatch("TOGGLE_PLAYBACK", {});
        }
    }
};
var flux = new Fluxxor.Flux(stores,actions);


var ArcSongApp = React.createClass ({
    getInitialState: function () {
        return {playback: "off"};
    },
    audioCtrl: {
        print: function () {
            console.log("audioCtrl.print");
            var p = this;
            console.log(p);
        }
    },
    setPlayback: function (x) {
        switch (x) {
            case "play":
                this.setState({playback: "playing"});
                break;
            case "pause":
                this.setState({playback: "paused"});
                break;
            case "stop":
                this.setState({playback: "off"});
                break;
            default:
                console.log("invalid argument to ArcSongApp.setPlayback");
        };
                
    },
    render: function () {
        var x = this.state;
        console.log(["rendering app",x]);
        return (
            <SectionTransitionPage playback={this.state.playback} audioCtrl={this.audioCtrl} setPlayback={this.setPlayback}/>
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
                        <Controls playback={this.props.playback} audioCtrl={this.props.audioCtrl} setPlayback={this.props.setPlayback}/>
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
    render: function () {
        var playing = this.props.playback == "playing",
            playMusic = this.props.setPlayback.bind(null, "play"),
            pauseMusic = this.props.setPlayback.bind(null, "pause");
        
        return (
            <div className="controls">
                <Button type={playing? "pause":"play"} onAction={playing? this.props.audioCtrl.print:this.props.audioCtrl.print}/>
                <Button type="transition"/>
                <Button type="back-5"/>
            </div>
        );
    }
});
var Button = React.createClass ({
    render: function () {
        console.log("just rendered " + this.props.type + " button.");
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
        
        

React.renderComponent(
    <ArcSongApp/>,
    document.getElementById('content')
);
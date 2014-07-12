/** @jsx React.DOM */

var SectionTransitionPage = React.createClass({
        render: function () {
            return (
                <div id="transition-finder">
                    <Navigation/>
                    <Directions/>
                    <Player/>
                </div>
            );
        }
    });
var Navigation = React.createClass({
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
var Directions = React.createClass({
        render: function () {
            return (
                <div className="directions">
                    First, separate the song into sections<br/>by finding the big transitions.
                </div>
            );
        }
    });
var Player = React.createClass({
        render: function () {
            return (
                <div className="player">
                    <ProgressBar/>
                </div>
            );
        }
    });
var ProgressBar = React.createClass({
        render: function () {
            return (
                <div className="player-background">
                    <div className='transition-marker'/>
                    <div className="progress-bar"/>
                </div>
            );
        }
    });
            
                    
            
            
            
React.renderComponent(
    <SectionTransitionPage />,
    document.getElementById('content')
);
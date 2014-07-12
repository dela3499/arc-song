/** @jsx React.DOM */

var SectionTransitionPage = React.createClass({
        render: function () {
            return (
                <div id="transition-finder">
                    <div className="nav">
                        <img className="back-button" src="img/back.svg" alt="back button"/>
                        <img className="help-button" src="img/help.svg" alt="help button"/>
                        <img className="continue-button" src="img/continue.svg" alt="continue button"/>
                    </div>                
                    <div className="main-container">
                        <div className="directions">First, separate the song into sections<br/>by finding the big transitions.</div> 
                        <div className="player">
                            <div className="player-background">
                                <div className='transition-marker' ng-repeat='t in tf.transitions' ng-style="{'left': t*100+'%'}"></div>
                                <div className="progress-bar"></div>
                            </div> 
                            <div className='elapsed-time'>T_e</div>
                            <div className='remaining-time'>-T_r</div>
                        </div>
                        <div className="controls">
                            <img className="play button" src="img/play.svg"/>
                            <img className="pause button" src="img/pause.svg"/>
                            <img className="transition button" src="img/found-transition.svg"/>
                            <img className="back-5 button" src="img/back5.svg"/>
                            <img className="back-x button" src="img/back-x.svg"/>
                        </div>
                    </div>
                </div>
            );
        }
    });
            
            
React.renderComponent(
    <SectionTransitionPage />,
    document.getElementById('content')
);
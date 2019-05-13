//This is the component that will be displayed when screen is loading async using Loadable (react-loadable)
//Sometimes components load really quickly (<200ms) and the loading screen only quickly flashes on the screen.
//A number of user studies have proven that this causes users to perceive things taking longer than they really have. If you don't show anything, users perceive it as being faster.
//So your loading component will also get a pastDelay prop which will only be true once the component has taken longer to load than a set delay.
//This delay defaults to 200ms but you can also customize the delay in Loadable.
//The loading component will receive a timedOut prop which will be set to true when the loader has timed out.
//However, this feature is disabled by default. To turn it on, you can pass a timeout option to Loadable.

import React from "react";
//import { Loader } from 'semantic-ui-react';

export default (props) => {
    var inner;
    if (props.error) {
        inner = <div>Error! <button onClick={ props.retry }>Retry</button></div>;
    } else if (props.timedOut) {
        inner = <div>Taking a long time… <button onClick={ props.retry }>Retry</button></div>;
    } else if (props.pastDelay) {
        inner =<div>Loading…</div>
        //inner = <Loader active content='Loading' />;
    } else {
        inner = null;
    }
    
    //vertically and horizontally center the inner div
    var ret = 
    <div style={{height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div>
            {inner}
        </div>
    </div>

    return ret;
};
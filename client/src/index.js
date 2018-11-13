import React from 'react';
import ReactDOM from 'react-dom';
import 'gestalt/dist/gestalt.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SignIn from './components/Signin';
import SignOut from './components/SignOut';
import Checkout from './components/Checkout';
import NavBar from './components/NavBar';

const Root = () => (
  <Router>
    <React.Fragment>
      <NavBar />
      <Switch>
        <Route component={App} exact path="/" />
        <Route component={SignIn} path="/signin" />
        <Route component={SignOut} path="/signout" />
        <Route component={Checkout} path="/checkout" />
      </Switch>
    </React.Fragment>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();

if (module.hot) {
  module.hot.accept();
}

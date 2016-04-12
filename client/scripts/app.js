import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'

import history from './components/history'

// Components
import Home from './components/Home';
import NotFound from './components/NotFound';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div> {this.props.children || <Home />} </div>
    );
  }
};

render((
  <Router history={history}>
    <Route path='/' component={App}>
      <Route path='v' component={Home}>
      </Route>
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
), document.getElementById('app'));

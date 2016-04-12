import React from 'react'
import { Link } from 'react-router'

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="one-half column text">
            React, Express, Gulp, Browserify and Stylus boilerplate
          </div>
        </div>
      </div>
    );
  }
};

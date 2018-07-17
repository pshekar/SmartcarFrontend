import React, { Component } from 'react';
import APIExplorer from './components/APIExplorer.js'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <APIExplorer
            title={'Add New User'}
            url={'https://jsonplaceholder.typicode.com/posts/'}
            method={'POST'}
            body={[
                    {
                      name: 'email',
                      type: 'email',
                      max: 24,
                      min: 3,
                    },
                    {
                      name: 'full-name',
                      type: 'text',
                      placeholder: 'John Doe',
                      required: true,
                    },
                    {
                      name: 'phone',
                      type: 'tel',
                      pattern: '/\d\d\d-\d\d\d\d/',
                    },
                ]}
        />
      </div>
    );
  }
}

export default App;

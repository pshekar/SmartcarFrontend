import React, { Component } from 'react';
import '../css/APIExplorer.css';
import axios from 'axios';

class APIExplorer extends Component {
    //get props from parent (App.js), as well as set state
    //bind methods to this to be able to access state
    constructor(props) {
        super(props);
        this.state = {
            bodies: [],
            response: '',
        }
        this.sendRequest = this.sendRequest.bind(this);
        this.getUpdatedBody = this.getUpdatedBody.bind(this);
    }

    //when props are received from parent component but before rendering,
    //populate the body (if PUT or POST) with the attributes from props
    componentDidMount() {
        //parse body here
        if (this.props.body) {
            this.props.body.map(section => {
                var body = {};
                for (var key in section) {
                    //check it isn't empty
                    if (!section.hasOwnProperty(key)) continue;
                    // since regex doesnt get passed properly as a prop, remake it
                    if (key === 'pattern') {
                        var pattern = '';
                        for (var i = 1; i < section[key].length-1; i++) {
                            if (section[key].charAt(i).match(/[a-z]/)) {
                                pattern += '\\' + section[key].charAt(i);
                            }
                            else {
                                pattern += section[key].charAt(i);
                            }
                        }
                        var obj = pattern;
                    }
                    else {
                        obj = section[key];
                    }
                    //add attribute's value to the object
                    body[key] = obj;
                }
                //update the state with each new body
                return this.setState(prevState => ({
                    bodies: [...prevState.bodies, body],
                    [section.name]: ''
                }))
            })
        }

    }

    //updates input variables when changed
    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    //when submit button is pressed, changes depending on type of method
    //assumed only 4 HTTP request types, even though more exist
    //used axios for HTTP requests
    sendRequest(event) {
        event.preventDefault();
        if (this.props.method === 'GET') {
            axios.get(this.props.url)
            .then(response => {
                this.setState({response: JSON.stringify(response.data)})
            })
            .catch(err => {
                this.setState({response: err.message});
            })
        }
        else if (this.props.method === 'POST') {
            var body = this.getUpdatedBody();
            axios.post(this.props.url, body)
            .then(response => {
                this.setState({response: response.body})
            })
            .catch(err => {
                this.setState({response: err.message});
            })
        }
        else if (this.props.method === 'PUT') {
            body = this.getUpdatedBody();
            axios.put(this.props.url, body)
            .then(response => {
                this.setState({response: JSON.stringify(response.data)})
            })
            .catch(err => {
                this.setState({response: err.message});
            })
        }
        else if (this.props.method === 'DELETE') {
            axios.delete(this.props.url)
            .then(response => {
                this.setState({response: response.data})
            })
            .catch(err => {
                this.setState({response: err.message});
            })
        }
        else {
            //none of the 4 HTTP requests used
            alert("Invalid request.")
        }
    }

    getUpdatedBody() {
        var result = {};
        for (var key in this.state) {
            if (!(key === 'bodies' || key === 'response')) {
                result = Object.assign({[key]: this.state[key]}, result);
            }
        }
        return result;
    }

    //where HTML gets rendered
    //since the component is rerendered after state change, this updates when
    //the body is first populated to show all variable attributes, as well as when
    //form is submitted, showing response
    render() {
        return (
            <div className="center">
                <form className="form" onSubmit={this.sendRequest}>
                    <div className="title">
                        {this.props.title}
                    </div>
                    <div className="method">
                        {this.props.method}
                    </div>
                    <div className="url-outside">
                        Base URL
                        <div className="url-inside">
                        {this.props.url}
                        </div>
                    </div>
                    {(this.props.method === 'POST' || this.props.method === 'PUT') ? (
                        <div className="bodySection">
                            Body
                            {this.state.bodies.map((body, index)=>(
                                <div className="eachBody" key={index}>
                                    <div className="bodyName">
                                        {body.name.replace(/\w+/g,
                                        function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase()})}
                                        {body.required === true ? <span>*</span> : ""}
                                    </div>
                                    <input className="body" {...body} onChange={this.onChange} />
                                </div>
                            ))}
                            <button className="submit">Send Request</button>
                        </div>)
                        :
                        <div>
                            <button className="submit">Send Request</button>
                        </div>
                    }
                    <div className="response">
                        Response
                        <div className="responseArea">
                            {(this.state.response && this.state.response.length > 0) ?
                                <pre>{this.state.response}</pre>
                                :
                                ""
                            }
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default APIExplorer;

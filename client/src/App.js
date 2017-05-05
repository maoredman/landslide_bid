import React, { Component } from 'react';
var Recaptcha = require('react-recaptcha');
/*
import SelectedFoods from './SelectedFoods';
import FoodSearch from './FoodSearch';
*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forNums: [],
      againstNums: [], // need constructor to bind "this"?
      currentNear: '',
      currentFor: 0,
      currentAgainst: 0,
      bettingOn: true,
      stakes: 0,
      sitekey: "INSERT_SITEKEY_HERE",
      recaptchaResponse: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLocation = this.handleLocation.bind(this);
    this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
    this.recaptchaResponded = this.recaptchaResponded.bind(this);
  }

  componentDidMount() {
    fetch('http://nasa.rails.nctu.me/info_markets/result', {
      accept: 'application/json',
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      var newforNums = [];
      var newagainstNums = [];

      for (var a = 0; a < data.length; a++) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].near === String.fromCharCode('A'.charCodeAt(0) + a)) {
            newforNums.push(data[i].forNum);
            newagainstNums.push(data[i].againstNum);
            break;
          }
        }
      }
      this.setState({ forNums: newforNums, againstNums: newagainstNums });
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log(JSON.stringify({ 'info_market':
        {
          near: this.state.currentNear,
          forNum: this.state.currentFor,
          againstNum: this.state.currentAgainst
        }
      }));

    fetch('http://nasa.rails.nctu.me/info_markets/create', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'info_market':
        {
          near: this.state.currentNear,
          forNum: this.state.currentFor,
          againstNum: this.state.currentAgainst,
          response: this.state.recaptchaResponse,
        }
      }),
    }).then(function(res) {
        if (res.ok) {
          return res.text();
        } else if (res.status === 401) {
          alert("Oops! You are not authorized.");
        }
      }, function(e) {
        alert("Error submitting form!");
    }).then((token) => {
        alert('This token can be used to redeem your reward: ' + token);
    });
  }

  handleFocus(betOn, nearNum) {
    if(betOn) {
      this.setState({ bettingOn: true, currentAgainst: 0, currentNear: String.fromCharCode('A'.charCodeAt(0) + nearNum) });
    } else {
      this.setState({ bettingOn: false, currentFor: 0, currentNear: String.fromCharCode('A'.charCodeAt(0) + nearNum) });
    }
  }

  handleChange(event) {
    if(this.state.bettingOn) {
      var newcurrentFor = parseInt(event.target.value, 10);
      console.log(this.state.againstNums[this.state.currentNear.charCodeAt(0)-65])
      this.setState({ currentFor: newcurrentFor, stakes: (this.state.forNums[this.state.currentNear.charCodeAt(0)-65] + this.state.againstNums[this.state.currentNear.charCodeAt(0)-65] + newcurrentFor) / (this.state.forNums[this.state.currentNear.charCodeAt(0)-65] + newcurrentFor) });
    } else {
      var newcurrentAgainst = parseInt(event.target.value, 10);
      this.setState({ currentAgainst: newcurrentAgainst, stakes: (this.state.forNums[this.state.currentNear.charCodeAt(0)-65] + this.state.againstNums[this.state.currentNear.charCodeAt(0)-65] + newcurrentAgainst) / (this.state.againstNums[this.state.currentNear.charCodeAt(0)-65] + newcurrentAgainst) });
    }
  }

  handleLocation(event) {
    var num = parseInt(event.target.value, 10);
    console.log('handle '+num);
    this.setState({ currentNear: String.fromCharCode('A'.charCodeAt(0) + num) });
  }

  recaptchaLoaded() {
    console.log('Done!!!!');
  }

  recaptchaResponded(response) {
    console.log('recaptcha response: ' + response);
    this.setState({ recaptchaResponse: response });
  };

  render() {
    return (
      <div>
        <input id="storeLocation" style={{ display: 'none' }} type="text" onChange={this.handleLocation} />
        <h1 className="register-title" id="formTitle">Click location on map</h1>
        <form className="register" onSubmit={this.handleSubmit}>
          <h5>Do you think a landslide will happen here within 2 months?</h5>
          <div className="register-switch">
            <input onClick={() => this.setState({ bettingOn: true, currentFor: this.state.currentAgainst, currentAgainst: 0 })} type="radio" name="sex" defaultValue="F" id="sex_f" className="register-switch-input" defaultChecked />
            <label htmlFor="sex_f" className="register-switch-label">Yes</label>
            <input onClick={() => this.setState({ bettingOn: false, currentAgainst: this.state.currentFor, currentFor: 0 })} type="radio" name="sex" defaultValue="M" id="sex_m" className="register-switch-input" />
            <label htmlFor="sex_m" className="register-switch-label">No</label>
          </div>
          <h5>To ensure serious predictions, we request you submit an amount to bid. If your prediction is correct, you shall receive additional rewards according to the bidding stakes at that time.</h5>
          <input onChange={this.handleChange} type="text" className="register-input" placeholder="Enter a number to bid" />
          <h5>Stakes: {this.state.stakes}</h5>
          The current bidding stakes are calculated according to parimutuel betting standards
          <div id="recaptcha">
            <Recaptcha
              sitekey={this.state.sitekey}
              render="explicit"
              onloadCallback={this.recaptchaLoaded}
              verifyCallback={this.recaptchaResponded}
            />
          </div>
          <input type="submit" defaultValue="Submit Prediction" className="register-button" />
        </form>
      </div>
    );
  }
}

export default App;

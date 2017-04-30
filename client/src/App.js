import React, { Component } from 'react';
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
      bettingOn: false,
      stakes: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
          againstNum: this.state.currentAgainst
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
        alert('Bet token is: ' + token);
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

  render() {
    return (
      <form className="myform" onSubmit={this.handleSubmit}>
        <ul>
          <li id="0">
            臺灣大學綜合體育館
            <label>Bet on landslide</label>
            <input type="text" size="6" onFocus={() => this.handleFocus(true, 0)} onChange={this.handleChange}/>
            <label>Bet on no landslide</label>
            <input type="text" size="6" onFocus={() => this.handleFocus(false, 0)} onChange={this.handleChange}/>
          </li>
          <li id="1">
            新竹縣五峰鄉桃山村
            <label>Bet on landslide</label>
            <input type="text" size="6" onFocus={() => this.handleFocus(true, 1)} onChange={this.handleChange}/>
            <label>Bet on no landslide</label>
            <input type="text" size="6" onFocus={() => this.handleFocus(false, 1)} onChange={this.handleChange}/>
          </li>
          <li id="2">
            南投縣魚池鄉日月村
            <label>Bet on landslide</label>
            <input type="text" size="6" onFocus={() => this.handleFocus(true, 2)} onChange={this.handleChange}/>
            <label>Bet on no landslide</label>
            <input type="text" size="6" onFocus={() => this.handleFocus(false, 2)} onChange={this.handleChange}/>
          </li>
          <li id="3">
            嘉義縣中埔鄉中崙村
            <label>Bet on landslide</label>
            <input type="text" size="6" onFocus={() => this.handleFocus(true, 3)} onChange={this.handleChange}/>
            <label>Bet on no landslide</label>
            <input type="text" size="6" onFocus={() => this.handleFocus(false, 3)} onChange={this.handleChange}/>
          </li>
          <li id="4">
            高雄市六龜區興龍里
            <label>Bet on landslide</label>
            <input type="text" size="6" onFocus={() => this.handleFocus(true, 4)} onChange={this.handleChange}/>
            <label>Bet on no landslide</label>
            <input type="text" size="6" onFocus={() => this.handleFocus(false, 4)} onChange={this.handleChange}/>
          </li>
        </ul>
        <div>Stakes: {this.state.stakes}</div>
      <input type="submit" value="Place bet" />
    </form>
    );
  }
}

export default App;

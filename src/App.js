import React, { Component } from 'react'
import MultiSigWallet from '../build/contracts/MultiSigWallet.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    // Items in component's state
    this.state = {
      multiSigContract: null,
      web3: null,
      /// Where we track all events emit by the contract for display
      events: [],
      numEvents: 0
    }

    this.sendEther = this.sendEther.bind(this);
    this.watchLogs = this.watchLogs.bind(this);

  }

  componentWillMount() {

    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
    // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.');
    })

  }

  instantiateContract() {
    const contract = require('truffle-contract');
    const multiSig = contract(MultiSigWallet);
    multiSig.setProvider(this.state.web3.currentProvider);
    multiSig.deployed().then((instance) => {
      /// Save our contract obj in internal state
      this.setState({multiSigContract: instance})
    }).then(() => this.watchLogs())
  }

  watchLogs() {
    var depositFundsEvent = this.state.multiSigContract.DepositFunds();
    var transactionCreatedEvent = this.state.multiSigContract.TransactionCreated();
    var transactionCompletedEvent = this.state.multiSigContract.TransactionCompleted();
    var transactionSignedEvent = this.state.multiSigContract.TransactionSigned();

    /// save reference to global component obj for later user
    var that = this;

    depositFundsEvent.watch(function(error, result) {
      if (error) {
        console.log(error);
      } else {
        that.setState({events: that.state.events.concat([result.event])});
      }
    })

    transactionCreatedEvent.watch(function(error, result) {
      if (error) {
        console.log(error);
      } else {
        that.setState({events: that.state.events.concat([result.event])});
      }
    })

    transactionCompletedEvent.watch(function(error, result) {
      if (error) {
        console.log(error);
      } else {
        that.setState({events: that.state.events.concat([result.event])});
      }
    })

    transactionSignedEvent.watch(function(error, result) {
      if (error) {
        console.log(error);
      } else {
        that.setState({events: that.state.events.concat([result.event])});
      }
    })
  }

  sendEther() {
    this.state.web3.eth.sendTransaction({from: 0x0,
      value: 2,
      to: this.state.multiSigContract});;
  }

  render() {
    return (
      <div className="body">
        <h1>Full Stack Dapp: Event Logging</h1>
        <h3>Here you'll see events logged by the multi-sig contract you implemented. First click the button below. Behind the scenes this is sending ether to the multi-sig contract. Accordingly, we'll see the DepositFunds event logged below.</h3>
        <ul>
          {this.state.events.map(function(event){
            return <li className="list-item">{event}</li>;
          })}
        </ul>
        <button onClick={this.sendEther} className="ether-btn">Send Ether</button>
      </div>
    );
  }

}

export default App

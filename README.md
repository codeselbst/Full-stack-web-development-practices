# Exercises for Full stack web development Tutorial Course
This repository is where you can find some really easy samples for the mentioned videos.

## Summary
The final project of this course combined all what we have learned so far, including HTML with Bootstrap, API calling, setting up localhost server, and then quick build React app. It calls Json data from our database (mongo-localhost) and creates three items with button to add or remove to another list. Practical and useful project overall!!

| Structure | 
| --------- |
          |__React
             |__node_modules
             |__public
             |  |__index.html
             |__public
                  |__src
                  |  |__product
                  |     |__product.js
                  |  |__productCondensed
                  |     |__productcondensed.js
                  |  |__service
                  |     |__data_service.js
                  |     |__notification.js
                  |  |__watchlist
                  |     |__watchlist.js
                  |__app.js

app.js
the main scaffold is constructed here
```
import React from "react";

//components
import Product from './product/product';
import Watchlist from './watchlist/watchlist';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.productList = this.productList.bind(this);
    this.state = {products: []};
  }

  clickHandler() {
    fetch("http://localhost:3000/")
      .then(response => {
        return response.json();
      })
      .then(text => {
        this.setState({
          products: text
        });
      })
      .catch(
        this.setState({
          console.log("failed to fetch the data")
        })
      );
  }
  productList = () => {
    const list = this.state.products.map((product) =>
      <div className="col-sm-4" key={product._id}>
        <Product product={product} />
      </div>
    );
    return (list);
  }
  render() {
    return (
      <div className="App">
        <button onClick={() => this.clickHandler()}>get txt</button>
        <div className="container-fluid App-main">
          <div className="row">
            <div className="col-sm-8">
              <div className="row">{this.productList()}</div>
            </div><div className="col-sm-4"><Watchlist /></div></div>
        </div>
      </div>
    );
  }
}
export default App;
```
product.js
Here the fectched data is imported and show as a result
```
import React, {Component} from 'react';
import './product.css';
import dataService from '../service/data_service';
import notificationService, {NOTIF_WATCHLIST_CHANGED} from '../service/notification'; 

let ns = new notificationService();
let ds =new dataService();

class Product extends Component {
    constructor(props) {
        super(props);
        this.state= {onWatchList: ds.itemOnWatchList()};
        this.onButtonClicked= this.onButtonClicked.bind(this);
        this.onWatchListChanged=this.onWatchListChanged.bind(this);
    }
    componentDidMount(){
        ns.addObserver(NOTIF_WATCHLIST_CHANGED,this,this.onWatchListChanged);
        console.log("36")
    }
    componentWillUnmount(){
        ns.removeObserver(this,NOTIF_WATCHLIST_CHANGED)
        console.log("2")
    }
    onWatchListChanged(newWatchList) {
        this.setState({onWatchList: ds.itemOnWatchList(this.props.product)})
    }
    onButtonClicked= ()=>{
        if (this.state.onWatchList) {
            ds.removeWatchListitem(this.props.product);
        } else {
            ds.addWatchListitem(this.props.product);
        }
        
    }
    render() {
        var btnClass;
        if(this.state.onWatchList) {
            btnClass="btn btn-danger";
        } else {
            btnClass="btn btn-primary";
        }
        return (
            <div className="card">
                <img className="card-img-top" src={this.props.product.imgUrl} alt="product"></img>
                <div className="card-block">
                    <h4 className="card-title">Name: {this.props.product.title}</h4>
                    <p className="card-text">Price:${this.props.product.price}</p>
                    <a  onClick={()=>this.onButtonClicked()} className={btnClass}>{this.state.onWatchList? 
                    "Remove from watchList": "Add to card"}</a>
                </div>
            </div>
            
        );
    }
}
export default Product;
```
data_service.js
The class is created with multiplie functions used in productcondensed.js.
```
import notificationService, {NOTIF_WATCHLIST_CHANGED} from './notification'; //順序不能換

let ns= new notificationService();
let instance = null;
let watchList=[];

class dataService {
    constructor(){
        if(!instance){
            instance=this;
        }
        return instance;
    }
    itemOnWatchList=item=> {
        for (var x=0; x<watchList.length; x++) {
            if (watchList[x]._id===item._id) {
                return true;
            }
        }
        return false;
    }
    addWatchListitem =item =>{
        watchList.push(item);
        ns.postNotification(NOTIF_WATCHLIST_CHANGED,watchList);
        console.log("item added to watchlistitem")

    }
    removeWatchListitem=item => {
        for(var x=0; x< watchList.length; x++){
            if (watchList[x]._id===item._id){
                watchList.splice(x,1);
                ns.postNotification(NOTIF_WATCHLIST_CHANGED,watchList)
                break;
            }
        }
    }
}
export default dataService;
```
productcondensed.js
Data from watchlist is extended with functions from data_service.js and show the result on watchlist.js.
```
import React, {Component} from 'react';
import dataService from '../service/data_service';

let ds = new dataService();

class Productcondensed extends Component {
    constructor (props){
        super(props) ;
        this.removeProduct= this.removeProduct.bind(this);
    }
    removeProduct =()=> {
        ds.removeWatchListitem(this.props.product);
    }
    render() {
      
        return (
            <div>
                <li className="list group-item">
                <a className="btn btn-outline-danger" onClick={()=>this.removeProduct()}>x</a>
                <p>{this.props.product.title} | 
                ${this.props.product.price}</p>
            </li>
            </div>
  
        );
    }
}
export default Productcondensed;
```
notification.js
This class monitiors changes each time we click or unclick the item.
```
export const NOTIF_WATCHLIST_CHANGED ="notif_watchlist_changed";

var observers={};
let instance =null;

class notificationService {
    constructor(){
        if(!instance){
            instance=this;
        }
        return instance;
    }
    postNotification = (notifName, data) => {
        let obs = observers[notifName];
        for (var x =0; x<obs.length; x++){
            var obj=obs[x];
            obj.callBack(data);
            console.log("posted notification")
        }
    }
    removeObserver= (observer,notifName) =>{
        var obs=observers[notifName];
        if (obs) {
            for(var x=0 ; x < obs.length; x++) {
                if (observer===obs[x].observer) {
                    obs.splice(x,1);
                    observers[notifName] = obs;
                    break;
                }
            }
         }
         console.log("removed ")
    }
    addObserver =(notifName,observer,callBack)=>{
        let obs = observers[notifName];

        if(!obs){
            observers[notifName]=[];
        }
        let obj = {observer: observer, callBack: callBack};
        observers[notifName].push(obj);
    }
}
export default notificationService;
```
watchlist.js
It recieves data from app.js and send it to productcondensed.js.
```
import React, {Component} from 'react';
import './watchlist.css';

import Productcondensed from '../productCondensed/productcondensed';

import notificationService, { NOTIF_WATCHLIST_CHANGED } from '../service/notification';
let ns = new notificationService();
class Watchlist extends Component {
    constructor(props) {
        super(props);
        this.state={watchList:[]}
        this.createWatchlist=this.createWatchlist.bind(this);
        this.onWatchListChanged=this.onWatchListChanged.bind(this);
    }
    componentDidMount(){console.log("33")
        ns.addObserver(NOTIF_WATCHLIST_CHANGED,this,this.onWatchListChanged);        
    }
    componentWillUnmount(){
        ns.removeObserver(this,NOTIF_WATCHLIST_CHANGED)        
    }
    onWatchListChanged(newWatchList){
        this.setState({watchList: newWatchList});
    }

    createWatchlist=()=> {
        const list=this.state.watchList.map((product)=>
        <div key={product._id}>
        <Productcondensed product={product} />
      </div>
        );
        return(list);  
    }
    
    render() {
        return (
           <div className="card">
               <div className="card-block">
                   <h4 className="card-title">Watch List</h4>
                   <ul className="list-group">
                {this.createWatchlist()}
                   </ul>
               </div>
           </div>
        );
    }
}

export default Watchlist;
```

## Acknowledgments

* The videos are from MERN Stack Web Development Tutorial Course/ [See their channel](https://www.youtube.com/channel/UCDsEHTvh-YO80AZna7X7UVA)

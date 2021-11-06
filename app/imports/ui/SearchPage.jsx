import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
const User = Meteor.users;
import {List} from 'react-virtualized';
import SearchField from 'react-search-field';
import {Link} from "react-router-dom";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Comments from './Comments.jsx';

const defaultList = [
    'Brian Vaughn',
    '123',
    'Brian Vaughn',
    '123',
    'Brian Vaughn',
    '123',
 ]; 

class SearchStartups extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            search: "",
        }
    }

    rowRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
      }) {
        const list = this.props.users.map((user) => user) || defaultList;
        const search = this.state.search || "";
        const filteredList = list.filter((el) => {
            return el._id.toLowerCase().includes(search.toLowerCase())
            }
        );
        const element = filteredList[index];
        return (
          <div key={key} style={style}>
            <Link to={`/room/${element._id}`}>{element._id}</Link>
          </div>
        );
      }

    searchEntries(search){
        this.setState({search: search});
        console.log(search);
    }

    render(){
        const list = this.props.users.map((user) => user._id) || defaultList;
        return (
            <div>
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                    <Tab eventKey="long" title="Long-term">
                        <div>Long-term</div>
                    </Tab>
                    <Tab eventKey="fixed" title="Fixed-term">
                        <div>Fixed-term</div>
                    </Tab>
                    <Tab eventKey="short" title="Short-term">
                        <div>Short-term</div>
                    </Tab>
                </Tabs>
                <div>Search Rooms</div>
                <SearchField 
                    placeholder='Type keywords'
                    onChange={(search)=>{this.searchEntries(search)}}
                    />
                <List
                    width={300}
                    height={300}
                    rowCount={list.length}
                    rowHeight={20}
                    rowRenderer={(obj) => this.rowRenderer(obj)}
                />
            </div>     
        );
    }
}

export default withTracker(()=>{
    const usersLoading = !Meteor.subscribe("all_users").ready();
    const users = User.find({
        _id:{
            $ne : Meteor.userId()
        }
    }).fetch();
    return {
        usersLoading,
        users
    };
})(SearchStartups);
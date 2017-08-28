import React from "react";
import {withRouter} from "react-router";
import Paper from "material-ui/Paper";
import muiThemeable from "material-ui/styles/muiThemeable";
import Divider from "material-ui/Divider";
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import NewsFeedIcon from "material-ui/svg-icons/social/notifications";
import GroupIcon from "material-ui/svg-icons/social/group";
import SignOutIcon from "material-ui/svg-icons/action/exit-to-app";
import {List, ListItem, makeSelectable} from "material-ui/List";
import {GridList, GridTile} from 'material-ui/GridList';
import { Link } from 'react-router'

// STYLE - UI RELATED
const styleFromMuiTheme = (muiTheme) => {
  return {
    color: muiTheme.fullWhite,
    flex: 1,
    marginLeft: 0,
    order: -1,
    transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    backgroundColor: muiTheme.palette.primary1Color
  }
};
const SelectableList = makeSelectable(List);
const styles = {
  logo: {
    maxWidth: "100%",
    height: "auto",
  },
  logoPanel: {
 
  }
};
class NavigationBar extends React.Component {

  state = {
    pageValue: -1,
  };


  componentWillReceiveProps(nextProps) {
    if (this.props.data) {
      this.props.data.refetch();
    }
  }

  render() {
    const {muiTheme} = this.props;
    const navigationStyle = styleFromMuiTheme(muiTheme);
    const pageValue = this._determinePageValue();
    console.log(this.props.data);
    return (
      <Paper style={navigationStyle}>
      <div style={styles.logoPanel}>
        <Link to="/"><img src="./logo.png" style={styles.logo}/></Link>
      </div>
        <Divider />
        <SelectableList
          value={pageValue}>
          <ListItem value={-1}
                    innerDivStyle={{color: 'white'}}
                    primaryText="News Feed"
                    checked={true}
                    onClick={this._goToNewsFeedPage}
                    leftIcon={<NewsFeedIcon color="white"/>}/>
          <ListItem value={-2}
                    innerDivStyle={{color: 'white'}}
                    disabled={true}
                    primaryText="Groups" leftIcon={<GroupIcon color="white"/>}/>
          {this.renderGroupList()}
          <ListItem onClick={this._addNewGroup}
                    innerDivStyle={{color: 'white'}}
                    value={-4}
                    style={{paddingLeft: 20}}>
            <div style={{opacity: 0.3}}>Create a group...</div>
          </ListItem>
          <ListItem value={-3}
                    innerDivStyle={{color: 'white'}}
                    primaryText="Sign out"
                    onClick={this._signOut}
                    leftIcon={<SignOutIcon color="white"/>}/>
        </SelectableList>
      </Paper>
    )
  }

  _determinePageValue = () => {
    let {location} = this.props;
    if (location.pathname == "/") { return -1; }
    let regex = /^\/group\/(\d+)/gi;
    let match = regex.exec(location.pathname);
    if (match) {
      return parseInt(match[1]);
    } else {
      if (/^\/group\//gi.test(location.pathname)) {
        return -4;
      } else {
        return -999;
      }
    }

  };


  renderGroupList() {
    let {groups} = this.props.data;
    if (groups) {
      return groups.map(group => (
        <ListItem
          key={group.groupId}
          innerDivStyle={{color: 'white'}}
          onClick={() => {
            this._goToGroupPage(group.groupId)
          }}
          value={group.groupId} style={{paddingLeft: 20}}>
          {group.name}
        </ListItem>
      ));
    } else {
      return null;
    }
    // {/*onClick={this._goToGroupPage(group.id)}*/}
  }

  _goToNewsFeedPage = () => {
    this.setState({pageValue: -1});
    // TODO - go to news pageState
    this.props.router.replace("/");
  };
  _goToGroupPage = (groupId) => {
    this.setState({pageValue: groupId});
    // TODO - go to group pageState
    this.props.router.replace(`/group/${groupId}`);
  };

  _addNewGroup = () => {
    this.props.router.replace("/group/create");
  };

  _signOut = () => {
    localStorage.clear();
    this.props.router.replace("/sign-in");
  }

}

// DATA RELATED
const getGroupsQuery = gql` query {
  groups {
    groupId
    name
  }
}`;

const withData = graphql(getGroupsQuery, {
  options: {
    forceFetch: true,
  }
});

export default muiThemeable()(withRouter(withData(NavigationBar)));

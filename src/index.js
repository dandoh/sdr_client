import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import ApolloClient, {createNetworkInterface} from 'apollo-client'
import {ApolloProvider} from 'react-apollo'

import './index.css'
import App from './App'
import GroupPage from './containers/GroupPage'
import CreateReportPage from './containers/CreateReportPage'
import UsersPage from './containers/UsersPage'
import SignInPage from './containers/SignInPage'
import SignUpPage from './containers/SignUpPage'
import ReportDetailPage from './containers/ReportDetailPage'
import NewsFeedPage from './containers/NewsFeedPage'
import UserReportPage from './containers/UserReportPage'
import UserArchivePage from './containers/UserArchivePage'



const logErrors = {
  applyAfterware({response}, next) {
    if (!response.ok) {
      response.clone().text().then(bodyText => {
        console.error(`Network Error: ${response.status} (${response.statusText}) - ${bodyText}`);
        next();
      });
    } else {
      response.clone().json().then(({errors}) => {
        if (errors) {
          console.error('GraphQL Errors:', errors.map(e => e.message));
        }
        next();
      });
    }
  },
};
let networkInterface = createNetworkInterface({uri: 'http://localhost:8080/graphql'});
networkInterface.useAfter([logErrors]);
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    // get the authentication token from local storage if it exists
    let token = localStorage.getItem("token");
    req.options.headers.authorization = token ? `Bearer ${token}` : null;
    next();
  }
}]);

const client = new ApolloClient({
  networkInterface: networkInterface,
  dataIdFromObject: o => o.id
});


function ensureSignedIn(nextState, replace) {
  const token = localStorage.getItem('token');
  if (!token) {
    replace("/sign-in")
  }
}

function ensureSignedOut(nextState, replace) {
  const token = localStorage.getItem('token');
  if (token) {
    replace("/")
  }
}

ReactDOM.render((
    <ApolloProvider client={client}>
      <Router history={browserHistory}>
        <Route path="/">
          <Route onEnter={ensureSignedIn} components={App}>
            <IndexRoute component={NewsFeedPage}/>
            <Route path="group">
              <Route path=":groupId" component={GroupPage}/>
            </Route>

            <Route path="user">
              <Route path=":userId">
                <Route path="report" component={UserReportPage}>
                  <Route path="archives" component={UserArchivePage}/>
                  <Route path=":reportId" component={ReportDetailPage}/>
                </Route>
              </Route>

            </Route>
          </Route>
          <Route onEnter={ensureSignedOut}>
            <Route path="sign-in" component={SignInPage}/>
            <Route path="sign-up" component={SignUpPage}/>
          </Route>
        </Route>

      </Router>
    </ApolloProvider>
  ),
  document.getElementById('root')
);

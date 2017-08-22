import React from "react";
import {MuiThemeProvider} from "material-ui/styles";
import autoprefixer from "material-ui/utils/autoprefixer";
import NavigationBar from "./containers/NavigationBar";
import muiTheme from "./mui/muiTheme"

const styles = {
  wrapper: {
    // Avoid IE bug with Flexbox, see #467
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
  body: {
    backgroundColor: '#edecec',
    display: 'flex',
    flex: 1,
  },
  content: {
    padding: '1vh',
    flex: 3,
    height: '100vh',
    overflowY:'auto',
  },
};

const prefixedStyles = {};

class App extends React.Component {

  state = {
    navigationBarOpen: true,
  };

  render() {
    if (!prefixedStyles.main) {
      // do this once because user agent never changes
      const prefix = autoprefixer(muiTheme);
      prefixedStyles.wrapper = prefix(styles.wrapper);
      prefixedStyles.main = prefix(styles.main);
      prefixedStyles.body = prefix(styles.body);
      prefixedStyles.content = prefix(styles.content);
    }
    const childrenWithProps = React.cloneElement(this.props.children, {
      reload: () => {this.forceUpdate()}
    });
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={prefixedStyles.wrapper}>
          <div style={prefixedStyles.main}>
            <div style={prefixedStyles.body}>
              <NavigationBar location={this.props.location}/>
              <div style={prefixedStyles.content}>
                {childrenWithProps}
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App;

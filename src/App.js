import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {MuiThemeProvider} from 'material-ui/styles';
import autoprefixer from 'material-ui/utils/autoprefixer';
import AppBar from 'material-ui/AppBar';

import NavigationBar from './containers/NavigationBar';
import {
  cyan700,
  grey600,
  pinkA100, pinkA200, pinkA400,
  fullWhite,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

const theme = getMuiTheme({
  palette: {
    primary1Color: '#646464',
    primary2Color: pinkA200,
    primary3Color: pinkA100,
    accent1Color: cyan700,
    accent2Color: cyan700,
    accent3Color: grey600,
    textColor: fullWhite,
    secondaryTextColor: fade(fullWhite, 0.7),
    alternateTextColor: '#303030',
    canvasColor: '#303030',
    borderColor: fade(fullWhite, 0.3),
    disabledColor: fade(fullWhite, 0.3),
    pickerHeaderColor: fade(fullWhite, 0.12),
    clockCircleColor: fade(fullWhite, 0.12),
  },
  svgIcon: {
    color: "#FFFFFF"
  }
});

const styles = {
  wrapper: {
    // Avoid IE bug with Flexbox, see #467
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  body: {
    backgroundColor: '#edecec',
    display: 'flex',
    flex: 1,
    overflowY: 'hidden',
    overflowX: 'scroll',
  },
  content: {
    flex: 3,
  },
};

const prefixedStyles = {};

class App extends React.Component {

  state = {
    navigationBarOpen: true,
  };

  render() {
    const muiTheme = getMuiTheme(theme);
    if (!prefixedStyles.main) {
      // do this once because user agent never changes
      const prefix = autoprefixer(muiTheme);
      prefixedStyles.wrapper = prefix(styles.wrapper);
      prefixedStyles.main = prefix(styles.main);
      prefixedStyles.body = prefix(styles.body);
      prefixedStyles.content = prefix(styles.content);
    }
    const {children} = this.props;
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div style={prefixedStyles.wrapper}>
          <div style={prefixedStyles.main}>
            <div style={prefixedStyles.body}>
              <NavigationBar/>
              <div style={prefixedStyles.content}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App;

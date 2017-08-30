/**
 * Created by Dandoh on 8/17/17.
 */
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  cyan700,
  grey600,
  pinkA100, pinkA200, pinkA400,
  fullBlack,
  fullWhite,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

const theme = getMuiTheme({
  palette: {
    primary1Color: '#a0000d',
    primary2Color: pinkA200,
    primary3Color: pinkA100,
    accent1Color: cyan700,
    accent2Color: cyan700,
    accent3Color: grey600,
    textColor: fullBlack,
    secondaryTextColor: fade(fullBlack, 0.7),
    alternateTextColor: '#ffffff',
    canvasColor: '#FFFFFF',
    borderColor: fade(fullBlack, 0.3),
    disabledColor: fade(fullBlack, 0.3),
    pickerHeaderColor: fade(fullBlack, 0.12),
    clockCircleColor: fade(fullBlack, 0.12),
  },
  svgIcon: {
    color: "#FFFFFF"
  },
  fullWhite
});
export default theme;


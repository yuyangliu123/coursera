import {extendTheme} from "@chakra-ui/react"
const theme = extendTheme({
  layerStyles:{
    inside:{
      margin:"0 15%"
    }
  },
  textStyles: {
    StyledNav: {
      // you can also use responsive styles
      fontFamily: `'Karla', serif`,
        lineHeight: '1.6',
        fontWeight: 500,
        letterSpacing: '.05em',
        fontSize:{base:"1.5em",lg:"0.9em",xl:"1.2em"}
    },
    StyledH1: {
      // you can also use responsive styles
      fontFamily: `'Markazi Text Variable', serif`,
      fontSize:{xl:"64px",base:"51.2px"},
      fontWeight: 500,
      lineHeight: '110%',
      letterSpacing: '-2%',
      color:"#F4CE14",
      width:{base:"fit-content",lg:"auto"}
    },
    StyledH2: {
      // you can also use responsive styles
      fontFamily: `'Markazi Text Variable', serif`,
      fontSize:{xl:"40px",base:"32px"},
      fontWeight: 500,
      lineHeight: '110%',
      letterSpacing: '-2%',
      color:"#FFFFFF"
    },
    StyledText: {
      // you can also use responsive styles
      fontFamily: `'Karla', serif`,
      fontSize:"20px",
      fontWeight: 500,
      lineHeight: '110%',
      letterSpacing: '-2%',
      color:"#FFFFFF"
    },
    StyledButton:{
      baseStyle:{
        color:"#000000",
        backgroundColor:"#F4CE14",
        fontFamily:`'Karla', serif`,
        _hover:{
          backgroundColor:"#FFF500"
        }
      }
    },
    CardTitle:{
      fontFamily: `'Karla', serif`,
      fontSize: "18px",
      fontWeight: 800,
      lineHeight: '110%',
      letterSpacing: '-2%',
      color:"#000000"
    },CardText:{
      fontFamily: `'Karla', serif`,
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: '110%',
      letterSpacing: '-2%',
      color:"#000000"
    },
    HighlightText:{
      fontFamily: `'Karla', serif`,
      fontSize: "105%",
      fontWeight: 500,
      lineHeight: '110%',
      letterSpacing: '-2%',
      color:"RED"
    }
  },
  breakpoints : {
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    xxl: "1400px"
  },
  styles:{
    global:{
      nav: {
        fontFamily: `'Karla', serif`,
        lineHeight: '1.6',
        fontWeight: 500,
        letterSpacing: '.05em',
        fontSize:"18px",
      },
    }
  }
});
export default theme



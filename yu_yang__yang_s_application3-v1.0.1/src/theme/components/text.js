const baseStyle = {
  color: "white.A700",
  fontFamily: "Karla",
};
const sizes = {
  xs: {
    fontSize: '{"md":"32px","base":"28px","sm":"30px"}',
    fontWeight: 400,
  },
  s: {
    fontSize: '{"md":"64px","base":"48px"}',
    fontWeight: 500,
  },
};
const defaultProps = {
  size: "xs",
};

const Text = {
  baseStyle,
  sizes,
  defaultProps,
};
export default Text;

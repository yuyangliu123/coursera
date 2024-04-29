import { Text } from "@chakra-ui/react";
//A solution to the problem of React Router being unable to scroll to #hash-fragments when navigating with the <Link> component.
import { HashLink } from "react-router-hash-link";
import { useToken } from "../provider/JwtToken";
const NavItem = ({ setIsOpen = () => {} }) => {
  const navElement = [
    {
      name: "HOME",
      href: "/#top"
    },
    {
      name: "ABOUT",
      href: "/#about"
    },
    {
      name: "MENU",
      href: "/#menu"
    },
    {
      name: "RESERVATIONS",
      href: "/reservation"
    },
    {
      name: "ORDER ONLINE",
      href: "/order"
    },
    {
      name: "LOGIN",
      href: "/login"
    }
  ];
  const fname=useToken().fname
  const lname=useToken().lname
  const availableToken=useToken().availableToken
  return (
    <>
      {navElement.map((element) => {
      return(
      <HashLink
      to={element.href}
      onClick={() => setIsOpen(false)}  //click the nev items and close nav menu
      >
        <Text
        textStyle="StyledNav"
        >
          {element.name === "LOGIN" && availableToken
                  ? `Hi ${lname}`
                  : element.name}
          </Text>
      </HashLink>
      )
      })}
    </>
  );
}

export default NavItem;


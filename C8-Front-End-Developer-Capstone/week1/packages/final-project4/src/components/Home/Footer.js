import { VStack, Box, Image, Text,  Stack, useBreakpointValue, Divider, Button } from "@chakra-ui/react";
import theme from "../../theme";
import { HashLink } from "react-router-hash-link";
import { useUserRotate } from "../provider/JwtTokenRotate";
const Footer = () => {
    const contact = [{
        th: "Doormat Navigation",
        td: [{
            name: "Home",
            href: "/#top"
          },
          {
            name: "About",
            href: "/#about"
          },
          {
            name: "Menu",
            href: "/#menu"
          },
          {
            name: "Reservations",
            href: "/reservation"
          },
          {
            name: "Order Online",
            href: "/order"
          },
          {
            name: "Login",
            href: "/login"
          }]
    }, {
        th: "Contact",
        td: [{
            name: `Little Lemon
                    331 E Chicago
                    LaSalle Street Chicago,
                    Illinois 60602
                    USA`,
            href: "https://www.google.com/maps/search/Little+Lemon+331+E+Chicago+LaSalle+Street+Chicago,+Illinois+60602+USA/@41.8859606,-87.6360187,15z/data=!3m1!4b1?entry=ttu"
        }, {
            name: "Phone: +55 11 9999-9999",
            href: "tel:+551199999999"
        }, {
            name: "Email: mailto:contact@littlelemon.com",
            href: "mailto:contact@littlelemon.com"
        }]
    }, {
        th: "Social Media Links",
        td: [{
            name: "Facebook",
            href: "https://www.facebook.com/littlelemon"
        }, {
            name: "Twitter",
            href: "https://twitter.com/littlelemon"
        }, {
            name: "Instagram",
            href: "https://www.instagram.com/littlelemon"
        }]
    }];

    const isLargerThanLG = useBreakpointValue({ base: false, lg: true });
    const {availableToken}=useUserRotate()
    return (
        <>
            <Stack marginTop="2em" height="auto" justifyContent="space-between" direction={{base:"column",xl:"row"}} width="100%">
            {isLargerThanLG && <Image src="/images/restaurant.webp" width="30%" height="auto" />}
                {contact.map((i) => (
                    <VStack height="100%" width="auto" alignItems={{base:"center",xl:"start"}}>
                        <Box textStyle="CardTitle">{i.th}</Box>
                        {i.td.map((j) => {
                            if(availableToken && j.name==="Login"){
                                return(
                                <Box onClick={
                                    ()=>{localStorage.setItem("token","")
                                         window.location.href = "./"}
                                }>
                                <Text whiteSpace="pre-line" textStyle="CardText" width="100%">Log out</Text>

                                </Box>
                                )
                            }else {
                                return(
                            <HashLink to={j.href}>
                                <Text whiteSpace="pre-line" textStyle="CardText" width="100%">{j.name}</Text>
                            </HashLink>
                                )
                            }
                        })}
                        <Divider borderColor="#e5e5e5" size="lg" borderWidth="1px"/>
                    </VStack>
                ))}
            </Stack>
        </>
    );
};

export default Footer;

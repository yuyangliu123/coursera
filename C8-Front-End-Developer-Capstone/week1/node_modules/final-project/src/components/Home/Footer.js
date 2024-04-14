import { VStack, HStack, Box, Image, Text, Link } from "@chakra-ui/react";
import About from "./About";

const Footer = () => {
    const contact = [{
        th: "Doormat Navigation",
        td: [{
            name:"Home",
            link:"/"
        },{
            name:"About",
            link:"about"
        },{
            name:"Menu",
            link:"menu"
        },{
            name:"Reservations",
            link:"reservations"
        },{
            name:"Order Online",
            link:"order"
        },{
            name:"Login",
            link:"login"
        }]
    }, {
        th: "Contact",
        td: [{
            name: `Little Lemon
                    331 E Chicago
                    LaSalle Street Chicago,
                    Illinois 60602
                    USA`,
            link: "https://www.google.com/maps/search/Little+Lemon+331+E+Chicago+LaSalle+Street+Chicago,+Illinois+60602+USA/@41.8859606,-87.6360187,15z/data=!3m1!4b1?entry=ttu"
        }, {
            name: "Phone: +55 11 9999-9999",
            link: "tel:+551199999999"
        }, {
            name: "Email: mailto:contact@littlelemon.com",
            link: "mailto:contact@littlelemon.com"
        }]
    }, {
        th: "Social Media Links",
        td: [{
            name: "Facebook",
            link: "https://www.facebook.com/littlelemon"
        }, {
            name: "Twitter",
            link: "https://twitter.com/littlelemon"
        }, {
            name: "Instagram",
            link: "https://www.instagram.com/littlelemon"
        }]
    }];

    return (
        <>
            <HStack marginTop="2em" height="15em" justifyContent="space-between">
                <Image src="./images/restaurant.jpg" width="30%" height="auto" />
                {contact.map((i) => (
                    <VStack height="100%" alignItems="start">
                        <Box textStyle="CardTitle">{i.th}</Box>
                        {i.td.map((j) => (
                            <Link href={j.link} target="_blank">
                                <Text whiteSpace="pre-line" textStyle="CardText">{j.name}</Text>
                            </Link>
                        ))}
                    </VStack>
                ))}
            </HStack>
        </>
    );
};

export default Footer;

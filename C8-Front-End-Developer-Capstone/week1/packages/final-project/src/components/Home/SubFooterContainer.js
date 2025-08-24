import { VStack, Box, Image, Text, Stack, useBreakpointValue, Divider, Button, HStack } from "@chakra-ui/react";
import theme from "../../theme";
import { HashLink } from "react-router-hash-link";
import { useUserRotate } from "../provider/JwtTokenRotate";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import useClickOutside from "../provider/useClickOutside";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import contact from "./config/footerConfig";
import SubFooter from "./SubFooter";
const SubFooterContainer = () => {
    // const contact = [
    //     {
    //         th: "Contact",
    //         td: [{
    //             name: `Little Lemon
    //                 331 E Chicago
    //                 LaSalle Street Chicago,
    //                 Illinois 60602
    //                 USA`,
    //             href: "https://www.google.com/maps/search/Little+Lemon+331+E+Chicago+LaSalle+Street+Chicago,+Illinois+60602+USA/@41.8859606,-87.6360187,15z/data=!3m1!4b1?entry=ttu"
    //         }, {
    //             name: "Phone: +55 11 9999-9999",
    //             href: "tel:+551199999999"
    //         }, {
    //             name: "Email: contact@littlelemon.com",
    //             href: "mailto:contact@littlelemon.com"
    //         }]
    //     }, {
    //         th: "Social Media Links",
    //         td: [{
    //             name: "Facebook",
    //             href: "https://www.facebook.com/littlelemon"
    //         }, {
    //             name: "Twitter",
    //             href: "https://twitter.com/littlelemon"
    //         }, {
    //             name: "Instagram",
    //             href: "https://www.instagram.com/littlelemon"
    //         }]
    //     }];

    const [showFooter, setShowFooter] = useState(false);
    // const [sectionVisibility, setSectionVisibility] = useState({});
    const footerRef = useRef();
    useClickOutside([footerRef], () => {
        setShowFooter(false)
    })
    // const toggleSection = (sectionId) => {
    //     setSectionVisibility(prev => ({
    //         ...prev,
    //         [sectionId]: !prev[sectionId]
    //     }));
    // };
    return (
        <>
            <Box position="relative"
                ref={footerRef}
            >
                <Button onClick={() => setShowFooter(!showFooter)} backgroundColor="#FFFFFF"><HamburgerIcon /></Button>
                <SubFooter showFooter={showFooter}/>
            </Box >
        </>
    );
};

export default SubFooterContainer;

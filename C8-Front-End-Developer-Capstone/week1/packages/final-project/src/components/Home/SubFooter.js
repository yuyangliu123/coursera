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
import navConfig from "../Nav/config/navConfig";
const SubFooter = ({ showFooter }) => {
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
    const [sectionVisibility, setSectionVisibility] = useState({});
    // const footerRef = useRef();
    // useClickOutside([footerRef], () => {
    //     setShowFooter(false)
    // })
    const toggleSection = (sectionId) => {
        setSectionVisibility(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };
    return (
        ///////////////////////////////////////////////////////// add subfooter to mobilenav
        <>
            <Stack
                position={{ [navConfig.showNavSize]: "absolute", base: "" }}
                display={{ [navConfig.showNavSize]: (showFooter ? "block" : "none"), base: "block" }}
                border={{[navConfig.showNavSize]:"1px solid #ccc",base:"none"}}
                backgroundColor="#FFFFFF"
                zIndex="10"
                // marginTop="2em"
                height="auto"
                justifyContent="space-between"
                direction={{ base: "column", xl: "row" }}
                width={{[navConfig.showNavSize]:"250px",base:"fit-content"}}
                right="0"
            >
                <Box
                    margin="0.5em 0.5em 0 0.5em"
                >
                    {contact.map((section, index) => (
                        <VStack key={index}
                            height="100%"
                            width="auto"
                            alignItems={{ base: "center", xl: "start" }}
                        >
                            <HStack
                                width="100%"
                                justifyContent="space-between"
                                onClick={() => toggleSection(index)}
                            >
                                <Box textStyle={{ [navConfig.showNavSize]: "CardTitle", base: "StyledNav" }}>{section.th}</Box>
                                <Box>
                                    {sectionVisibility[index] ?
                                        <FontAwesomeIcon icon={faChevronDown} /> :
                                        <FontAwesomeIcon icon={faChevronUp} />
                                    }
                                </Box>
                            </HStack>
                            <Box width="100%">
                                {section.td.map((item, itemIndex) => {
                                    return (
                                        <Box key={itemIndex}
                                            display={sectionVisibility[index] ? "block" : "none"}
                                            margin="1vh 0"
                                        >
                                            <HashLink to={item.href} target="_blank">
                                                <Text
                                                    whiteSpace="pre-line"
                                                    textStyle={{ [navConfig.showNavSize]: "CardText", base: "StyledNav" }}
                                                    width="100%"
                                                    fontSize={{ [navConfig.showNavSize]: "", base: "1rem" }}
                                                >
                                                    {item.name}
                                                </Text>
                                            </HashLink>
                                            <Divider borderColor="#e5e5e5" size="sm" borderWidth="1px" />
                                        </Box>
                                    )
                                    // }
                                }
                                )}
                            </Box>
                            <Divider borderColor="#e5e5e5" size="lg" borderWidth="1px" />
                        </VStack>
                    ))}
                </Box>
            </Stack>
        </>
    );
};

export default SubFooter;

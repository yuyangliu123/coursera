import { Box, Image} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
import theme from "../../../theme.js"
import navConfig from "../../Nav/config/navConfig.js";
const Card = () => {
    const props = [{
        image: "/images/greek salad.webp",
        name: "Greek salad",
        price: "12.99",
        description: "The famous greek salad of crispy lettuce peppers, olives and out Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons."
    }, {
        image: "/images/bruchetta.svg",
        name: "Bruchetta",
        price: "5.99",
        description: "Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil."
    },{
        image: "/images/lemon dessert.webp",
        name: "Lemon Dessert",
        price: "5.00",
        description: "Our This comes straight from grandma’s recipe book, every last ingredient has been sourced and is as authentic as can be imagined. is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil."
    }];

    return (
        props.map((i, index) => (
            <Box w="100%"
            height="auto"
            padding={{base:"0 0 30px 0",[navConfig.showNavSize]:""}}
            backgroundColor="#EDEFEE"
            position="relative"
            borderRadius= "16% 16% 0  0"
            marginRight={index !== props.length - 1 ? "3%" : "0"}
            >
                <Image
                    src={i.image}
                    alt={i.name}
                    width="100%"
                    height= {{base:"8em",xl:"10em"}}
                    objectFit= "cover"
                    borderRadius= "16% 16% 0  0"
                    loading="lazy"
                />
                <Box margin="5%">
                    <Box display="flex" justifyContent="space-between" paddingBottom="1em">
                        <Box textStyle="CardTitle">{i.name}</Box>
                        <Box textStyle="HighlightText" marginRight="10%">
                                $ {i.price}
                        </Box>
                    </Box>
                    <Box textStyle="CardText">
                        {i.description}
                    </Box>
                    <Box position="absolute" bottom={{base:"1%",[navConfig.showNavSize]:"1.5em"}} paddingTop="3em">
                        Order a delivery <FontAwesomeIcon icon={faCartShopping} />
                    </Box>
                </Box>
            </Box>
        ))
    );
};

export default Card;

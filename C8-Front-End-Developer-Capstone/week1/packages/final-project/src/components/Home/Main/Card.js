import { Box, Badge,Image} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
import theme from "../../../theme.js"
const Card = () => {
    const props = [{
        image: "./images/greek salad.jpg",
        name: "Greek salad",
        price: "12.99",
        description: "The famous greek salad of crispy lettuce peppers, olives and out Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons."
    }, {
        image: "./images/bruchetta.svg",
        name: "Bruchetta",
        price: "5.99",
        description: "Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil."
    },{
        image: "./images/lemon dessert.jpg",
        name: "Lemon Dessert",
        price: "5.00",
        description: "Our This comes straight from grandma’s recipe book, every last ingredient has been sourced and is as authentic as can be imagined. is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil."
    }];

    return (
        props.map((i, index) => (
            <Box w="33%"
            height="100%"
            backgroundColor="#EDEFEE"
            position="relative"
            borderRadius= "16% 16% 0  0"
            marginRight={index !== props.length - 1 ? "3em" : "0"}
            >
                <Image src={i.image} alt={i.name} width="100%" height= "20em" objectFit= "cover" borderRadius= "16% 16% 0  0"></Image>
                <Box margin="5%">
                    <Box display="flex" justifyContent="space-between" paddingBottom="1em">
                        <Box textStyle="CardTitle">{i.name}</Box>
                        <Box textStyle="HighlightText" marginRight="10%">
                                $ {i.price}
                        </Box>
                    </Box>
                    <Box>
                        {i.description}
                    </Box>
                    <Box position="absolute" bottom="2.5em">
                        Order a delivery <FontAwesomeIcon icon={faCartShopping} />
                    </Box>
                </Box>
            </Box>
        ))
    );
};

export default Card;

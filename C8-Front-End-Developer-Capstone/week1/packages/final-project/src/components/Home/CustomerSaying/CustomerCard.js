import { Box, Image, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import styled from "styled-components"

const CustomerCard = () => {
    const [customers, setCustomers] = useState([]);
    const [shuffledRatings, setShuffledRatings] = useState([]);

    useEffect(() => {
        fetch("https://randomuser.me/api/?results=5")
            .then(response => response.json())
            .then(data => setCustomers(data.results));

        const rating=[{
            score:"★★★☆☆",
            comment:"Little Lemon is a decent family-owned Mediterranean restaurant. The traditional recipes served with a modern twist were interesting, but there’s room for improvement."
        },{
            score:"★★★★☆",
            comment:"I had a great time at Little Lemon. Their take on traditional Mediterranean recipes is refreshing. I’m looking forward to my next visit."
        },{
            score:"★★★★☆",
            comment:"The food at Little Lemon was delightful, and the modern twist on traditional recipes was a pleasant surprise. The service was good, and the atmosphere was warm and welcoming."
        },{
            score:"★★★★★",
            comment:"Little Lemon exceeded my expectations. The fusion of traditional recipes and modern twists was fantastic, and the service was excellent. I highly recommend this place!"
        },{
            score:"★★★★★",
            comment:"Little Lemon"
        }];

        // Shuffle the ratings
        for (let i = rating.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rating[i], rating[j]] = [rating[j], rating[i]];
        }

        setShuffledRatings(rating);
    }, []);

    if (customers.length === 0 || shuffledRatings.length === 0) {
        return <div>Loading...</div>;
    }


    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
      };

      const StyledDiv=styled.div`
      .slick-next:before, .slick-prev:before{
          color: blue;
      }
  `
  

    return (
        <StyledDiv>
        <Box backgroundColor="#EDEFEE" height="500px">
        <Box margin="0  15%" padding="3em 0 0 0">
        <Box  as="h1" noOfLines={1} textStyle="StyledH1" color="black">
                  What Our Customer saying!
        </Box>
        <Slider {...settings}>
            {customers.map((customer, index) => (
            <Box height="100%"  margin="1em" display="flex" flexDirection="column">
                <Box margin="1em">
                    <Text textStyle="CardTitle">Rating: {shuffledRatings[index].score}</Text>
                </Box>
                <Box display="flex" justifyContent="space-around">
                    <Image
                    src={customer.picture.large}
                    alt={customer.name.first}
                    width="auto"
                    height="auto"></Image>
                    <Box
                    textStyle="CardTitle"
                    alignContent="center"
                    marginRight="1em">
                        {customer.name.first}
                    </Box>
                </Box>
                <Box margin="5%">
                    <Tooltip label={shuffledRatings[index].comment} placement="top" hasArrow>
                        <Text
                        noOfLines={4}
                        textStyle="CardText">
                            {shuffledRatings[index].comment}
                        </Text>
                    </Tooltip>
                </Box>
            </Box>
        ))}
        </Slider>
        </Box>
        </Box>
        </StyledDiv>
    );
};

export default CustomerCard;

import { Box, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import LazyLoadImage from "../provider/LazyLoadImage.js";
import { HashLink } from "react-router-hash-link";

const ProductItem = ({ product }) => {
  return (
    <HashLink to={`/order2/${product.strMeal}/${product.idMeal}`} width="100%">
      <VStack
        key={product.idMeal}
        _hover={{ img: { opacity: 0.7 }, p: { color: "#da1a32" } }}
        width="100%"
      >
        <LazyLoadImage
          src={product.strMealThumb}
          alt={product.strMeal}
          width="100%"
          imgWidth="250"
          auto="webp"
          height="250px"
          objectFit="cover"
        />
        <Box padding="0.5rem 1rem .75rem">
          <Text
            textStyle="StyledText"
            color="#333333"
            align="center"
            marginBottom="0.625rem"
            fontSize={{ xxl: "20px", base: "18px" }}
          >
            {product.strMeal}
          </Text>
          <Box>
            <Text
              textStyle="StyledText"
              color="#333333"
              align="end"
              marginRight="1rem"
              fontSize={{ xxl: "20px", base: "18px" }}
            >
              Price: ${product.price}
            </Text>
          </Box>
        </Box>
      </VStack>
    </HashLink>
  );
};

export default ProductItem;

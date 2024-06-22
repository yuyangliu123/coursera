import { gql, useQuery, useMutation } from '@apollo/client';
import { Box, Button, HStack, Image, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useUserRotate } from '../provider/JwtTokenRotate';
import { useState, useEffect, useContext } from 'react';
import { MealContext } from '../provider/MealContext';
import { SmallCloseIcon } from "@chakra-ui/icons";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
const LIKELIST_QUERY = gql`
query Likeitemlist($email: String) {
  likeitemlist(email: $email) {
    likeItem {
      idMeal
      strMeal
      baseAmount
      strMealThumb
    }
  }
}
`;

const UPDATE_QUERY = gql`
mutation Updatelikelist($email: String, $idMeal: String, $baseAmount: Float, $state: String) {
  updatelikelist(email: $email, idMeal: $idMeal, baseAmount:$baseAmount, state: $state) {
    likeItem {
      strMeal
      idMeal
      baseAmount
      strMealThumb
    }
  }
}
`;

const LikeItem = () => {
  const { email } = useUserRotate();
  const { cartItem, setCartItem } = useContext(MealContext);
  const { data: cart, loading, error, refetch: fetchlike } = useQuery(LIKELIST_QUERY, {
    variables: { email },
    fetchPolicy: 'network-only',
  });
  const [likeupdate] = useMutation(UPDATE_QUERY, {
    //use onCompleted to prevent Race Condition
    onCompleted: () => {
      fetchlike()
    }
  })

  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    if (!loading && !error && cart && cart.likeitemlist && cart.likeitemlist.length > 0) {
      setCartData(cart.likeitemlist[0]);
    }
  }, [loading, error, cart]);

  if (loading) {
    return <Box>Loading...</Box>;
  } else if (error) {
    return <Box>Error Occurred</Box>;
  }

  if (!cartData) {
    return <Box>No data</Box>;
  }

  return (
    <Stack direction={{ xxl: "row", base: "column" }} width="100%" alignItems="flex-start" spacing={6}>
      <Box width="100%" display="grid" gridTemplateColumns={{ xl: "repeat(4, 1fr)", lg: "repeat(3, 1fr)", md: "repeat(2, 1fr)", base: "repeat(1, 1fr)" }} gap="10px" height="fit-content">
        {cartData.likeItem.map((item, index) => (
          <VStack
            key={item.idMeal}
            width="100%"
            border=".063rem solid #e4e4e4"
            paddingBottom="1rem"
            marginBottom="3.125rem"
            height="auto"
            _hover={{ img: { opacity: 0.7 }, p: { color: "#da1a32" } }}
          >
            <Link
              to={`/order2/${item.strMeal}`}
            >
              <Image
                src={item.strMealThumb}
                alt={item.strMeal}
                width="auto"
                height="auto"
                objectFit="cover" />
              <Box padding="1.25rem 1rem .75rem">
                <Text
                  textStyle="StyledText"
                  color="#333333"
                  align="center"
                  marginBottom="0.625rem"
                >
                  {item.strMeal}
                </Text>
                <Box>
                  <Text
                    textStyle="StyledText"
                    color="#333333"
                    align="end"
                    marginRight="1rem"
                  >
                    Price: ${item.baseAmount}
                  </Text>
                </Box>
              </Box>
            </Link>
            <HStack justifyContent="right">

              <Button
                backgroundColor="#e5e5e5"
                size="md"
                //use async/await to prevent Race Condition
                onClick={async () => {
                  await likeupdate({ variables: { email: email, idMeal: item.idMeal, baseAmount: item.baseAmount, state: "addtocart" } });
                  await setCartItem(cartItem + 1)
                }}
              >
                <HStack justifyContent="space-between" width="100%">
                  <Image src="/images/Basket.svg" height="30px" />
                  <Text>Add to cart</Text>
                </HStack>
              </Button>
              <Button
                backgroundColor="#e5e5e5"
                size="md"
                onClick={async () => {
                  likeupdate({ variables: { email: email, idMeal: item.idMeal, state: "delete" } });
                }}
              >
                <HStack justifyContent="space-between" width="100%">
                  <FontAwesomeIcon icon={faTrashCan} />
                  <Text>Remove</Text>
                </HStack>
              </Button>
            </HStack>
          </VStack>
        ))}
      </Box>
    </Stack>
  );
};

export default LikeItem;

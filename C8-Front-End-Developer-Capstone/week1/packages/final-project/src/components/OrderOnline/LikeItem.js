import { gql, useQuery, useMutation } from '@apollo/client';
import { Box, Button, HStack, Image, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useUserRotate } from '../provider/JwtTokenRotate';
import { useState, useEffect, useContext, useMemo } from 'react';
import { MealContext } from '../provider/MealContext';
import { SmallCloseIcon } from "@chakra-ui/icons";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { openDB } from 'idb';
import LazyLoadImage from '../provider/LazyLoadImage';
import useBreakpoint from '../provider/useBreakpoint';


const UPDATE_QUERY = gql`
mutation Updatelikelist($identifier: String!, $isEmail: Boolean, $idMeal: String, $baseAmount: Float, $state: String) {
  updatelikelist(identifier: $identifier,isEmail:$isEmail, idMeal: $idMeal, baseAmount:$baseAmount, state: $state) {
    likeItem {
      idMeal
    }
  }
}
`;

// init IndexedDB
const initDB = async () => {
  const db = await openDB('meal-database', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart', { keyPath: 'idMeal' });
      }
    },
  });
  return db;
};

const updateDB = async (newData) => {
  const db = await initDB();
  const tx = db.transaction('cart', 'readwrite');
  const store = tx.objectStore('cart');
  await store.put(newData);
  await tx.done;
};

const LikeItem = ({ initialData, loading, error, fetchlike, imageWidth }) => {
  const { identifier, isEmail } = useUserRotate();
  const { cartItem, setCartItem } = useContext(MealContext);
  const [cartData, setCartData] = useState(initialData);
  // const { data: cart, loading, error, refetch: fetchlike } = useQuery(LIKELIST_QUERY, {
  //   variables: { email },
  //   fetchPolicy: 'network-only',
  //   skip: !email || !isEmail,
  //   //load cart item when login
  //   //onCompleted broken, only work when first load
  //   onCompleted: (data) => {
  //     setCartData(data.likeitemlist[0]);
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   }
  // });
  const [likeupdate] = useMutation(UPDATE_QUERY, {
    //use onCompleted to prevent Race Condition
    //use then() to set cartData
    onCompleted: () => {
      fetchlike().then((data) => {
        setCartData(data.data.likeitemlist);
      })
    }
  })

  useEffect(() => {
    console.log(cartData, "cartdata");

  }, [cartData])

  // useEffect(() => {
  //   if (initialData) {
  //     setCartData(initialData);
  //   }
  // }, [initialData]);

  const updateLikeState = async ({ state, baseAmount, idMeal }) => {
    const db = await initDB();
    let existingCart = await db.get('cart', 'cartData');
    if (existingCart) {
      if (state === "addtocart") {
        const item = existingCart.likeItem.find(item => item.idMeal === idMeal);
        console.log({ "item": item, "a": item.baseAmount })
        const alreadyInCart = existingCart.data.find(item => item.idMeal === idMeal);
        const numMeal = { numMeal: 1 }
        const cartAmount = { cartAmount: item.baseAmount }
        const item1 = Object.assign(item, numMeal, cartAmount)
        if (item1) {
          if (!alreadyInCart) {
            existingCart.data.push(item1);
          } else if (alreadyInCart) {
            alreadyInCart.numMeal += 1
          }
          existingCart.totalItem += 1;
          existingCart.totalAmount += baseAmount;
          existingCart.totalAmount = Number(existingCart.totalAmount.toFixed(2))
          existingCart.likeItem = existingCart.likeItem.filter(item => item.idMeal !== idMeal);
        }
      } else if (state === "delete") {
        existingCart.likeItem = existingCart.likeItem.filter(item => item.idMeal !== idMeal);
      }
      await updateDB(Object.assign(existingCart, { idMeal: 'cartData' }));
    }
  }






  //load cart item when not login
  // useEffect(() => {
  //   if (!isEmail) {
  //     const loadCart = async () => {
  //       const db = await initDB();
  //       let existingCart = await db.get('cart', 'cartData');
  //       if (existingCart) {
  //         setCartData(existingCart)
  //       }
  //     };
  //     loadCart();
  //   }
  // }, [isEmail, cartData]);


  if (loading) {
    return <Box>Loading...</Box>;
  } else if (error) {
    return <Box>Error Occurred</Box>;
  }

  if (!cartData || cartData.length === 0) {
    return <Box width="100%"><Box textStyle="StyledH2" color="#000000" margin="0 auto" width="fit-content">No Like Item In Your List</Box></Box>
  }

  // const iw=useMemo(()=>({
  //   "width":imageWidth
  // }),[imageWidth])
  return (
    <Stack direction={{ xxl: "row", base: "column" }} width="100%" alignItems="flex-start" spacing={6}>
      <Box width="100%" display="grid" gridTemplateColumns={{ xl: "repeat(4, 1fr)", lg: "repeat(3, 1fr)", md: "repeat(2, 1fr)", base: "repeat(1, 1fr)" }} gap="10px" height="fit-content">
        {cartData?.map((item, index) => (
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
              {/* <Image
                src={item.strMealThumb}
                alt={item.strMeal}
                width="auto"
                height="auto"
                objectFit="cover" /> */}
              <LazyLoadImage
                src={item.strMealThumb}
                alt={item.strMeal}
                width="auto"
                imgWidth={imageWidth}
                auto="webp"
                height="auto"
                objectFit="cover"
              />
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
                  // if (isEmail) {
                  //   await likeupdate({ variables: { email: email, idMeal: item.idMeal, baseAmount: item.baseAmount, state: "addtocart" } });
                  // } else {
                  //   updateLikeState({ idMeal: item.idMeal, baseAmount: item.baseAmount, state: "addtocart" })
                  // }

                  await likeupdate({ variables: { identifier: identifier, isEmail: isEmail, idMeal: item.idMeal, baseAmount: item.baseAmount, state: "addtocart" } });

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
                  // if (isEmail) {
                  //   likeupdate({ variables: { email: email, idMeal: item.idMeal, state: "delete" } });
                  // } else {
                  //   updateLikeState({ idMeal: item.idMeal, state: "delete" })
                  // }
                  await likeupdate({ variables: { identifier: identifier, isEmail: isEmail, idMeal: item.idMeal, baseAmount: item.baseAmount, state: "delete" } });

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

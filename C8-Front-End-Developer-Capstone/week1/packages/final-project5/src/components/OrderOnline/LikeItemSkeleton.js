
import { Box, Button, Grid, GridItem, HStack, Image, Skeleton, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';

const LikeItemSkeleton = () => {

  
  return (
    <Stack direction={{ xxl: "row", base: "column" }} width="100%" alignItems="flex-start" spacing={6}>
  <Grid width="100%" templateColumns={{ xl: "repeat(4, 1fr)", lg: "repeat(3, 1fr)", md: "repeat(2, 1fr)", base: "repeat(1, 1fr)" }} gap="10px" templateRows="repeat(1,1fr)">
    {
      [...Array(4)].map((_, index) => (
        <GridItem margin="0 5px 30px 0" border="1px solid #e4e4e4" key={index}>
          <Skeleton height="250px" width="100%" />
          <Box padding="1.25rem 1rem .75rem">
            <Skeleton height={{ xxl: "20px", base: "18px" }} width="100%" marginBottom="0.625rem" />
            <Skeleton height={{ xxl: "20px", base: "18px" }} width="100%" marginBottom="0.625rem" />
            <HStack gap="1rem" justifyContent="space-between">
            <Skeleton height={{ xxl: "40px", base: "18px" }} width="45%"/>
            <Skeleton height={{ xxl: "40px", base: "18px" }} width="45%"/>
            </HStack>
          </Box>
        </GridItem>
      ))
    }
  </Grid>
</Stack>




    // <Stack direction={{ xxl: "row", base: "column" }} width="100%" alignItems="flex-start" spacing={6}>
    //   <Box width="100%" display="grid" gridTemplateColumns={{ xl: "repeat(4, 1fr)", lg: "repeat(3, 1fr)", md: "repeat(2, 1fr)", base: "repeat(1, 1fr)" }} gap="10px" height="fit-content">
    //     {cartData.likeItem.map((item, index) => (
    //       <VStack
    //         key={item.idMeal}
    //         width="100%"
    //         border=".063rem solid #e4e4e4"
    //         paddingBottom="1rem"
    //         marginBottom="3.125rem"
    //         height="auto"
    //         _hover={{ img: { opacity: 0.7 }, p: { color: "#da1a32" } }}
    //       >
    //         <Link
    //           to={`/order2/${item.strMeal}`}
    //         >
    //           <Image
    //             src={item.strMealThumb}
    //             alt={item.strMeal}
    //             width="auto"
    //             height="auto"
    //             objectFit="cover" />
    //           <Box padding="1.25rem 1rem .75rem">
    //             <Text
    //               textStyle="StyledText"
    //               color="#333333"
    //               align="center"
    //               marginBottom="0.625rem"
    //             >
    //               {item.strMeal}
    //             </Text>
    //             <Box>
    //               <Text
    //                 textStyle="StyledText"
    //                 color="#333333"
    //                 align="end"
    //                 marginRight="1rem"
    //               >
    //                 Price: ${item.baseAmount}
    //               </Text>
    //             </Box>
    //           </Box>
    //         </Link>
    //         <HStack justifyContent="right">

    //           <Button
    //             backgroundColor="#e5e5e5"
    //             size="md"
    //             //use async/await to prevent Race Condition
    //             onClick={async () => {
    //               if (isUser) {
    //                 await likeupdate({ variables: { email: email, idMeal: item.idMeal, baseAmount: item.baseAmount, state: "addtocart" } });
    //               } else {
    //                 updateLikeState({ idMeal: item.idMeal, baseAmount: item.baseAmount, state: "addtocart" })
    //               }
    //               await setCartItem(cartItem + 1)
    //             }}
    //           >
    //             <HStack justifyContent="space-between" width="100%">
    //               <Image src="/images/Basket.svg" height="30px" />
    //               <Text>Add to cart</Text>
    //             </HStack>
    //           </Button>
    //           <Button
    //             backgroundColor="#e5e5e5"
    //             size="md"
    //             onClick={async () => {
    //               if (isUser) {
    //                 likeupdate({ variables: { email: email, idMeal: item.idMeal, state: "delete" } });
    //               } else {
    //                 updateLikeState({ idMeal: item.idMeal, state: "delete" })
    //               }
    //             }}
    //           >
    //             <HStack justifyContent="space-between" width="100%">
    //               <FontAwesomeIcon icon={faTrashCan} />
    //               <Text>Remove</Text>
    //             </HStack>
    //           </Button>
    //         </HStack>
    //       </VStack>
    //     ))}
    //   </Box>
    // </Stack>
  );
};

export default LikeItemSkeleton;

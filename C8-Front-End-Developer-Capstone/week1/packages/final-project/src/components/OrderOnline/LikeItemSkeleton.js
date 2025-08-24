
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
                  <Skeleton height={{ xxl: "40px", base: "18px" }} width="45%" />
                  <Skeleton height={{ xxl: "40px", base: "18px" }} width="45%" />
                </HStack>
              </Box>
            </GridItem>
          ))
        }
      </Grid>
    </Stack>




  );
};

export default LikeItemSkeleton;

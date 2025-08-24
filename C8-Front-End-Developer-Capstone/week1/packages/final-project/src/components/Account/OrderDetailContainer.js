import { Box, Button, Checkbox, HStack, Image, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { Suspense, useEffect, useMemo, useState } from "react"
import { gql, useQuery, useMutation } from '@apollo/client';
import { useUserRotate } from "../provider/JwtTokenRotate";
import LazyLoadImage from '../provider/LazyLoadImage';
import { useParams } from "react-router-dom";
import OrderDetail from './OrderDetail';
import OrderDetailSkeleton from './OrderDetailSkeleton';
const ORDERDETAIL_QUERY = gql`
query Orderdetail($identifier: String, $uuid: String) {
  orderdetail(identifier: $identifier, uuid: $uuid) {
      orderAmount
      orderItem
      payment
      createdAt
      orderNumber
      orderUuid
      itemInfo {
        strMeal
        numMeal
        baseAmount
        cartAmount
        strMealThumb
      }
    }
}
`;


const OrderDetailContainer = () => {
  const [myOrder, setMyOrder] = useState([])
  const { identifier, isEmail } = useUserRotate();
  const { uuid } = useParams();
  const decodeduuid = decodeURIComponent(uuid);
  const [initialData, setInitialData] = useState(null)
  const [isDelayed, setIsDelayed] = useState(true);
  const { data, loading, error, refetch: fetchMyorder } = useQuery(ORDERDETAIL_QUERY, {
    variables: { identifier, uuid: decodeduuid },
    fetchPolicy: 'network-only',
    skip: !identifier || !isEmail || !uuid,
    //load cart item when login
    //onCompleted broken, only work when first load
    onCompleted: (data) => {
      setTimeout(() => {
        setInitialData(data.orderdetail[0])

        setIsDelayed(false)
      }, 500);
    },
    onError: (error) => {
      console.log(error);
      setIsDelayed(false)
    }
  });

  console.log(initialData, "data");
  if (isDelayed || loading || !initialData) {
    return <OrderDetailSkeleton />
  }
  if (initialData.length === 0) {
    return (
      <>
        <Box>
          No Order Yet
        </Box>
      </>
    )
  }
  if (error) {
    return (
      <Box>
        something went wrong
      </Box>
    )
  }


  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetail initialData={data.orderdetail[0]} />
    </Suspense>
  )
}
export default OrderDetailContainer
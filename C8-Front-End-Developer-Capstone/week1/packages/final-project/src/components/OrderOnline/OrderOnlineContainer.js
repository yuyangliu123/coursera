
import { lazy, Suspense } from "react"
import {
  VStack,
  Box,
  WrapItem,
  Button, Stack
} from "@chakra-ui/react"
const OrderOnline2 =lazy(() => new Promise(resolve => {
  setTimeout(() => resolve(import("./OrderOnline2.js")), 2000); // 模擬1秒延遲
}));
import OrderOnlineSkeleton from "./OrderOnlineSkeleton.js"
//Before loading Main contents, load a skeleton first
const OrderOnlineContainer = () => {
  return (
    <Suspense fallback={
      <VStack w="100%" align="start" padding="10vh 0" id="menu">
        <Box position="relative" width="100%">
          <OrderOnlineSkeleton />
        </Box>
      </VStack>
    }>
      <VStack w="100%" align="start" padding="10vh 0" id="menu">
        <Box position="relative" width="100%">
          <OrderOnline2 />
          {/* <OrderOnlineSkeleton /> */}
        </Box>
      </VStack>
    </Suspense>
  )
}

export default OrderOnlineContainer
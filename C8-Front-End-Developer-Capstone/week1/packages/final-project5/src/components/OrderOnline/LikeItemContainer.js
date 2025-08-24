
import { lazy, Suspense } from "react"
import {
  VStack,
  Box,
  WrapItem,
  Button, Stack
} from "@chakra-ui/react"
const OrderOnline2 = lazy(() => import("./OrderOnline2.js"))
import OrderOnlineSkeleton from "./OrderOnlineSkeleton.js"
import LikeItemSkeleton from "./LikeItemSkeleton.js"
const LikeItem = lazy(() => new Promise(resolve => {
  setTimeout(() => resolve(import("./LikeItem.js")), 800); // 模擬1秒延遲
}));
//Before loading Main contents, load a skeleton first
const LikeItemContainer = () => {
  return (
    <Suspense fallback={
          <LikeItemSkeleton />
    }>
      
          <LikeItem />
    </Suspense>
  )
}

export default LikeItemContainer
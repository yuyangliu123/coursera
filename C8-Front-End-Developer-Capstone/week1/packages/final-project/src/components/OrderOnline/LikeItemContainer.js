// LikeItemContainer.js
import { lazy, Suspense, useState, useEffect, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import LikeItemSkeleton from "./LikeItemSkeleton.js";
import { gql, useQuery } from '@apollo/client';
import { useUserRotate } from '../provider/JwtTokenRotate';
import useBreakpoint from "../provider/useBreakpoint.js";

// 定義 GraphQL 查詢
const LIKELIST_QUERY = gql`
  query Likeitemlist($identifier: String!, $isEmail: Boolean) {
    likeitemlist(identifier: $identifier,isEmail:$isEmail) {
        idMeal
        strMeal
        baseAmount
        strMealThumb
    }
  }
`;

// // 懶加載 LikeItem 組件，但不添加人為延遲
// const LikeItem = lazy(() => new Promise(resolve => {
//   setTimeout(() => resolve(import("./LikeItem.js")), 1000); // 模擬1秒延遲
// }));
const LikeItem = lazy(() => import('./LikeItem'));
const LikeItemContainer = () => {
  const { identifier, isEmail } = useUserRotate();
  // const [likeItemData, setLikeItemData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [imageWidth, setImageWidth] = useState(null)
  const [isDelayed, setIsDelayed] = useState(true);
  // 使用 Apollo Client 獲取數據
  const { data: cart, loading, error, refetch: fetchlike } = useQuery(LIKELIST_QUERY, {
    variables: { identifier, isEmail },
    fetchPolicy: 'network-only',
    skip: !identifier ,
    //load cart item when login
    //onCompleted broken, only work when first load
    onCompleted: (data) => {
      setTimeout(() => {
        setInitialData(data.likeitemlist);
        setIsDelayed(false);
      }, 300);
    },
    onError: (error) => {
      console.log(error);
      setIsDelayed(false);
    }
  });

  const breakpointValue = useBreakpoint(
    {
      xs: 400,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    },
    {
      xxl: 400,
      xl: 400,
      lg: 300,
      md: 300,
      sm: 500,
      xs: 500,
      base: 500
    }
  );
  useEffect(() => {
    if (imageWidth === null) {
      setImageWidth(breakpointValue);
      console.log(breakpointValue, "initial imagewidth");
    }
  }, [breakpointValue, imageWidth]);
  // console.log(imageWidth, "imagewidth",breakpointValue,"breakpointValue");

  // 如果不是登錄用戶，則從 IndexedDB 加載數據
  // useEffect(() => {
  //   if (!isEmail) {
  //     const loadFromIndexedDB = async () => {
  //       try {
  //         const { openDB } = await import('idb');
  //         const db = await openDB('meal-database', 1);
  //         const existingCart = await db.get('cart', 'cartData');
  //         if (existingCart) {
  //           setInitialData(existingCart);
  //         }
  //       } catch (error) {
  //         console.error("Error loading data from IndexedDB:", error);
  //       }
  //     };

  //     loadFromIndexedDB();
  //   }
  // }, [isEmail]);

  if (isDelayed || loading ) {
    return <LikeItemSkeleton />;
  }

  if (error) {
    return (
      <Box>
        something went wrong
      </Box>
    )
  }

  return (
    <Suspense fallback={<LikeItemSkeleton />}>
      {/* 將數據作為 props 傳遞給懶加載的組件 */}
      <LikeItem initialData={initialData} loading={loading} error={error} fetchlike={fetchlike} imageWidth={imageWidth} />
    </Suspense>
  );
};

export default LikeItemContainer;
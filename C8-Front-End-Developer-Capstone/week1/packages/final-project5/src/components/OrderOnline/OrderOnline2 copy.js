import { Box, Button, HStack, Heading, Image, Stack, Text, VStack, getToastPlacement } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import theme from "../../theme.js"
import { useEffect, useMemo, useRef, useState } from "react";
import FoodButton from "./FoodButton.js";
import { Route, Router, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useHandleScroll, WindowElement } from "../provider/window-scroll.js";
import useClickOutside from "../provider/useClickOutside.js";
import useBreakpoint from "../provider/useBreakpoint.js";
import LazyLoadImage from "../provider/LazyLoadImage.js";
const OrderOnline2 = () => {
  // const [infiniteDisplay,setinfibiteDisplay]=useState(true)
  const [isShow, setIsShow] = useState(false)
  const [menu, setMenu] = useState({ category: [], data: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [infiniteScroll, setInfiniteScroll] = useState(true)
  const location = useLocation() //to get current location
  const scrollerRef = useRef(null);
  const sortResultsRef = useRef()
  const [showSortResult, setShowSortResult] = useState(false)

  //infinite scroll
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const query = new URLSearchParams(location.search);
      const category = query.get('category');
      const pageLimit = 20;
      if (category) {
        setInfiniteScroll(false)
      }
      try {
        let response;
        if (!category) {
          response = await fetch(`http://localhost:5000/api/api?page=${page}&limit=${pageLimit}`);
        } else {
          response = await fetch(`http://localhost:5000/api/order?category=${category}`);
        }

        const data = await response.json();
        if (!category) {
          setMenu(prevMenu => ({
            category: page === 1 ? data.category : prevMenu.category,
            data: page === 1 ? data.data : [...prevMenu.data, ...data.data]
          }))
        } else {
          setMenu({
            category: data.category,
            data: data.data
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search, location, page]);

  //set page
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    });

    const sentinel = document.getElementById('sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loading]);





  //windowing
  const itemSize = { "height": 400, "marginBottom": 30, "marginRight": 5, "border": 1 }
  const elements = useMemo(() => {
    if (menu.data.length > 0) {
      return Object.values(menu.data || []).map((value, index) => (
        <Link to={`/order2/${value.strMeal}`} width="100%">
          <VStack
            key={value.idMeal}
            _hover={{ img: { opacity: 0.7 }, p: { color: "#da1a32" } }}
            width="100%"
          >
            <LazyLoadImage
              src={value.strMealThumb}
              alt={value.strMeal}
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
                {value.strMeal}
              </Text>
              <Box>
                <Text
                  textStyle="StyledText"
                  color="#333333"
                  align="end"
                  marginRight="1rem"
                  fontSize={{ xxl: "20px", base: "18px" }}
                >
                  Price: ${value.price}
                </Text>
              </Box>
            </Box>
          </VStack>
        </Link>
      ));
    }
  }, [menu.data]);

  const eachColCounts = useBreakpoint(
    {
      xs: 400,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    },
    {
      xxl: 4,
      xl: 4,
      lg: 4,
      md: 3,
      sm: 2,
      xs: 2,
      base: 1
    });
  const itemHeights = useBreakpoint(
    {
      xs: 400,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    },
    {
      base: 380,
      xs: 380,
      sm: 360,
      md: 360,
      lg: 430,
      xl: 420,
      xxl: 415,
    }
  );
  const itemInfo = useMemo(() => ({
    "invisiblePartHeight": 90,
    "itemHeight": itemHeights,
    "marginRight": 5,
    "marginBottom": 30,
    "itemBorder": "1px solid #e4e4e4",
    "backgroundColor": "#fbdabb4d",
    "initialShowColNum": 3,
    "eachColCount": eachColCounts,
    "preloadingColNum": 1,
    "elements": elements,
  }), [eachColCounts, elements, itemHeights]);

  //get border width
  const borderValue = itemInfo.itemBorder.split(' ').find(value => value.includes('px'));
  const borderWidth = parseInt(borderValue);
  //set scroller height
  const stackMinHeight = (menu.data.length % itemInfo.eachColCount) === 0
    ? Math.floor(menu.data.length / itemInfo.eachColCount) * (itemInfo.itemHeight) + Math.floor(menu.data.length / itemInfo.eachColCount - 1) * (itemInfo.marginBottom + borderWidth * 2) + "px"
    : Math.floor(menu.data.length / itemInfo.eachColCount + 1) * (itemInfo.itemHeight) + Math.floor(menu.data.length / itemInfo.eachColCount) * (itemInfo.marginBottom + borderWidth * 2) + "px";

  const range = useHandleScroll({
    scrollerRef: scrollerRef,
    invisiblePartHeight: itemInfo.invisiblePartHeight,
    itemHeight: itemInfo.itemHeight,
    itemBorder: itemInfo.itemBorder,
    itemMarginBottom: itemInfo.marginBottom,
    initialShowColNum: itemInfo.initialShowColNum,
    eachColCount: itemInfo.eachColCount,
    preloadingColNum: itemInfo.preloadingColNum,
  });
  const handleCategoryClick = (category) => {
    const newUrl = category ? `/order2?category=${category}` : '/order2';
    setPage(1);
    setMenu({ category: [], data: [] });
    window.history.pushState(null, '', newUrl);
    setInfiniteScroll(!category);
  };

  //click outside and hide relative div
  useClickOutside(sortResultsRef, () => {
    setShowSortResult(false)
  })

  if (Object.keys(menu.data).length > 0) {
    return (
      <VStack>
        <Stack minHeight="auto" width="100%" justifyContent="space-between" direction={{ lg: "row", base: "column" }}>
          <Box width={{ lg: "30%", base: "100%" }} backgroundColor="#fbdabb4d" height="fit-content" padding="0 0 3vh 3vh">
            <Box textStyle="StyledNav" fontSize="2em" onClick={() => setIsShow(!isShow)}>
              Ingredient
            </Box>
            <VStack display={isShow ? "flex" : "none"} marginLeft="0">
              {Object.values(menu.category || []).map(value => (
                <FoodButton
                  key={value}
                  category={value}
                  setMenu={setMenu}
                  menu={menu}
                  marginLeft="3vh"
                  onClick={() => handleCategoryClick(value)}
                />
              ))}
            </VStack>
          </Box>
          <Stack width={{ lg: "70%", base: "100%" }}>
            <HStack id="filterContainer" justifyContent="space-between">
              <Box as="h1" textStyle="StyledH1" color="black" id="currentResults">
                Menu page
              </Box>
              <Box>
                <Box
                  id="sortResults"
                  ref={sortResultsRef}
                  onClick={() => setShowSortResult(!showSortResult)}
                >
                  Sort By
                </Box>
                {showSortResult &&
                  <Box
                    position="absolute"
                    backgroundColor="#FFFFFF"
                    zIndex="50"
                    right="0"
                    minWidth="150px"
                    height="auto"
                    border="1px solid #ccc"
                  >
                    <VStack position="relative">
                      <Box>
                        Relevance
                      </Box>
                      <Box>
                        Price (Low to High)
                      </Box>
                      <Box>
                        Price (High to Low)
                      </Box>
                    </VStack>
                  </Box>

                }
              </Box>

            </HStack>
            <WindowElement
              scrollHeight={stackMinHeight}
              elements={elements}
              range={range}
              scrollerRef={scrollerRef}
              backgroundColor={itemInfo.backgroundColor}
              height={itemInfo.itemHeight}
              border={itemInfo.itemBorder}
              marginRight={itemInfo.marginRight}
              marginBottom={itemInfo.marginBottom}
              eachColCount={itemInfo.eachColCount}
            />

          </Stack>
        </Stack>
        {infiniteScroll && <Box id="sentinel" style={{ height: '1px' }}></Box>}
      </VStack>
    );

  }
  return null;
};


export default OrderOnline2


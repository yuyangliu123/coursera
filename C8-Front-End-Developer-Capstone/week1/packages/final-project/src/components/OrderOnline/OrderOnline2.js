import { Box, Button, HStack, Heading, Image, Spinner, Stack, Text, VStack, Skeleton, SkeletonText, useToast, getToastPlacement, Flex, Grid, GridItem, Input, InputGroup, InputLeftAddon, useBreakpointValue, Radio, RadioGroup } from "@chakra-ui/react"; import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import theme from "../../theme.js"
import { Suspense, useContext, useEffect, useMemo, useRef, useState } from "react";
import FoodButton from "./FoodButton.js";
import { Route, Router, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useHandleScroll, WindowElement } from "../provider/window-scroll.js";
import useClickOutside from "../provider/useClickOutside.js";
import useBreakpoint from "../provider/useBreakpoint.js";
import LazyLoadImage from "../provider/LazyLoadImage.js";
import { assertCompositeType } from "graphql";
import useSWRInfinite from "swr/infinite"
import axios from "axios";
import { debounceRAF } from "../provider/debounceRAF.js";
import SearchSuggestionBox from "./SearchSuggestionBox.js";
import { SearchContext } from "../provider/SearchContext.js";
import ProductItem from "./ProductItem.js";
import SearchSuggestionBoxMobile from "./SearchSuggestionBoxMobile.js";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { ModalContext } from "../provider/ModalContext.js";
import LikeItemSkeleton from "./LikeItemSkeleton.js";
import OrderOnlineSkeleton from "./OrderOnlineSkeleton.js";
import { object } from "yup";
import { backToTop } from "../provider/backToTop.js";
import globalConfig from "../globalConfig.js";

// 自定義 fetcher 函數
const fetcher = async (url) => {
  // 添加 1 秒延遲
  await new Promise(resolve => setTimeout(resolve, 100));
  const response = await axios.get(url);
  return response.data
};
const OrderOnline2 = () => {
  // const [infiniteDisplay,setinfibiteDisplay]=useState(true)


  // const [isShow, setIsShow] = useState(false)
  // const [showSortResult, setShowSortResult] = useState(false)
  // const [showSortResultMobile, setShowSortResultMobile] = useState(false)
  // const [showFilter, setShowFilter] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [uiState, setUiState] = useState({
    isShow: false,
    showSortResult: false,
    showSortResultMobile: false,
    showFilter: false,
    showSkeleton: true
  });



  const [menu, setMenu] = useState({ category: [], data: [], sortby: "" });
  const [menuSort, setMenuSort] = useState({ category: [], data: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [infiniteScroll, setInfiniteScroll] = useState(false)
  // const [isSearching, setIsSearching] = useState(false)
  const {
    // searchResults, setSearchResults, 
    isSearching, setIsSearching } = useContext(SearchContext)
  // const [searchResultsClone, setSearchResultsClone] = useState([]);
  const location = useLocation() //to get current location
  const scrollerRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(new URLSearchParams(window.location.search).get("category") || "");
  const [selectedSortOption, setSelectedSortOption] = useState(new URLSearchParams(window.location.search).get("sort") || "");
  //prevent scroll when mobile filter
  // document.body.style.overflow = uiState.showFilter ? "hidden" : "unset"

  // 取得 URL 參數
  const query = new URLSearchParams(window.location.search);
  const category = query.get('category');
  const sort = query.get('sort');
  const search = query.get('search');
  const pageLimit = 20;
  // 定義獲取 key 的函數
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.data?.length) {
      setUiState(prev => ({ ...prev, showSkeleton: false }))
      return null;
    }

    const baseUrl = search
      ? `http://localhost:5000/api/search?search=${search}`
      : category
        ? `http://localhost:5000/api/order?category=${category}`
        : `http://localhost:5000/api/api?page=${pageIndex + 1}&limit=${pageLimit}`;

    return sort ? `${baseUrl}&sort=${sort}` : baseUrl;
  };

  const {
    data: pages,
    error,
    size,
    setSize,
    isLoading,
    isValidating
  } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    onSuccess: (data) => {
      // 檢查是否為最後一頁
      const isLastPage = data && data[data.length - 1]?.data?.length === 0;
      console.log(isLastPage, "islastpage", uiState.showSkeleton, "showSkeleton");

      if (isLastPage || category || search) {
        setLocalLoading(false);
        setUiState(prev => ({ ...prev, showSkeleton: false }))
        return
      } else {
        setUiState(prev => ({ ...prev, showSkeleton: true }))
      }
    },
    onError: () => {
      setLocalLoading(false);
    }
  });


  // 設置搜尋狀態
  useEffect(() => {
    setIsSearching(!!search);
    setInfiniteScroll(!category && !search);
    setUiState(prev => ({ ...prev, showSkeleton: true }))
    setLocalLoading(true);
  }, [search, category, sort]);

  // 處理數據格式
  const searchResults = useMemo(() => {
    if (!pages) return null;

    if (search) {
      // 搜尋結果
      return {
        category: pages[0]?.category,
        data: pages[0]?.data,
        sortby: !sort
          ? "Relevance"
          : sort === "dsc"
            ? "Price (High to Low)"
            : sort === "asc"
              ? "Price (Low to High)"
              : ""
      };
    }

    if (category) {
      // 分類頁面
      return {
        category: pages[0]?.category,
        data: pages[0]?.data,
        sortby: !sort
          ? "Relevance"
          : sort === "dsc"
            ? "Price (High to Low)"
            : sort === "asc"
              ? "Price (Low to High)"
              : ""
      };
    }

    // 首頁無限捲動
    return {
      category: pages[0]?.category,
      data: pages.flatMap(page => page?.data || []),
      sortby: !sort
        ? "Relevance"
        : sort === "dsc"
          ? "Price (High to Low)"
          : sort === "asc"
            ? "Price (Low to High)"
            : ""
    };
  }, [pages, search, category, sort]);




  console.log("url info", location, pages,
    window.location.href);

  // console.log("searchresult", searchResults, "url", window.location.href);
  const [localLoading, setLocalLoading] = useState(true);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  //set page when scroll to bottom
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        setSize(prevSize => {
          console.log("Loading next page, current size:", prevSize);
          return prevSize + 1;
        });
      }
    }, {
      root: null,
      rootMargin: '500px',
      threshold: 1.0
    });

    observerRef.current = observer;
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    // 清理函數
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, localLoading]); // 只在組件掛載時執行一次


  const dataToDisplay = useMemo(() => {
    return !isLoading
      ? searchResults
      // :false
      : menu
  }, [isLoading, menu, searchResults])
  //-----------------------------------------------------------------------------------------

  //windowing
  const elements = useMemo(() => {

    if (dataToDisplay.data.length > 0) {
      return dataToDisplay.data.map(value => (
        <ProductItem key={value.idMeal} product={value} />
      ));
    } else {
      return null
    }
  }, [menu.data, searchResults]);


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
    "backgroundColor": "#fce9d7",
    "initialShowColNum": 3,
    "eachColCount": eachColCounts,
    "preloadingColNum": 1,
    "elements": elements,
  }), [eachColCounts, elements, itemHeights]);

  //get border width
  const borderValue = itemInfo.itemBorder.split(' ').find(value => value.includes('px'));
  const borderWidth = parseInt(borderValue);

  //set scroller height
  const stackMinHeight = useMemo(() => {
    return dataToDisplay.data
      ? (dataToDisplay.data.length % itemInfo.eachColCount) === 0
        ? Math.floor(dataToDisplay.data.length / itemInfo.eachColCount) * (itemInfo.itemHeight) + Math.floor(dataToDisplay.data.length / itemInfo.eachColCount - 1) * (itemInfo.marginBottom + borderWidth * 2) + "px"
        : Math.floor(dataToDisplay.data.length / itemInfo.eachColCount + 1) * (itemInfo.itemHeight) + Math.floor(dataToDisplay.data.length / itemInfo.eachColCount) * (itemInfo.marginBottom + borderWidth * 2) + "px"
      : null
  }, [dataToDisplay]);



  const { range, setRange } = useHandleScroll({
    scrollerRef,
    invisiblePartHeight: itemInfo.invisiblePartHeight,
    itemHeight: itemInfo.itemHeight,
    itemBorder: itemInfo.itemBorder,
    itemMarginBottom: itemInfo.marginBottom,
    initialShowColNum: itemInfo.initialShowColNum,
    eachColCount: itemInfo.eachColCount,
    preloadingColNum: itemInfo.preloadingColNum,
    elements: elements || []
  });


  const handleCategoryClick = (category) => {
    const currentUrl = window.location.href;
    const query = new URLSearchParams(window.location.search);
    const currentCategory = query.get('category');

    let newUrl
    newUrl =
      !currentCategory
        ? `/order2?category=${category}`
        : category != currentCategory
          ? `/order2?category=${category}`
          : '/order2';
    setPage(1);
    setMenu({ category: [], data: [], sortby: "Relevance" });
    window.history.pushState(null, '', newUrl);
    window.dispatchEvent(new Event('popstate'));
    setInfiniteScroll(!category);

    setRange({ start: 0, end: Math.min(itemInfo.initialShowColNum * itemInfo.eachColCount, Object.keys(elements).length) })
    backToTop()

    // window.scrollTo({  //here
    //   top: 0
    // });
  };

  const handleCategoryMobileClick = (category) => {
    const currentUrl = window.location.href;
    const query = new URLSearchParams(window.location.search);
    const currentCategory = query.get('category');
    if (currentCategory && category == currentCategory) {
      return
    }

    let newUrl
    newUrl =
      !currentCategory
        ? `/order2?category=${category}`
        : category != currentCategory
          ? `/order2?category=${category}`
          : ""
    setPage(1);
    setMenu({ category: [], data: [], sortby: "Relevance" });
    window.history.pushState(null, '', newUrl);
    window.dispatchEvent(new Event('popstate'));
    setInfiniteScroll(!category);
    setRange({ start: 0, end: Math.min(itemInfo.initialShowColNum * itemInfo.eachColCount, Object.keys(elements).length) })
    backToTop()
    // window.scrollTo({
    //   top: 0
    // });
  };


  const handleSortClick = (sort) => {
    // if (!isSearching) {
    const currentUrl = window.location.href;
    const query = new URLSearchParams(window.location.search);
    const currentSort = query.get('sort');
    let newUrl;
    newUrl = sort
      ? currentSort
        ? currentUrl.replace(/(sort=)[^\&]+/, `$1${sort}`)
        : currentUrl.includes("?")
          ? currentUrl + `&sort=${sort}`
          : currentUrl + `?sort=${sort}`
      : currentUrl.replace(/[?&]sort=[^\&]+/, "").replace(/\?$/, "");
    window.history.pushState(null, "", newUrl);
    window.dispatchEvent(new Event('popstate'));
  };




  const sortResultsRef = useRef()
  //click outside and hide relative div
  useClickOutside([sortResultsRef], () => {
    setUiState(prev => ({ ...prev, showSortResult: false }))
  })


  const isLargerThanLG = useBreakpoint(
    {
      xs: 400,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    },
    {
      xxl: true,
      xl: true,
      lg: true,
      md: true,
      sm: false,
      xs: false,
      base: false
    });
  console.log("selectedCategory", selectedCategory);
  console.log("elements", elements, "stackMinHeight", stackMinHeight,
    "range", range,
    "scrollerRef", scrollerRef,
    "iteminfo", itemInfo);
  if (elements) {
    console.log("e", elements, "large", Math.min(itemInfo.initialShowColNum * itemInfo.eachColCount, Object.keys(itemInfo.elements).length));
  }


  if (dataToDisplay) {
    return (
      <VStack>
        <Flex minHeight="auto" width="100%" justifyContent="space-between" direction={{ lg: "row", base: "column" }}>
          <Box
          id="box"
            width={{ lg: "25%", base: "100%" }}
            backgroundColor="#fbdabb4d"
            height="fit-content"
            padding="0 0 3vh 3vh"
            position={{ base: "fixed", lg: "sticky" }}
            bottom={{ base: "0", lg: "" }}
            left={{ base: "0", lg: "" }}
            display={{ base: "none", lg: "block" }}
            zIndex="20"
            top={globalConfig.navHeight}
          >
            <Box width="100%" textStyle="StyledNav" fontSize="2rem" onClick={() => setUiState(prev => ({ ...prev, isShow: !uiState.isShow }))}>
              <HStack>
                <Box>
                  Ingredient
                </Box>
                <Box>
                  {uiState.isShow ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
                </Box>
              </HStack>
            </Box>
            <VStack display={uiState.isShow ? "flex" : "none"} marginLeft="0" width="fit-content" alignItems="self-start">
              {Object.values(dataToDisplay.category || []).map(value => (
                <Box onClick={() => handleCategoryClick(value)}>
                  <Box borderBottom={
                    new URLSearchParams(window.location.search).get("category")
                      ? new URLSearchParams(window.location.search).get("category").includes(value)
                        ? "1px solid black"
                        : ""
                      : ""
                  }>
                    <FoodButton
                      key={value}
                      category={value}
                      // setMenu={setMenu}
                      // menu={menu}
                      marginLeft="0"
                    />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* -----------------------------------------------------for mobile ver */}
          <Box display={{ base: "block", lg: "none" }}>
            <Box
              width="100%"
              backgroundColor="red"
              height="4vh"
              position="fixed"
              bottom="0"
              left="0"
              display={{ base: "block", lg: "none" }}
              zIndex="100"
              justifyItems="center"
              onClick={() => {
                if (uiState.showFilter) {
                  handleCategoryMobileClick(selectedCategory)
                  handleSortClick(selectedSortOption)
                  document.body.style.overflow = "unset"
                } else if (!uiState.showFilter) {
                  document.body.style.overflow = "hidden"
                }
                setUiState(prev => ({ ...prev, showFilter: !uiState.showFilter }))
                setSelectedCategory(new URLSearchParams(window.location.search).get("category") || "")
              }}
            >
              <Box
                margin="0 auto"
                width="fit-content"
                textStyle="StyledNav"
                fontSize="1.5em"
              >
                {uiState.showFilter ? "APPLY" : `+ FILTERS`}
              </Box>
            </Box>
            <VStack
              position="fixed"
              display={uiState.showFilter ? "flex" : "none"}
              width="100%"
              height="100%"
              alignItems="self-start"
              top={globalConfig.navHeight}
              left="0"
              zIndex="90"
              backgroundColor="#fbdabb"
              overflow="auto"
              textStyle="StyledNav"
              fontSize="2em"
            >
              <Box
                width="fit-content"
                margin="0 0 0 auto"
                fontSize="1.5rem"
                onClick={() => {
                  setUiState(prev => ({ ...prev, isShow: !uiState.isShow }))
                  setUiState(prev => ({ ...prev, showFilter: !uiState.showFilter }))
                }}
              >
                CLOSE <SmallCloseIcon />
              </Box>
              <Box width="100%" textStyle="StyledNav" fontSize="2rem" onClick={() => setUiState(prev => ({ ...prev, isShow: !uiState.isShow }))}>
                <HStack>
                  <Box>
                    Ingredient
                  </Box>
                  <Box>
                    {uiState.isShow ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
                  </Box>
                </HStack>
              </Box>
              <VStack
                display={uiState.isShow ? "flex" : "none"}
              >
                <Box
                  padding="0 2vh 0 2vh"
                  width="100%"
                  height="100%"
                >
                  <RadioGroup onChange={setSelectedCategory} value={selectedCategory}>
                    {Object.values(dataToDisplay.category || []).map(value => (
                      <Box key={value} marginY="2">
                        <input
                          type="radio"
                          id={value}
                          name="category"
                          value={value}
                          style={{ display: 'none' }}
                          checked={selectedCategory === value}
                          onChange={() => setSelectedCategory(value)}
                        />
                        <label htmlFor={value}>
                          <Box
                            width="fit-content"
                            borderBottom={
                              selectedCategory === value ? "1px solid black" : ""
                            }
                          >
                            <FoodButton category={value} marginLeft="0" fontSize="1.5rem" />
                          </Box>
                        </label>
                      </Box>
                    ))}
                  </RadioGroup>
                </Box>
              </VStack>
              <Box>
                <HStack
                  width="20vh"
                  justifyContent="space-between"
                  id="sortResults"
                  onClick={() => setUiState(prev => ({ ...prev, showSortResultMobile: !uiState.showSortResultMobile }))}
                >
                  <Box>
                    Sort By
                  </Box>
                  <Box>
                    {selectedSortOption} {/* Display the selected sort option */}
                  </Box>
                </HStack>
                <Box
                  display={uiState.showSortResultMobile ? "block" : "none"}
                  // position="absolute"
                  // backgroundColor="#FFFFFF"
                  // zIndex="50"
                  // right="0"
                  // minWidth="150px"
                  padding="0 2vh 0 2vh"
                  width="100%"
                  height="100%"
                  fontSize="1.5rem"
                // border="1px solid #ccc"
                >
                  <RadioGroup
                    onChange={setSelectedSortOption} // Update the selected sort option
                    value={selectedSortOption} // Bind the selected value to the radio group
                  >
                    <VStack
                      position="relative"
                      alignItems="self-start"
                    >
                      <Box marginY="2">
                        <input
                          type="radio"
                          id="relevance"
                          name="sortby"
                          value="relevance"
                          style={{ display: 'none' }}
                          checked={selectedSortOption === "relevance"}
                          onChange={() => setSelectedSortOption("relevance")}
                        />
                        <label htmlFor="relevance">
                          <Box
                            width="fit-content"
                            borderBottom={selectedSortOption === "relevance" ? "1px solid black" : ""}
                          >
                            Relevance
                          </Box>
                        </label>
                      </Box>
                      <Box marginY="2">
                        <input
                          type="radio"
                          id="asc"
                          name="sortby"
                          value="asc"
                          style={{ display: 'none' }}
                          checked={selectedSortOption === "asc"}
                          onChange={() => setSelectedSortOption("asc")}
                        />
                        <label htmlFor="asc">
                          <Box
                            width="fit-content"
                            borderBottom={selectedSortOption === "asc" ? "1px solid black" : ""}
                          >
                            Price (Low to High)
                          </Box>
                        </label>
                      </Box>
                      <Box marginY="2">
                        <input
                          type="radio"
                          id="dsc"
                          name="sortby"
                          value="dsc"
                          style={{ display: 'none' }}
                          checked={selectedSortOption === "dsc"}
                          onChange={() => setSelectedSortOption("dsc")}
                        />
                        <label htmlFor="dsc">
                          <Box
                            width="fit-content"
                            borderBottom={selectedSortOption === "dsc" ? "1px solid black" : ""}
                          >
                            Price (High to Low)
                          </Box>
                        </label>
                      </Box>
                    </VStack>
                  </RadioGroup>
                </Box>
              </Box>

            </VStack>
          </Box>
          {/* --------------------------------------for mobile ver end*/}
          <Stack width={{ lg: "70%", base: "100%" }}>
            <HStack
              id="filterContainer"
              position="sticky"
              top={globalConfig.navHeight}
              zIndex="20"
              backgroundColor="white"
              flexDirection={{ base: "column", lg: "row" }}
              alignItems="flex-start"
              gap={4}
            >
              <VStack>
                <HStack
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box as="h1" textStyle="StyledH1" color="black" id="currentResults" fontSize={{ xxl: "64px", lg: "32px", sm: "64px", base: "50px" }}>
                    Menu page
                  </Box>
                  {/* <InputGroup width="30%">
                <InputLeftAddon><FontAwesomeIcon icon={faMagnifyingGlass} /></InputLeftAddon>
                <Input id="searchBox" placeholder="Search" onChange={handleSearchSuggestion} />
                </InputGroup> */}
                  {isLargerThanLG ? <SearchSuggestionBox /> : <SearchSuggestionBoxMobile />}
                  <Box ref={sortResultsRef} display={{ lg: "block", base: "none" }}>
                    <HStack
                      width="20vh"
                      justifyContent="space-between"
                      id="sortResults"
                      onClick={() => setUiState(prev => ({ ...prev, showSortResult: !uiState.showSortResult }))}
                    >
                      <Box>
                        Sort By
                      </Box>
                      <Box>
                        {dataToDisplay.sortby}
                      </Box>
                    </HStack>
                    <Box
                      display={uiState.showSortResult ? "block" : "none"}
                      position="absolute"
                      backgroundColor="#FFFFFF"
                      zIndex="50"
                      right="0"
                      minWidth="150px"
                      height="auto"
                      border="1px solid #ccc"
                      onClick={() => setUiState(prev => ({ ...prev, showSortResult: !uiState.showSortResult }))}
                    >
                      <VStack position="relative">
                        <Box onClick={() => {
                          handleSortClick("")
                        }}>
                          Relevance
                        </Box>
                        <Box onClick={() => {
                          handleSortClick("asc")
                        }}>
                          Price (Low to High)
                        </Box>
                        <Box onClick={() => {
                          handleSortClick("dsc")
                        }}>
                          Price (High to Low)
                        </Box>
                      </VStack>
                    </Box>
                  </Box>
                </HStack>
                {/* Category and Search Tags Section */}
                <Suspense fallback={<Box>Loading tags...</Box>}>
                  <HStack width="100%" spacing={4} flexWrap="wrap">
                    {new URLSearchParams(window.location.search).get("category") && (
                      <Box
                        onClick={() => {
                          window.history.pushState(null, "", '/order2');
                          window.dispatchEvent(new Event('popstate'));
                          backToTop()
                        }}
                      // padding="4px 12px"
                      // borderRadius="md"
                      // backgroundColor="gray.100"
                      // display="flex"
                      // alignItems="center"
                      // gap={2}
                      // cursor="pointer"
                      >
                        <strong>{new URLSearchParams(window.location.search).get("category")}</strong>
                        <SmallCloseIcon />
                      </Box>
                    )}

                    {new URLSearchParams(window.location.search).get("search") && (
                      <Box
                        onClick={() => {
                          window.history.pushState(null, "", '/order2');
                          window.dispatchEvent(new Event('popstate'));
                        }}
                      // padding="4px 12px"
                      // borderRadius="md"
                      // backgroundColor="gray.100"
                      // display="flex"
                      // alignItems="center"
                      // gap={2}
                      // cursor="pointer"
                      >
                        Search for <strong>{new URLSearchParams(window.location.search).get("search")}</strong>
                        <SmallCloseIcon />
                      </Box>
                    )}
                  </HStack>
                </Suspense>
              </VStack>
            </HStack>
            {isLoading ? (
              <OrderOnlineSkeleton
                numCol={20}
                numRow={5}
                backgroundColor={itemInfo.backgroundColor}
              />
            ) : (
              <Suspense fallback={
                <OrderOnlineSkeleton
                  numCol={20}
                  numRow={5}
                  backgroundColor={itemInfo.backgroundColor}
                />
              }>
                <Box backgroundColor={itemInfo.backgroundColor}>
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

                  {category || search ? (
                    <></>
                  ) : uiState.showSkeleton ? (
                    <Box id="sentinel" ref={sentinelRef}>
                      <OrderOnlineSkeleton
                        numCol={eachColCounts}
                        numRow={1}
                        marginTop={itemInfo.marginBottom}
                        backgroundColor={itemInfo.backgroundColor}
                      />
                    </Box>
                  ) : (
                    <Box>No more data</Box>
                  )}
                </Box>
              </Suspense>
            )}
            {/* {showSkeleton && <OrderOnlineSkeleton numCol={4} numRow={1}/>} */}


          </Stack>
        </Flex>

      </VStack>
    );
  }
  return null;
};


export default OrderOnline2


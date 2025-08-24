import { Box, Button, HStack, Heading, Image, Spinner, Stack, Text, VStack, Skeleton, SkeletonText, useToast, getToastPlacement, Flex, Grid, GridItem, Input, InputGroup, InputLeftAddon, useBreakpointValue } from "@chakra-ui/react"; import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import theme from "../../theme.js"
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import FoodButton from "./FoodButton.js";
import { Route, Router, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useHandleScroll, WindowElement } from "../provider/window-scroll.js";
import useClickOutside from "../provider/useClickOutside.js";
import useBreakpoint from "../provider/useBreakpoint.js";
import LazyLoadImage from "../provider/LazyLoadImage.js";
import { assertCompositeType } from "graphql";
import axios from "axios";
import { debounceRAF } from "../provider/debounceRAF.js";
import SearchSuggestionBox from "./SearchSuggestionBox.js";
import { SearchContext } from "../provider/SearchContext.js";
import ProductItem from "./ProductItem.js";
import SearchSuggestionBoxMobile from "./SearchSuggestionBoxMobile.js";
const OrderOnline2 = () => {
  // const [infiniteDisplay,setinfibiteDisplay]=useState(true)
  const [isShow, setIsShow] = useState(false)
  const [menu, setMenu] = useState({ category: [], data: [], sortby: "" });
  const [menuSort, setMenuSort] = useState({ category: [], data: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [infiniteScroll, setInfiniteScroll] = useState(false)
  // const [isSearching, setIsSearching] = useState(false)
  const { searchResults, setSearchResults, isSearching, setIsSearching } = useContext(SearchContext)
  // const [searchResultsClone, setSearchResultsClone] = useState([]);
  const location = useLocation() //to get current location
  const scrollerRef = useRef(null);
  const [showSortResult, setShowSortResult] = useState(false)




  //here when click nav order online, it'll fetchhttp://localhost:5000/api/api?page=2&limit=20 and etc.
  //infinite scroll
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const query = new URLSearchParams(window.location.search);
      const category = query.get('category');
      const sort = query.get('sort');
      const search = query.get("search")
      search ? setIsSearching(true) : setIsSearching(false)
      const pageLimit = 20;
      const url = search
        ? `http://localhost:5000/api/search?search=${search}`
        : category
          ? `http://localhost:5000/api/order?category=${category}`
          : `http://localhost:5000/api/api?page=${page}&limit=${pageLimit}`;
      const sortUrl = sort ? url + `&sort=${sort}` : url


      setInfiniteScroll(!category && !search);

      try {
        const response = await axios.get(sortUrl);
        const data = response.data;
        if (search) {
          setSearchResults({
            category: data.category,
            data: data.data,
            sortby: !sort
              ? "Relevance"
              : sort == "dsc"
                ? "Price (High to Low)"
                : sort == "asc"
                  ? "Price (Low to High)"
                  : ""
          })
        } else
          if (!category) {
            setMenu(prevMenu => ({
              category: page === 1 ? data.category : prevMenu.category,
              data: page === 1 ? data.data : [...prevMenu.data, ...data.data],
              sortby: !sort
                ? "Relevance"
                : sort == "dsc"
                  ? "Price (High to Low)"
                  : sort == "asc"
                    ? "Price (Low to High)"
                    : ""
            }))
          } else {
            setMenu({
              category: data.category,
              data: data.data,
              sortby: !sort
                ? "Relevance"
                : sort == "dsc"
                  ? "Price (High to Low)"
                  : sort == "asc"
                    ? "Price (Low to High)"
                    : ""
            });
          }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        console.log("useeffect occur");
      }
    };
    fetchData();
  }, [
    location,
    page,
    window.location.href]);
  console.log("url info", location, page,
    window.location.href);

  // console.log("searchresult", searchResults, "url", window.location.href);


  //set page when scroll to bottom
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage(prevPage => prevPage + 1);
        console.log("set page", page);

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
  //-----------------------------------------------------------------------------------------
  // const dataToDisplay=useMemo(()=>{
  //   return isSearching
  //   ? Array.isArray(searchResults.data) && searchResults.data.length > 0
  //     ? searchResults
  //     : {data:[],category:[]}
  //     // :false
  //   : menu
  // },[isSearching,menu,searchResults])
  const dataToDisplay = useMemo(() => {
    return isSearching
      ? searchResults
      // :false
      : menu
  }, [isSearching, menu, searchResults])
  console.log(dataToDisplay, "datatpdisplay");

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
  const stackMinHeight = useMemo(() => {
    return dataToDisplay.data
      ? (dataToDisplay.data.length % itemInfo.eachColCount) === 0
        ? Math.floor(dataToDisplay.data.length / itemInfo.eachColCount) * (itemInfo.itemHeight) + Math.floor(dataToDisplay.data.length / itemInfo.eachColCount - 1) * (itemInfo.marginBottom + borderWidth * 2) + "px"
        : Math.floor(dataToDisplay.data.length / itemInfo.eachColCount + 1) * (itemInfo.itemHeight) + Math.floor(dataToDisplay.data.length / itemInfo.eachColCount) * (itemInfo.marginBottom + borderWidth * 2) + "px"
      : null
  }, [dataToDisplay]);

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
    // } else {
    //   console.log("searching, button not work");
    //   console.log(searchResults == searchResults.sort((a, b) => a.price - b.price));
    //   console.log("clone", searchResultsClone);

    //   let sortedResults = [...searchResults];
    //   sortedResults = sort === ""
    //     ? searchResultsClone
    //     : sort === "asc"
    //       ? sortedResults.sort((a, b) => a.price - b.price)
    //       : sort === "dsc"
    //         ? sortedResults.sort((a, b) => b.price - a.price)
    //         : ""
    //   setSearchResults(sortedResults);
    // }
  };




  const sortResultsRef = useRef()
  //click outside and hide relative div
  useClickOutside([sortResultsRef], () => {
    setShowSortResult(false)
  })

  // const handleSearchSuggestion = debounceRAF(async (event) => {
  //   const searchString = event.target.value.trim() //remove space at start and end
  //   if (!searchString) {
  //     setIsSearching(false)
  //     setSearchResults([])
  //     // setSearchResultsClone([])
  //     return
  //   }
  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/search-suggestions?query=${searchString}`);
  //     // Handle the search results here
  //     setIsSearching(true)
  //     setSearchResults(response.data);
  //     // setSearchResultsClone(response.data)
  //     setInfiniteScroll(false)
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }, 1000)
  //here
  // console.log("searchResults.data=== false", isSearching && searchResults.category && searchResults.data == false,
  //   "element", elements, "elements==null", elements == null,
  //   "Object.keys(menu.data).length > 0 || searchResults.data", Object.keys(menu.data).length > 0 || searchResults.data,
  //   "searchResults.data==true", searchResults.data == true, "searchResults", searchResults,
  //   "searchResults", searchResults,
  //   "elements", elements,
  //   "dataToDisplay", dataToDisplay,
  //   "searchstring",window.location.href
  // );

  const isLargerThanLG =  useBreakpoint(
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

  if (dataToDisplay) {
    return (
      <VStack>
        <Stack minHeight="auto" width="100%" justifyContent="space-between" direction={{ lg: "row", base: "column" }}>
          <Box width={{ lg: "20%", base: "100%" }} backgroundColor="#fbdabb4d" height="fit-content" padding="0 0 3vh 3vh">
            <Box textStyle="StyledNav" fontSize="2em" onClick={() => setIsShow(!isShow)}>
              Ingredient
            </Box>
            <VStack display={isShow ? "flex" : "none"} marginLeft="0" width="fit-content" alignItems="self-start">
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
          <Stack width={{ lg: "70%", base: "100%" }}>
            <HStack id="filterContainer" justifyContent="space-between">
              <Box as="h1" textStyle="StyledH1" color="black" id="currentResults">
                Menu page
              </Box>
              {/* <InputGroup width="30%">
                <InputLeftAddon><FontAwesomeIcon icon={faMagnifyingGlass} /></InputLeftAddon>
                <Input id="searchBox" placeholder="Search" onChange={handleSearchSuggestion} />
              </InputGroup> */}
              {isLargerThanLG ? <SearchSuggestionBox /> : <SearchSuggestionBoxMobile />}
              <Box ref={sortResultsRef}>
                <HStack
                  width="20vh"
                  justifyContent="space-between"
                  id="sortResults"
                  onClick={() => setShowSortResult(!showSortResult)}
                >
                  <Box>
                    Sort By
                  </Box>
                  <Box>
                    {dataToDisplay.sortby}
                  </Box>
                </HStack>
                <Box
                  display={showSortResult ? "block" : "none"}
                  position="absolute"
                  backgroundColor="#FFFFFF"
                  zIndex="50"
                  right="0"
                  minWidth="150px"
                  height="auto"
                  border="1px solid #ccc"
                  onClick={() => setShowSortResult(!showSortResult)}
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
            {
              // isSearching &&searchResults&& searchResults.category &&searchResults.data==false
              // Array.isArray(searchResults.data) && searchResults.data.length > 0||
              elements
                ?
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
                :
                <Box minHeight="45vh">No Meal Found</Box>


            }


          </Stack>
        </Stack>
        {infiniteScroll && <Box id="sentinel" style={{ height: '1px' }}></Box>}
      </VStack>
    );

  }
  return null;
};


export default OrderOnline2


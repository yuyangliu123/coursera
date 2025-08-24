import { Box, Button, HStack, Heading, Image, Spinner, Stack, Text, VStack, Skeleton, SkeletonText, useToast, getToastPlacement, Flex, Grid, GridItem, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react"; import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
const OrderOnline2 = () => {
  // const [infiniteDisplay,setinfibiteDisplay]=useState(true)
  const [isShow, setIsShow] = useState(false)
  const [menu, setMenu] = useState({ category: [], data: [], sortby: "" });
  const [menuSort, setMenuSort] = useState({ category: [], data: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [infiniteScroll, setInfiniteScroll] = useState(true)
  // const [isSearching, setIsSearching] = useState(false)
  const { searchResults, setSearchResults, isSearching, setIsSearching } = useContext(SearchContext)
  // const [searchResultsClone, setSearchResultsClone] = useState([]);
  const location = useLocation() //to get current location
  const scrollerRef = useRef(null);
  const [showSortResult, setShowSortResult] = useState(false)

  const handleSort = (data, sortKey) => {
    const sortedData = [...data];

    switch (sortKey) {
      case 'asc':
        return sortedData.sort((a, b) => a.price - b.price);
      case 'dsc':
        return sortedData.sort((a, b) => b.price - a.price);
      default:
        return data;
    }
  };



  //infinite scroll
  useEffect(() => {

    console.log("useeffect be trigger");
    const fetchData = async () => {
      setLoading(true);
      const query = new URLSearchParams(window.location.search);
      const category = query.get('category');
      const sort = query.get('sort');
      const search = query.get("search")
      search?setIsSearching(true):setIsSearching(false)
      //here
      const pageLimit = 20;
      const url = 
      // search
      //   ? `http://localhost:5000/api/search?search=${search}`
      //   : 
        category
          ? `http://localhost:5000/api/order?category=${category}`
          : `http://localhost:5000/api/api?page=${page}&limit=${pageLimit}`;
      const sortUrl = sort ? url + `&sort=${sort}` : url

      if (category || search) {
        setInfiniteScroll(false)
      } else {
        setInfiniteScroll(true)
      }
      console.log(sortUrl);

      try {
        const response = await fetch(sortUrl);
        const data = await response.json();
        if (search) {
          setSearchResults(data.data)
          console.log(searchResults);

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
          // const sortData = handleSort(data.data, sort)
          // setMenu({
          //   category: sortData.category,
          //   data: sortData.data
          // });
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
      }
    };

    fetchData();
  }, [location, page, window.location.href, window.location.search]);

console.log("searchresult",searchResults,"url",window.location.href);


  //set page when scroll to bottom
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

  // useEffect(() => {
  //   const query = new URLSearchParams(location.search);
  //   console.log(query);

  //   const sort = query.get("sort")
  //   if (menu.data.length > 0 && sort) {


  //     const sortedData = handleSort(menu.data, sort);
  //     console.log("Sorted Data:", sortedData.map(item => item.price));

  //   }
  // }, [location.search, location, page, menu]);


  // const query = new URLSearchParams(location.search);
  // const sort = query.get('sort');
  // let sortedMenuData = null
  // if (menu.data.length > 0) {
  //   sortedMenuData = useMemo(() => handleSort(menu.data, sort), [menu.data, sort]);
  //   console.log(sortedMenuData);

  // }



  //windowing
  const itemSize = { "height": 400, "marginBottom": 30, "marginRight": 5, "border": 1 }

  const elements = useMemo(() => {
    // const dataToDisplay = searchResults.length > 0 ? searchResults : menu.data;
    // console.log("d", dataToDisplay, "s", searchResults, "m", menu.data);

    const dataToDisplay = isSearching
      ? searchResults.length > 0
        ? searchResults
        : "none"
      : menu.data

    // if(dataToDisplay=="none"){
    //   return <Box>No Results Found</Box>
    // }
    if (dataToDisplay.length > 0) {
      return Object.values(dataToDisplay).map((value, index) => (
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
  const stackMinHeight = searchResults.length > 0
    ? (searchResults.length % itemInfo.eachColCount) === 0
      ? Math.floor(searchResults.length / itemInfo.eachColCount) * (itemInfo.itemHeight) + Math.floor(searchResults.length / itemInfo.eachColCount - 1) * (itemInfo.marginBottom + borderWidth * 2) + "px"
      : Math.floor(searchResults.length / itemInfo.eachColCount + 1) * (itemInfo.itemHeight) + Math.floor(searchResults.length / itemInfo.eachColCount) * (itemInfo.marginBottom + borderWidth * 2) + "px"
    : (menu.data.length % itemInfo.eachColCount) === 0
      ? Math.floor(menu.data.length / itemInfo.eachColCount) * (itemInfo.itemHeight) + Math.floor(menu.data.length / itemInfo.eachColCount - 1) * (itemInfo.marginBottom + borderWidth * 2) + "px"
      : Math.floor(menu.data.length / itemInfo.eachColCount + 1) * (itemInfo.itemHeight) + Math.floor(menu.data.length / itemInfo.eachColCount) * (itemInfo.marginBottom + borderWidth * 2) + "px";
  // const stackMinHeight = (menu.data.length % itemInfo.eachColCount) === 0
  //   ? Math.floor(menu.data.length / itemInfo.eachColCount) * (itemInfo.itemHeight) + Math.floor(menu.data.length / itemInfo.eachColCount - 1) * (itemInfo.marginBottom + borderWidth * 2) + "px"
  //   : Math.floor(menu.data.length / itemInfo.eachColCount + 1) * (itemInfo.itemHeight) + Math.floor(menu.data.length / itemInfo.eachColCount) * (itemInfo.marginBottom + borderWidth * 2) + "px";



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
    setInfiniteScroll(!category);
  };

  // const handleSortClick = (sort) => {
  //   const currentUrl = window.location.href
  //   let newUrl
  //   currentUrl.includes("?")
  //     ? newUrl = currentUrl + `&sort=${sort}`
  //     : newUrl = currentUrl + `?sort=${sort}`
  //   return window.history.pushState(null, "", newUrl)
  // }
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


  if (Object.keys(menu.data).length > 0 || searchResults.length>0) {
    return (
      <VStack>
        <Stack minHeight="auto" width="100%" justifyContent="space-between" direction={{ lg: "row", base: "column" }}>
          <Box width={{ lg: "20%", base: "100%" }} backgroundColor="#fbdabb4d" height="fit-content" padding="0 0 3vh 3vh">
            <Box textStyle="StyledNav" fontSize="2em" onClick={() => setIsShow(!isShow)}>
              Ingredient
            </Box>
            <VStack display={isShow ? "flex" : "none"} marginLeft="0" width="fit-content" alignItems="self-start">
              {Object.values(menu.category || []).map(value => (
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
                      setMenu={setMenu}
                      menu={menu}
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
              <SearchSuggestionBox />
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
                    {menu.sortby}
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
              isSearching && searchResults.length == 0
                ? <Box>No Meal Found</Box>

                :
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

            }


          </Stack>
        </Stack>
        {infiniteScroll &&  <Box id="sentinel" style={{ height: '1px' }}></Box>}
      </VStack>
    );

  }
  return null;
};


export default OrderOnline2


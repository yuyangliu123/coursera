import { Box, Button, HStack, Heading, Image, Spinner, Stack, Text, VStack, Skeleton, SkeletonText, useToast, getToastPlacement, Flex, Grid, GridItem, Input, InputGroup, InputLeftAddon, useBreakpointValue, Radio, RadioGroup } from "@chakra-ui/react"; import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { SmallCloseIcon } from "@chakra-ui/icons";
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { ModalContext } from "../provider/ModalContext.js";
const FilterMobile = () => {
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
    const [selectedCategory, setSelectedCategory] = useState(new URLSearchParams(window.location.search).get("category") || "");

    const [showFilter, setShowFilter] = useState(false)
    //prevent scroll when mobile filter
    document.body.style.overflow = showFilter ? "hidden" : "unset"

    return (
        <Box display={{ base: "block", lg: "none" }}>
            <Box
                width="100%"
                backgroundColor="red"
                height="fit-content"
                position="fixed"
                bottom="0"
                left="0"
                display={{ base: "block", lg: "none" }}
                zIndex="100"
                justifyItems="center"
                onClick={() => {
                    if (showFilter) handleCategoryClick(selectedCategory);
                    setShowFilter(!showFilter)
                }}
            >
                <Box
                    margin="0 auto"
                    width="fit-content"
                    textStyle="StyledNav"
                    fontSize="1.5em"
                >
                    {showFilter ? "APPLY" : `+ FILTERS`}
                </Box>
            </Box>
            <VStack
                position="fixed"
                display={showFilter ? "flex" : "none"}
                width="100%"
                height="100%"
                alignItems="self-start"
                top="0"
                left="0"
                zIndex="90"
                backgroundColor="#fbdabb"
                overflow="auto"
                textStyle="StyledNav"
                fontSize="2em"
                onClick={() => setIsShow(!isShow)}
            >
                <Box
                    width="fit-content"
                    margin="0 0 0 auto"
                    fontSize="1.5rem"
                    onClick={() => {
                        setIsShow(!isShow)
                        setShowFilter(!showFilter)
                    }}
                >
                    CLOSE <SmallCloseIcon />
                </Box>
                <Box width="100%" textStyle="StyledNav" fontSize="2rem" onClick={() => setIsShow(!isShow)}>
                    <HStack>
                        <Box>
                            Ingredient
                        </Box>
                        <Box>
                            {isShow ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
                        </Box>
                    </HStack>
                </Box>
                <VStack
                    display={isShow ? "flex" : "none"}
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
            </VStack>
        </Box>
    )
}

export default FilterMobile
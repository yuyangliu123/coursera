import { Box, HStack, Image, Input, InputGroup, InputLeftAddon, List, ListItem, Spinner, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounceRAF } from "../provider/debounceRAF";
import { useContext, useMemo, useRef, useState } from "react";
import axios from "axios";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SearchContext } from "../provider/SearchContext";
import useClickOutside from "../provider/useClickOutside";
import LazyLoadImage from "../provider/LazyLoadImage";
import { Link } from "react-router-dom";

const SearchSuggestionBox = () => {
    const { searchSuggestion, setSearchSuggestion, setIsSearching, setSearchResults, isSearchingSuggest, setIsSearchingSuggest } = useContext(SearchContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [isHover, setIsHover] = useState(false)
    const itemInfo = useMemo(() => ({
        borderRadius: "1.25rem",
        backgroundColor:
            isHover
                ? "#fff3e8"
                : isFocus
                    ? "#fbdabb"
                    : "#fce9d7",
        resultBackgroundColor:
            isFocus
                ? "#fbdabb"
                : "#fce9d7",
    }), [isFocus, isHover]);

    const handleSearchSuggestion = debounceRAF(async (event) => {
        const searchString = event.target.value.trim();
        if (!searchString) {
            setIsSearchingSuggest(false);
            setSearchSuggestion([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setIsSearchingSuggest(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/search-suggestions?query=${searchString}`);
            setSearchSuggestion(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, 500);

    // const handleSearch = async (event) => {
    //     const searchString = event.target.value.trim();
    //     try {
    //         const response = await axios.get(`http://localhost:5000/api/search?query=${searchString}`);
    //         setSearchResults(response.data);
    //         setIsSearching(true);
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };


    const handleSearch = (event) => {
        const searchString = event.target.value.trim();
        if (!searchString) {
            return
        }
        const currentUrl = window.location.href;
        const query = new URLSearchParams(window.location.search);
        const currentSearch = query.get('search');
        let newUrl;
        // newUrl = currentSearch
        //     ? currentUrl.replace(/(search=)[^\&]+/, `$1${searchString}`)
        //     : `order2?search=${searchString}`
        newUrl = searchString
            ? currentSearch
                ? currentUrl.replace(/(search=)[^\&]+/, `$1${searchString}`)
                : currentUrl.includes("?")
                    ? currentUrl + `&search=${searchString}`
                    : currentUrl + `?search=${searchString}`
            : ""
        window.history.pushState(null, "", newUrl);
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch(event);
            setIsSearching(true)
            setIsOpen(false)
            event.target.blur()
            setIsFocus(false)
        }
    };

    const searchBoxRef = useRef();
    useClickOutside([searchBoxRef], () => {
        setIsOpen(false);
    });

    return (
        <Box position="relative" borderRadius={itemInfo.borderRadius}
            ref={searchBoxRef}>
            <Box
                borderRadius={`${itemInfo.borderRadius} ${itemInfo.borderRadius} 0 0`}
                backgroundColor={isSearchingSuggest && isOpen ? itemInfo.resultBackgroundColor : ""}
            >
                <InputGroup
                    width="100%"
                    // border="#e4e4e4 1px solid"
                    borderRadius={itemInfo.borderRadius}
                    backgroundColor={itemInfo.backgroundColor}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    <InputLeftAddon border="none" borderRadius={itemInfo.borderRadius} backgroundColor={itemInfo.backgroundColor}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </InputLeftAddon>
                    <Input
                        id="searchBox"
                        placeholder="Search"
                        border="none"
                        variant="unstyled"
                        borderRadius={itemInfo.borderRadius}
                        color="black"
                        autoComplete="off"
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        _placeholder={{ color: 'black' }}
                        onChange={handleSearchSuggestion}
                        onKeyDown={handleKeyDown}
                        onClick={() => setIsOpen(true)}
                    />
                </InputGroup>
            </Box>
            <Box>
                {isLoading && <Spinner position="absolute" zIndex="20" />}
                {isSearchingSuggest && searchSuggestion.length === 0 ?
                    <Box
                        position="absolute"
                        zIndex="100"
                        backgroundColor={itemInfo.resultBackgroundColor}
                        width="100%"
                        borderRadius={`0 0 ${itemInfo.borderRadius} ${itemInfo.borderRadius}`}
                        display={isOpen ? "block" : "none"}
                        padding="1rem 0"
                    >
                        No result found
                    </Box>
                    : isSearchingSuggest && searchSuggestion.length > 0
                        ?
                        <Box
                            height="fit-content"
                            position="absolute"
                            zIndex="20"
                            backgroundColor={itemInfo.resultBackgroundColor}
                            display={isOpen ? "block" : "none"}
                            width="100%"
                            padding="1rem 0 0 0"
                            borderRadius={`0 0 ${itemInfo.borderRadius} ${itemInfo.borderRadius}`}
                        >
                            <Box>
                                <List>
                                    {searchSuggestion.map((value, index) => (
                                        <Link to={`/order2/${value.strMeal}`} width="100%">
                                            <ListItem key={index} paddingLeft="1rem" marginBottom="0.25rem" width="100%" _hover={{ img: { opacity: 0.7 }, p: { color: "#da1a32" } }}>
                                                <HStack>
                                                    <Box width="50px" height="50px">
                                                        <LazyLoadImage
                                                            src={value.strMealThumb}
                                                            alt={value.strMeal}
                                                            imgWidth="50px"
                                                            auto="webp"
                                                            height="50px"
                                                            objectFit="cover"
                                                            borderRadius="50%"
                                                        />
                                                    </Box>
                                                    <Box height="auto" margin="0 1rem" width="calc(100% - 60px)" whiteSpace="normal" >
                                                        <Box display="flex">
                                                            <Text>
                                                                {value.strMeal}
                                                            </Text>
                                                        </Box>
                                                    </Box>
                                                </HStack>
                                            </ListItem>
                                        </Link>

                                    ))}
                                </List>
                            </Box>
                        </Box>
                        : null
                }
            </Box>
        </Box>
    );
};

export default SearchSuggestionBox;

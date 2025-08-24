import { Box, HStack, Image, Input, InputGroup, InputLeftAddon, InputRightAddon, List, ListItem, Spinner, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounceRAF } from "../provider/debounceRAF";
import { useContext, useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { SearchContext } from "../provider/SearchContext";
import useClickOutside from "../provider/useClickOutside";
import LazyLoadImage from "../provider/LazyLoadImage";
import { Link } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { SmallCloseIcon } from "@chakra-ui/icons";
const SearchSuggestionBox = () => {
    const { searchSuggestion, setSearchSuggestion, setIsSearching, setSearchResults, isSearchingSuggest, setIsSearchingSuggest } = useContext(SearchContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const searchSchema = yup.object().shape({
        search: yup.string().trim().min(1)
    })

    const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(searchSchema)
    });

    let searchInput = watch('search');

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const search = query.get("search");
        if (search) {
            // Set the search value from URL when component loads
            searchInput = search
        }
    }, []);

    const itemInfo = useMemo(() => ({
        borderRadius: "1.25rem",
        backgroundColor: isHover ? "#fff3e8" : isFocus ? "#fbdabb" : "#fce9d7",
        resultBackgroundColor: isFocus ? "#fbdabb" : "#fce9d7",
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
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, 500);

    const handleSearch = async (event) => {
        const searchString = event.target.value.trim();
        if (!searchString) return;

        await searchSchema.validate({ search: searchString });

        const currentUrl = window.location.href;
        const query = new URLSearchParams(window.location.search);
        const currentSearch = query.get('search');
        let newUrl = searchString
            ? currentUrl.includes('?')
                ? currentUrl.replace(/(\?.*)/, `?search=${searchString}`)
                : currentUrl + `?search=${searchString}`
            : "";

        // let newUrl = searchString
        //     ? currentSearch
        //         ? currentUrl.replace(/(search=)[^\&]+/, `$1${searchString}`)
        //         : currentUrl.includes("?")
        //             ? currentUrl + `&search=${searchString}`
        //             : currentUrl + `?search=${searchString}`
        //     : "";
        window.history.pushState(null, "", newUrl);
        window.dispatchEvent(new Event('popstate'));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch(event);
            setIsSearching(true);
            setIsOpen(false);
            event.target.blur();
            setIsFocus(false);
        }
    };

    const searchBoxRef = useRef();
    useClickOutside([searchBoxRef], () => {
        setIsOpen(false);
    });
    // const getInitialValueFromURL = () => {
    //     const params = new URLSearchParams(window.location.search);
    //     return params.get('search') || '';
    // };

    // const initialValues = useMemo(() => {
    //     const params = new URLSearchParams(window.location.search);
    //     return { search: params.get('search') || '' };
    // }, [window.location.href])
    // console.log("ini", initialValues);
    console.log(isSearchingSuggest, searchSuggestion.length > 0);

    return (
        <Box position="relative" borderRadius={itemInfo.borderRadius} ref={searchBoxRef}>
            <Box borderRadius={`${itemInfo.borderRadius} ${itemInfo.borderRadius} 0 0`} backgroundColor={isSearchingSuggest && isOpen ? itemInfo.resultBackgroundColor : ""}>
                <Formik
                    initialValues={{ search: new URLSearchParams(window.location.search).get('search') || '' }}
                    validationSchema={searchSchema}
                    enableReinitialize={true}
                >
                    {({ values, handleChange, setFieldValue }) => (
                        <InputGroup
                            width="100%"
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
                                name="search"
                                value={values.search} // 使用 Formik 的值
                                onChange={(e) => {
                                    handleChange(e);
                                    handleSearchSuggestion(e);
                                    setIsOpen(true)
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                _placeholder={{ color: 'black' }}
                                onClick={() => setIsOpen(true)}
                            />
                            <InputRightAddon
                                border="none"
                                borderRadius={itemInfo.borderRadius}
                                backgroundColor={itemInfo.backgroundColor}
                                onClick={() => {
                                    setFieldValue("search", "")

                                    setIsOpen(false)
                                }}
                            >
                                {values.search && <SmallCloseIcon />}
                            </InputRightAddon>
                        </InputGroup>
                    )}
                </Formik>
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
                                        <Link to={`/order2/${value.strMeal}`} key={index} width="100%">
                                            <ListItem paddingLeft="1rem" marginBottom="0.25rem" width="100%" _hover={{ img: { opacity: 0.7 }, p: { color: "#da1a32" } }}>
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

import { gql, useQuery } from '@apollo/client';
import { Box, Button, Checkbox, HStack, Image, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useToast, VStack } from '@chakra-ui/react';
import { useUserRotate } from '../../provider/JwtTokenRotate';
import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { MealContext } from '../../provider/MealContext';
import { SmallCloseIcon } from "@chakra-ui/icons";
import CartPageHeading from './CartPageHeading';
import { Link, useNavigate } from 'react-router-dom';
import { openDB } from 'idb';
import { axiosInstance, axiosInstanceWithTokenCheck } from '../../provider/axiosInstanceWithTokenCheck';
import Cookies from 'js-cookie';
import { debounceRAF } from '../../provider/debounceRAF';
import LazyLoadImage from '../../provider/LazyLoadImage';
import cartPageConfig from './config/cartPageConfig';
const CARTPAGE_QUERY = gql`
    query CartPageformat($email: String) {
    cartpageformat(email: $email) {
        totalAmount
        totalItem
        checkedAmount
        checkedItem
        data {
        strMeal
        numMeal
        idMeal
        baseAmount
        strMealThumb
        checked
        }
    }
    }
`;

// init IndexedDB
const initDB = async () => {
    const db = await openDB('meal-database', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('cart')) {
                db.createObjectStore('cart', { keyPath: 'idMeal' });
            }
        },
    });
    return db;
};

const updateDB = async (newData) => {
    const db = await initDB();
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');
    await store.put(newData);
    await tx.done;
};

const CartPage = () => {
    const { email, availableAccessToken, isEmail, accessToken } = useUserRotate();
    const { cartItem, setCartItem } = useContext(MealContext);
    const { data: cart, loading, error } = useQuery(CARTPAGE_QUERY, {
        variables: { email },
        fetchPolicy: 'cache-and-network',
        skip: !email || !isEmail
    });
    const [cartData, setCartData] = useState(null);
    const [inputValues, setInputValues] = useState({});
    const navigate = useNavigate();
    const toast = useToast()
    // const [updatedItems, setUpdatedItems] = useState({});
    //If a boolean is used, useEffect will not be triggered when isUpdate is false
    // const [isUpdate, setIsUpdate] = useState(0)


    //modify current input
    const handleInputChange = (meal, value) => {
        setInputValues(prev => ({ ...prev, [meal.strMeal]: value }));
    };

    // 创建发送请求到后端的函数
    const sendUpdateToServer = async (meal, value) => {
        // 准备要发送的数据
        const updatedMeal = {
            idMeal: meal.idMeal,
            numMeal: Number(value),
            baseAmount: meal.baseAmount
        };

        try {
            if (isEmail) {
                // 已登录用户：发送请求到后端
                let result = await (await axiosInstanceWithTokenCheck()).post(
                    "http://localhost:5000/api/update",
                    { event: "update", updatedItems: updatedMeal }
                );

                // 处理服务器响应
                if (result) {
                    if (result.data.status === "update") {
                        // 同步服务器返回的结果
                        setCartData(result.data.result);
                        setCartItem(result.data.result.totalItem);
                    } else if (result.data.status === "delete") {
                        setCartItem(0);
                        setCartData("");
                    }
                }
            } else {
                // 未登录用户：更新本地数据库
                const db = await initDB();
                let existingCart = await db.get('cart', 'cartData');

                if (existingCart) {
                    if (Number(value) <= 0) {
                        // 如果数量为0，从购物车中移除该商品
                        existingCart.data = existingCart.data.filter(item => item.idMeal !== meal.idMeal);
                    } else {
                        // 否则更新该商品的数量
                        const targetItem = existingCart.data.find(item => item.idMeal === meal.idMeal);
                        if (targetItem) {
                            targetItem.numMeal = Number(value);
                            targetItem.cartAmount = targetItem.numMeal * targetItem.baseAmount;
                        }
                    }

                    // 重新计算总金额和总商品数量
                    existingCart.totalAmount = existingCart.data.reduce(
                        (sum, item) => sum + item.cartAmount,
                        0
                    );
                    existingCart.totalAmount = Number(existingCart.totalAmount.toFixed(2));
                    existingCart.totalItem = existingCart.data.reduce(
                        (sum, item) => sum + item.numMeal,
                        0
                    );

                    // 更新本地状态
                    setCartData(existingCart);
                    setCartItem(existingCart.totalItem);

                    // 更新IndexedDB
                    await updateDB(Object.assign(existingCart, { idMeal: 'cartData' }));
                }
            }
        } catch (error) {
            console.error("Error:", error);
            // 如果发生错误，可以考虑回滚本地状态
        }
    };

    // 使用 debounceRAF 创建防抖版本的服务器更新函数
    // 使用 useCallback 确保函数引用稳定，避免重复创建
    const debouncedSendUpdate = useCallback(
        debounceRAF(sendUpdateToServer, 500)
        , []);

    // 修改 handleChangeValue 函数为 Optimistic Update 模式
    const handleChangeValue = (meal, value) => {
        // 1. 首先立即更新本地状态（乐观更新）
        setCartData(prevCartData => {
            if (!prevCartData) return prevCartData;

            let updatedData;
            const numValue = Number(value);

            // 直接处理删除和更新的逻辑
            if (numValue <= 0) {
                // 如果数量为0或负数，直接从列表中过滤掉该商品
                updatedData = prevCartData.data.filter(item => item.idMeal !== meal.idMeal);
            } else {
                // 只更新数量
                updatedData = prevCartData.data.map(item =>
                    item.idMeal === meal.idMeal
                        ? { ...item, numMeal: numValue }
                        : item
                );
            }

            // 重新计算总金额和总商品数量
            const newTotalAmount = updatedData.reduce(
                (sum, item) => sum + (item.baseAmount * item.numMeal),
                0
            );
            const newTotalItem = updatedData.reduce(
                (sum, item) => sum + item.numMeal,
                0
            );

            // 返回更新后的购物车数据
            return {
                ...prevCartData,
                data: updatedData,
                totalAmount: Number(newTotalAmount.toFixed(2)),
                totalItem: newTotalItem
            };
        });

        // 更新导航栏中的购物车数量
        setCartItem(prev => {
            // 计算差值：新值 - 旧值
            const diff = Number(value) - meal.numMeal;
            return Math.max(0, prev + diff);
        });
        debouncedSendUpdate(meal, value);
    };


    const handleCheckbox = (items, isChecked) => {
        // Ensure items is an array (if single item is passed)
        const itemsArray = Array.isArray(items) ? items : [items];
        // Update local state first
        setCartData(prevCartData => {
            if (!prevCartData) return prevCartData;

            const newData = {
                ...prevCartData,
                data: prevCartData.data.map(dataItem => {
                    // Check if this item should be updated
                    const shouldUpdate = itemsArray.some(item => item.idMeal === dataItem.idMeal);
                    return shouldUpdate
                        ? { ...dataItem, checked: isChecked }
                        : dataItem;
                })
            };

            return newData;
        });

        // Update server state
        (async () => {
            try {
                // Create an array of update requests
                const response = await (await axiosInstanceWithTokenCheck()).post(
                    "http://localhost:5000/api/update",
                    {
                        event: "checkMultiple",
                        updatedItems: itemsArray.map(item => ({
                            ...item,
                            checked: isChecked
                        }))
                    }
                );

                if (response?.data?.status === "checked" || response?.data?.status === "uncheck") {
                    setCartData(response.data.result);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        })()

    };

    const handleCheckAll = () => {
        const uncheckedItems = cartData.data.filter((item) => !item.checked);
        handleCheckbox(
            uncheckedItems.length > 0 ? uncheckedItems : cartData.data,
            uncheckedItems.length > 0
        );
    }

    const allchecked = useMemo(() =>
        cartData ? !cartData.data.some(item => !item.checked) : false
        , [cartData]);
    // useEffect(() => {
    //     if (isEmail && isEmail === true) {
    //         //load cart item when login
    //         if (!loading && !error && cart && cart.cartpageformat && cart.cartpageformat.length > 0) {
    //             setCartData(cart.cartpageformat[0]);
    //             // handleCheckbox(cartData.data.map,false)
    //         } else {
    //             setCartData("")
    //         }
    //     } else if (isEmail === false) {
    //         //load cart item when not login
    //         const loadCart = async () => {
    //             const db = await initDB();
    //             let existingCart = await db.get('cart', 'cartData');
    //             if (existingCart) {
    //                 setCartData(existingCart)
    //             }
    //         };
    //         loadCart();
    //     }
    // }, [loading, error, cart, isEmail]);



    useEffect(() => {
        const loadCartData = async () => {
            if (isEmail === true) {
                if (!loading && !error && cart?.cartpageformat?.length > 0) {
                    const cartInfo = cart.cartpageformat[0];
                    const updatedCartData = {
                        ...cartInfo,
                        data: cartInfo.data.map(item => ({
                            ...item,
                            checked: false
                        }))
                    };

                    setCartData(updatedCartData);

                    const checkedItems = cartInfo.data.filter(item => item.checked === true);
                    if (checkedItems.length > 0) {
                        handleCheckbox(checkedItems, false);
                    }
                } else {
                    setCartData("");
                }
            } else if (isEmail === false) {
                const db = await initDB();
                const existingCart = await db.get('cart', 'cartData');
                if (existingCart) {
                    setCartData(existingCart);
                }
            }
        };

        loadCartData();
    }, [loading, error, cart, isEmail]);



    //Since both logged-in and non-logged-in states use the same data format,
    //the method of handling input values is the same.
    //set input value after loading cartData
    useEffect(() => {
        if (cartData) {
            const initialInputValues = {};
            cartData.data.forEach(item => {
                initialInputValues[item.strMeal] = item.numMeal;
            });
            setInputValues(initialInputValues);
        }
    }, [cartData]);


    const handleCheckout = () => {
        if (!cartData?.data?.some(item => item.checked)) {
            toast({
                title: "Please select at least one item for checkout.",
                status: "error",
                duration: 2000,
            });
            return;
        }

        // 使用 navigate 而不是 window.location.href
        navigate('/checkout#deliver');
    }





    //use apollo to load data
    if (loading) {
        return <Box>Loading...</Box>;
    } else if (error) {
        return <Box>Error Occurred</Box>;
    }

    if (!cartData || cartData.totalItem === 0) {
        return <Box width="100%"><Box textStyle="StyledH2" color="#000000" margin="0 auto" width="fit-content">Your Cart is Empty</Box></Box>
    }

    return (
        <VStack width="100%">
            <CartPageHeading numItem={cartData.totalItem} />
            <Stack direction={{ xl: "row", base: "column" }} width="100%" alignItems="flex-start" spacing={6}>
                <Box width={{ xl: "75%", base: "100%" }}>
                    <Table display={{ md: "table", base: "block" }} width="100%">
                        <Thead display={{ md: "table-header-group", base: "none" }}>
                            <Tr>
                                <Th><Checkbox
                                    isChecked={allchecked}
                                    onChange={(e) =>
                                        handleCheckAll()
                                    }
                                ></Checkbox></Th>
                                <Th colSpan={3}>Item</Th>
                                <Th>Price</Th>
                                <Th>Quantity</Th>
                                <Th>Total</Th>
                            </Tr>
                        </Thead>
                        <Tbody display={{ md: "table-row-group", base: "block" }}>
                            {cartData.data.map((item, index) => (
                                // <Checkbox>
                                <Tr key={index}
                                    borderBottomWidth="1px"
                                    display={{ md: "table-row", base: "grid" }}
                                    gridTemplateAreas={{
                                        md: "none",
                                        sm: `
                                "check img meal meal meal"
                                "check img price quantity total"
                                `,
                                        base: `
                                    "check img meal"
                                    "check price price"
                                    "check quantity quantity"
                                    "check total total"
                                `
                                    }}
                                >
                                    <Td
                                        colSpan={1}
                                        gridArea={"check"}
                                        display={{ md: "table-cell", base: "block" }}
                                        paddingLeft="0"
                                        paddingRight="0"
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                        width="1.5rem"
                                    >
                                        <Box>
                                            <Checkbox
                                                key={index}
                                                isChecked={item.checked}
                                                onChange={(e) => handleCheckbox(item, e.target.checked)}
                                            ></Checkbox>
                                        </Box>
                                    </Td>
                                    <Td
                                        colSpan={1}
                                        gridArea={"img"}
                                        display={{ md: "table-cell", base: "block" }}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                        width={`${cartPageConfig.orderImgWidth}px`}
                                        padding={{ md: "1.5rem", base: "0" }}
                                    >
                                        <Box width={`${cartPageConfig.orderImgWidth}px`}>
                                            <LazyLoadImage
                                                src={item.strMealThumb}
                                                alt={item.strMeal}
                                                width="auto"
                                                imgWidth={cartPageConfig.orderImgWidth}
                                                auto="webp"
                                                height={`${cartPageConfig.orderImgWidth}px`}
                                                objectFit="cover"
                                            />
                                        </Box>
                                    </Td>
                                    <Td colSpan={2} gridArea={"meal"} display={{ md: "table-cell", base: "flex" }} flexDirection="row" borderBottomWidth={{ md: "1px", base: "0" }} alignItems="center" paddingLeft="0" paddingRight="0">
                                        <Box textStyle="StyledText" color="#333333">
                                            {item.strMeal}
                                        </Box>
                                        <Button
                                            backgroundColor="#e5e5e5"
                                            borderRadius="50%"
                                            size="xs"
                                            //set meal number to 0
                                            //use async/await to prevent Race Condition
                                            onClick={() => handleChangeValue(item, 0)}
                                            display={{ md: "none", base: "block" }}
                                            marginLeft="1rem"
                                        ><SmallCloseIcon color="#757575" /></Button>
                                    </Td>
                                    <Td
                                        gridArea={"price"}
                                        display={{ md: "table-cell", base: "flex" }}
                                        flexDirection={{ md: "none", sm: "column", base: "row" }}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                    >
                                        <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Price</Text>
                                        <Box>${item.baseAmount}</Box>
                                    </Td>
                                    <Td
                                        gridArea={"quantity"}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                        display={{ md: "table-cell", base: "flex" }}
                                        flexDirection={{ md: "none", sm: "column", base: "row" }}
                                    >
                                        <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Quantity</Text>
                                        <HStack>
                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                fontSize="1.5rem"
                                                size="md"
                                                //use async/await to prevent Race Condition
                                                onClick={() => {
                                                    handleChangeValue(item, item.numMeal - 1)
                                                }}>-</Button>
                                            <Input
                                                maxWidth="8vh"
                                                width="8vh"
                                                textAlign="center"
                                                value={inputValues[item.strMeal]}
                                                //can change the input number through typing, but the fetch will only be triggered on blur
                                                onChange={(e) => { handleInputChange(item, e.target.value) }}
                                                onBlur={(e) => handleChangeValue(item, Number(e.target.value))}
                                            />

                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                fontSize="1.5rem"
                                                size="md"
                                                //use async/await to prevent Race Condition
                                                onClick={() => handleChangeValue(item, item.numMeal + 1)}
                                            >+</Button>
                                        </HStack>
                                    </Td>
                                    <Td
                                        gridArea={"total"}
                                        display={{ md: "table-cell", base: "flex" }}
                                        flexDirection={{ md: "none", sm: "column", base: "row" }}
                                        borderBottomWidth={{ md: "1px", base: "0" }}
                                    >
                                        <Text as="span" display={{ md: "none", base: "block" }} marginRight={{ md: "0", base: "1rem" }} width={{ sm: "100%", base: "33.33%" }} align={{ sm: "left", base: "right" }} paddingLeft="0" paddingRight="0">Total</Text>
                                        <HStack justifyContent={{ md: "right", base: "none" }}>
                                            <Box gridArea={"total"}>${Number((item.baseAmount * item.numMeal).toFixed(2))}</Box>
                                            <Button
                                                backgroundColor="#e5e5e5"
                                                borderRadius="50%"
                                                size="xs"
                                                //set meal number to 0
                                                //use async/await to prevent Race Condition
                                                onClick={async () => {
                                                    await handleChangeValue(item, 0)
                                                    // await setIsUpdate(isUpdate + 1)
                                                }}
                                                gridArea={"delete"}
                                                display={{ md: "block", base: "none" }}
                                            ><SmallCloseIcon color="#757575" /></Button>
                                        </HStack>
                                    </Td>
                                </Tr>
                                // </Checkbox>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
                <Box width={{ xl: "25%", md: "50%", base: "100%" }}>
                    <Table>
                        <Thead>
                            <Th>Order Summary</Th>
                            <Th>{cartData.checkedItem} {cartData.checkedItem > 1 ? `Items` : `Item`}</Th>
                        </Thead>
                    </Table>
                    <HStack justifyContent="space-between">
                        <Box>Subtotal</Box>
                        <Box>${cartData.checkedAmount}</Box>
                    </HStack>
                    <HStack justifyContent="space-between">
                        <Box>Grand total</Box>
                        <Box>${cartData.checkedAmount}</Box>
                    </HStack>
                    <Button
                        color="#ffffff"
                        backgroundColor="#da1a32"
                        border="1px solid #da1a32"
                        width="100%"
                        marginTop="1vh"
                        _hover={{
                            color: "#da1a32",
                            backgroundColor: "#ffffff"
                        }}
                        onClick={handleCheckout}
                        disabled={!cartData?.data?.some(item => item.checked)}
                    >
                        CHECKOUT
                    </Button>
                </Box>
            </Stack>
        </VStack>
    );
};

export default CartPage;

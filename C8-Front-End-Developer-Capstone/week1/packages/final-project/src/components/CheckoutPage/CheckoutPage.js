import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Collapse, FormControl, Grid, GridItem, HStack, Image, Input, InputGroup, Radio, RadioGroup, Stack, Text, useToast, VStack } from '@chakra-ui/react';
import React, { lazy, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcAmex, faCcJcb, faCcMastercard, faCcVisa } from "@fortawesome/free-brands-svg-icons";
import { apiClient } from '../provider/axiosInstanceWithTokenCheck';
import { ModalContext } from '../provider/ModalContext';
// const AddAddress = lazy(() => import("../CheckoutPage/AddressInfo/AddAddress"))
import OrderSummary from './OrderSummary';
import OrderSummaryPrice from './OrderSummaryPrice';
import checkoutPageConfig from './config/checkoutPageConfig';
import AddressInfo from './AddressInfo/AddressInfo';
import { Modal, ModalButton, ModalContent } from "../provider/ModalsSystem.js";
import { useUserRotate } from '../provider/JwtTokenRotate.js';
import ShippingPage from './ShippingPage.js';
import navConfig from '../Nav/config/navConfig.js';
import AddAddress from './AddressInfo/AddAddress.js';


const CheckoutPage = ({ itemInfo, useDraft }) => {
  const location = useLocation();
  const toast = useToast();
  const { fname, identifier, isEmail, availableAccessToken } = useUserRotate();
  const [section, setSection] = useState('');
  const {
    allAddressInfo,
  } = useContext(ModalContext);

const navigate=useNavigate()


  const [activeCards, setActiveCards] = useState({
    mastercard: false,
    visa: false,
    amex: false,
    jcb: false
  });

  // Card validation patterns
  const cardPatterns = {
    visa: /^4/,
    mastercard: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/,
    amex: /^3[47]/,
    jcb: /^35/
  };




  const { register, handleSubmit, control, watch, trigger, formState: { errors, isValid }, setValue } = useFormContext()

  const selectedAddress = watch("selectedAddress")
  // console.log(selectedAddress, "selectedAddress", allAddressInfo, "allAddressInfo", allAddressInfo.shippingInfo.filter(item => item.uuid === selectedAddress), "t");

  // Function to handle card number input
  const handleCardNumberChange = (e) => {
    // Remove non-digit characters
    const value = e.target.value.replace(/\D/g, '');
    // Limit to 16 digits
    const truncatedValue = value.slice(0, 16);

    // Update form value
    setValue("cardNumber", truncatedValue);

    // Reset all cards to inactive
    const newActiveCards = {
      mastercard: false,
      visa: false,
      amex: false,
      jcb: false
    };

    // Early detection of card type
    if (truncatedValue.length >= 2) {
      Object.entries(cardPatterns).forEach(([card, pattern]) => {
        if (pattern.test(truncatedValue)) {
          newActiveCards[card] = true;
        }
      });
    }

    setActiveCards(newActiveCards);
    console.log("activeCards", activeCards, "truncatedValue", truncatedValue, "e", e);

  };

  const payment = watch('payment');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    setSection(hash);
  }, [location]);


  const onSubmit = async (data) => {
    console.log("submit work!!");
    const addressInfo = allAddressInfo.shippingInfo.filter(item => item.uuid === selectedAddress)[0]
    try {
      const requestBody = {
        ...data,
        identifier: identifier,
        orderAmount: itemInfo.checkedAmount,
        orderItem: itemInfo.checkedItem,
        addressInfo: addressInfo,
        useDraft: useDraft,
        // itemInfo: itemInfo.info
      };
      const result = await apiClient.post("http://localhost:5000/checkout/checkout", requestBody);
      if (result.status === 200) {
        toast({ title: "Submit success", status: "success", duration: 2000 });
        setTimeout(() => {
          // window.location.href = "./"
          navigate("/")
        }, 2000)
      }

    } catch (error) {
      toast({ title: "Something went wrong", status: "error", duration: 2000 });
      console.error("Error:", error);
    }

  }

  const editBoxRef = useRef({})
  useEffect(() => {
    allAddressInfo.shippingInfo.forEach(address => {
      if (!editBoxRef.current[address.uuid]) {
        editBoxRef.current[address.uuid] = React.createRef();
      }
    });
  }, [allAddressInfo])


  console.log(itemInfo, "itemInfo", allAddressInfo, "allAddressInfo");


  return (
    <>
      <Box
        margin="3vh 0"
        width="100%"
        height="100%"
      >
        <Grid
          templateColumns="1fr 1fr"
          templateRows="1fr 1fr"
          gridTemplateAreas={{

            [navConfig.showNavSize]:
              `
           "main orderSummary"
           "main orderSummary"
           `,
            base:
              `
           "main main"
           "main main"
           `
          }}
        >
          <GridItem gridArea={"main"} fontSize={{ base: "1.5em", lg: "2em" }}>
            <Box margin={{ [navConfig.showNavSize]: "0 3vh 0 0", base: "0" }}>
              <Box as="h2" textStyle="StyledH2" color="black">
                Address
              </Box>
              <AddressInfo allAddressInfo={allAddressInfo} />
              <Modal id="address">
                <ModalButton textStyle="StyledText" textColor="hsl(204, 76.90%, 39.00%)" backgroundColor="">
                  + New Address
                </ModalButton>
                <ModalContent>
                  <AddAddress operateAddress={"create"} allAddress={allAddressInfo.shippingInfo} />
                </ModalContent>
              </Modal>
              <Box margin="2vh 0">
                <ShippingPage itemInfo={itemInfo} />
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  id='payment'
                  margin="2vh 0"
                >
                  <Box as="h2" textStyle="StyledH2" color="black">
                    Payment
                  </Box>
                  <Stack
                    padding="1rem"
                    backgroundColor="hsl(0,0%,0%,.045)"
                    border="1px solid hsl(0,0%,0%,.045)"
                    borderRadius="10px"
                  >
                    <FormControl isInvalid={!!errors.payment} mb={4}>
                      <Text>Payment Method*</Text>
                      <Box
                        backgroundColor="#ffffff"
                      >
                        <Controller
                          name="payment"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              onChange={(val) => field.onChange(val)}
                            >
                              <VStack alignItems="start" id="v">
                                <Radio value='cash' width="100%" height="3vh">
                                  <Box fontSize="1.2em">
                                    Cash
                                  </Box>
                                </Radio>
                                <Radio
                                  value='card'
                                  height="3vh"
                                >
                                  <HStack width="100%">
                                    <Box fontSize="1.2em">
                                      Credit Card
                                    </Box>
                                    <HStack>
                                      <FontAwesomeIcon
                                        icon={faCcMastercard}
                                        size='xl'
                                        style={{ color: activeCards.mastercard ? "#74C0FC" : "#969696" }}
                                      />
                                      <FontAwesomeIcon
                                        icon={faCcVisa}
                                        size='xl'
                                        style={{ color: activeCards.visa ? "#74C0FC" : "#969696" }}
                                      />
                                      <FontAwesomeIcon
                                        icon={faCcAmex}
                                        size='xl'
                                        style={{ color: activeCards.amex ? "#74C0FC" : "#969696" }}
                                      />
                                      <FontAwesomeIcon
                                        icon={faCcJcb}
                                        size='xl'
                                        style={{ color: activeCards.jcb ? "#74C0FC" : "#969696" }}
                                      />
                                    </HStack>
                                  </HStack>
                                </Radio>
                              </VStack>
                            </RadioGroup>
                          )}
                        />
                        {errors.payment && (
                          <Text textStyle="StyledErrorMessage">{errors.payment.message}</Text>
                        )}
                      </Box>
                    </FormControl>
                    <Accordion allowToggle index={payment === 'card' ? 0 : -1} >
                      <AccordionItem border="none">
                        <AccordionButton height="0" padding="0" visibility="hidden" />
                        <AccordionPanel pb={4}>
                          <Stack
                            alignItems="start"
                            width="100%"
                          >
                            <Box width="100%">
                              <Controller
                                name="cardNumber"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder="Credit Card Number"
                                    width="100%"
                                    backgroundColor="#ffffff"
                                    maxLength={16}
                                    onChange={(e) => {
                                      handleCardNumberChange(e);
                                      field.onChange(e);
                                    }}
                                  />
                                )}
                              />
                              {errors.cardNumber && <Text textStyle="StyledErrorMessage">{errors.cardNumber.message}</Text>}
                            </Box>
                            <HStack width="100%">
                              <VStack width="100%">
                                <Box width="100%">
                                  <Controller
                                    name="expire"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Expire(MM/YY)"
                                        width="100%"
                                        backgroundColor="#ffffff"
                                        maxLength={5}
                                        value={field.value || ''}
                                        onChange={(e) => {
                                          let value = e.target.value.replace(/\D/g, '')

                                          const isDeletion = value.length < (field.value || '').length;
                                          console.log(value, field.value, value.length, "value", isDeletion, "isDeletion");
                                          // 添加斜杠分隔符
                                          if (!isDeletion) {
                                            if (value.length == 2) {
                                              value = value.slice(0, 2) + '/'
                                              console.log("value.length == 2");
                                            } else if (value.length > 2) {
                                              value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                              console.log("value.length > 2");
                                            }
                                            if (value.length > 5) value = value.slice(0, 5);
                                            field.onChange(value);
                                          } else {
                                            if (value.length > 2) {
                                              value = value.slice(0, 2) + "/" + value.slice(2, 3);
                                            } else {
                                              value = value.slice(0, 2)
                                            }
                                            field.onChange(value);
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === '/') e.preventDefault();
                                        }}
                                      />
                                    )}
                                  />
                                  {errors.expire && <Text textStyle="StyledErrorMessage">{errors.expire.message}</Text>}
                                </Box>
                              </VStack>
                              <VStack width="100%">
                                <Box width="100%">
                                  <Controller
                                    name="cvv"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        type="number"
                                        placeholder="CVV"
                                        width="100%"
                                        backgroundColor="#ffffff"
                                        maxLength={4}
                                        onChange={(e) => {
                                          // 只允許數字輸入
                                          const value = e.target.value.replace(/\D/g, '');
                                          field.onChange(value);
                                        }}
                                      />
                                    )}
                                  />
                                  {errors.cvv && <Text textStyle="StyledErrorMessage">{errors.cvv.message}</Text>}
                                </Box>
                              </VStack>
                            </HStack>
                          </Stack>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </Stack>


                  <Box fontSize="20px" width="auto" textStyle="StyledText" color="#000000">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </Box>
                  <VStack display={{ [navConfig.showNavSize]: "none", base: "block" }}>
                    <Box as="h2" textStyle="StyledH2" color="black" marginTop="2vh">
                      Order Summary
                    </Box>
                    <Accordion allowMultiple borderColor={checkoutPageConfig.accordionBackgroundColor}>
                      <AccordionItem>
                        {({ isExpanded }) => (
                          <>
                            <AccordionButton _hover={{ backgroundColor: checkoutPageConfig.accordionBackgroundColor }} paddingLeft="0" paddingRight="0">
                              <HStack
                                textStyle="StyledText"
                                color="#000000"
                                width="100%"
                                justifyContent="space-between"
                              >
                                {isExpanded ? <><Box>
                                  Show
                                </Box></> : <><Box>
                                  Close
                                </Box></>}

                                <AccordionIcon />
                              </HStack>
                            </AccordionButton>
                            <AccordionPanel>
                              <VStack
                                paddingTop="20px"
                              >
                                <OrderSummary itemInfo={itemInfo} />
                              </VStack>
                            </AccordionPanel>
                          </>
                        )}
                      </AccordionItem>

                    </Accordion>
                    <VStack fontSize="18px" width="100%" textStyle="StyledText" color="#000000">
                      <OrderSummaryPrice itemInfo={itemInfo} />
                    </VStack>
                  </VStack>

                  <Button margin="2vh 0" type="submit" width="100%">Submit</Button>
                </Box>
              </form>

            </Box>
          </GridItem >
          <GridItem
            gridArea={"orderSummary"}
            display={{ [navConfig.showNavSize]: "block", base: "none" }}
            backgroundColor="#f5f5f5"
          >
            <Box
              height="100%"
              margin="3vh"
            >
              <Box
                top="80px"
                position="sticky"
              >
                <VStack>
                  <OrderSummary itemInfo={itemInfo} />
                  <VStack fontSize="18px" width="100%" textStyle="StyledText" color="#000000">
                    <OrderSummaryPrice itemInfo={itemInfo} />
                  </VStack>
                </VStack>
              </Box>
            </Box>
          </GridItem>
        </Grid >
      </Box >
    </>
  );
};

export default CheckoutPage;

import { Box, Button, FormControl, HStack, Input, InputGroup, Radio, RadioGroup, Stack, Text, useToast, VStack } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserRotate } from '../provider/JwtTokenRotate';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcAmex, faCcJcb, faCcMastercard, faCcVisa } from "@fortawesome/free-brands-svg-icons";
import axios from 'axios';
import { apiClient } from '../provider/axiosInstanceWithTokenCheck';
import { ModalContext } from '../provider/ModalContext';
import { GlobalContext } from '../provider/GlobalModalContext';

const Payment = () => {
  const location = useLocation();
  const toast = useToast();
  const [section, setSection] = useState('');
  const { fname, email, availableAccessToken } = useUserRotate();
  const { modalOpen, setModalOpen, setLoadNewAddress } = useContext(ModalContext);
  const { setModalState } = useContext(GlobalContext);


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
  const schema = yup.object().shape({
    phone: yup.string()
      .required('Phone number is required') // 必填驗證
      .matches(/^[0-9]+$/, 'Phone number must contain only digits') // 確保只包含數字 (可選，但推薦)
      .min(8, 'Phone number must be at least 8 digits') // 最少位數，例如台灣通常 8-10 位
      .max(15, 'Phone number cannot exceed 15 digits'), // 最多位數，考慮國際電話號碼
    address1: yup.string().required('address is required'),
    address2: yup.string(),
    city: yup.string().required('city is required'),
    country: yup.string().required('country is required'),
    payment: yup.string().oneOf(['cash', 'card'], 'Select a payment method').required('Payment method is required'),
    cardNumber: yup.string().when('payment', {
      is: (value) => value === 'card',
      then: () => yup.string()
        .matches(/^[0-9]{13,16}$/, 'Card number must be 13-16 digits')
        .required('Card number is required'),
      otherwise: () => yup.string()
    }),
    expire: yup.string().when('payment', {
      is: (value) => value === 'card',
      then: () => yup.string()
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format')
        .required('Expiry date is required'),
      otherwise: () => yup.string()
    }),
    cvv: yup.string().when('payment', {
      is: (value) => value === 'card',
      then: () => yup.string()
        .matches(/^[0-9]{3,4}$/, 'CVV must be 3-4 digits')
        .required('CVV is required'),
      otherwise: () => yup.string()
    })
  });

  const { register, handleSubmit, control, watch, trigger, formState: { errors, isValid }, setValue } = useForm({
    mode: 'onChange', // Real-time validation
    resolver: yupResolver(schema),
    // context: { payment: watch('payment') },
    mode: 'onBlur',
    defaultValues: {
      payment: 'cash',
    }
  });
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
  const cardNumber = watch('cardNumber');
  const expire = watch('expire');
  const cvv = watch('cvv');





  const paymentRef = useRef();
  useEffect(() => {
    // Set a timer to check if the input value has been autofilled.
    const timer = setTimeout(() => {
      const refs = [paymentRef];
      const values = [payment];

      refs.forEach((ref, index) => {
        if (ref.current && ref.current.value !== values[index]) {
          ref.current.value = values[index];
        }
      });
    }, 100);

    // Cleanup function will run when the component unmounts or when the dependencies of useEffect change.
    return () => clearTimeout(timer);
  }, [payment]);

  const onSubmit = async (data) => {
    console.log("submit work!!");
    try {
      const requestBody = {
        ...data,
        address: getCombinedAddress()
      };
      const result = await apiClient.post("http://localhost:5000/checkout/checkout", requestBody);
      if (result.status === 200) {
        toast({ title: "Submit success", status: "success", duration: 2000 });
      }

    } catch (error) {
      console.error("Error:", error);
    }

  }

  return (
    <Box
      margin="3vh auto"
      width="70%"
      height="80vh"
      backgroundColor="gray.200"
    >
      <VStack
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        marginTop="3vh"
      >
        <Box as="h1" textStyle="StyledH1" textAlign="center" color="#F4CE14">
          Checkout Page
        </Box>
        <Box
          bg="white"
          // padding={10}
          rounded="md"
          height="auto"
          width={{ base: "90%", md: "468px" }}
          fontSize={{ base: "1.5em", lg: "2em" }}
        >
          <HStack>
            <Box margin="3vh" >

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box id='payment'>
                  <Box as="h2" textStyle="StyledH2" color="black">
                    Payment
                  </Box>
                  <Stack>
                    <FormControl isInvalid={!!errors.payment} mb={4}>
                      <Text>Payment Method*</Text>
                      <Controller
                        name="payment"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            onChange={(val) => field.onChange(val)}
                          >
                            <Radio value='cash' mr={4}>Cash</Radio>
                            <Radio value='card'>Credit card</Radio>
                          </RadioGroup>
                        )}
                      />
                      {errors.payment && (
                        <FormErrorMessage>{errors.payment.message}</FormErrorMessage>
                      )}
                    </FormControl>

                    {payment === 'card' && (
                      <Box>
                        <Stack alignItems="start">
                          <VStack>
                            <Box>
                              Credit Card Number
                            </Box>
                            <Box>
                              <HStack>
                                <FontAwesomeIcon
                                  icon={faCcMastercard}
                                  style={{ color: activeCards.mastercard ? "#74C0FC" : "#969696" }}
                                />
                                <FontAwesomeIcon
                                  icon={faCcVisa}
                                  style={{ color: activeCards.visa ? "#74C0FC" : "#969696" }}
                                />
                                <FontAwesomeIcon
                                  icon={faCcAmex}
                                  style={{ color: activeCards.amex ? "#74C0FC" : "#969696" }}
                                />
                                <FontAwesomeIcon
                                  icon={faCcJcb}
                                  style={{ color: activeCards.jcb ? "#74C0FC" : "#969696" }}
                                />
                              </HStack>
                            </Box>
                            <Box>
                              <Controller
                                name="cardNumber"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="Number"
                                    width="100%"
                                    maxLength={16}
                                    onChange={(e) => {
                                      handleCardNumberChange(e);
                                      field.onChange(e);
                                    }}
                                  />
                                )}
                              />
                              {errors.cardNumber && <p>{errors.cardNumber.message}</p>}
                            </Box>
                          </VStack>
                          <HStack>
                            <VStack>
                              <Box>
                                Expire
                              </Box>
                              <Box>
                                <Controller
                                  name="expire"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      type="text"
                                      placeholder="MM/YY"
                                      width="100%"
                                      onChange={(e) => {
                                        // 可以在這裡添加額外的驗證邏輯，例如自動格式化為 MM/YY
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 4) {
                                          const formattedValue = value.length > 2
                                            ? value.slice(0, 2) + '/' + value.slice(2)
                                            : value;
                                          field.onChange(formattedValue);
                                        }
                                      }}
                                    />
                                  )}
                                />
                                {errors.expire && <p>{errors.expire.message}</p>}
                              </Box>
                            </VStack>
                            <VStack>
                              <Box>
                                CVV
                              </Box>
                              <Box>
                                <Controller
                                  name="cvv"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      type="password"
                                      placeholder="CVV"
                                      width="100%"
                                      maxLength={4}
                                      onChange={(e) => {
                                        // 只允許數字輸入
                                        const value = e.target.value.replace(/\D/g, '');
                                        field.onChange(value);
                                      }}
                                    />
                                  )}
                                />
                                {errors.cvv && <p>{errors.cvv.message}</p>}
                              </Box>
                            </VStack>
                          </HStack>
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                  <Button type="submit">Submit</Button>
                </Box>
              </form>
            </Box>
            <Box backgroundColor="grey">
              <Text>
                total
              </Text>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Payment;

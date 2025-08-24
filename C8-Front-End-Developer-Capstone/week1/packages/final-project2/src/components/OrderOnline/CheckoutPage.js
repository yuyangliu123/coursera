import { Box, Button, FormControl, Input, InputGroup, Radio, RadioGroup, Stack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserRotate } from '../provider/JwtTokenRotate';

const CheckoutPage = () => {
  const location = useLocation();
  const [section, setSection] = useState('');
  const { fname, email, availableAccessToken } = useUserRotate();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    setSection(hash);
  }, [location]);

  return (
    <VStack
      flexDirection="column"
      width="70%"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Box as="h1" textStyle="StyledH1" textAlign="center" color="#F4CE14">
        Checkout Page
      </Box>
      <Box bg="white" padding={10} rounded="md" height="auto" minW={{ base: "90%", md: "468px" }} fontSize={{ base: "1.5em", lg: "2em" }}>
        <form>
          <Box display={section === "deliver" ? "block" : "none"}>
            <Box as="h2" textStyle="StyledH2" color="black">
              Shipping
            </Box>
            {!availableAccessToken &&
              <>
                <FormControl>
                  <Input name="fname" placeholder='First Name' defaultValue={fname} />
                </FormControl>
                <FormControl>
                  <Input name="email" placeholder='Email' defaultValue={email} />
                </FormControl>
              </>
            }
            <Stack>
              <Text>Contact number*</Text>
              <FormControl>
                <InputGroup>
                  <Input type="text" placeholder="Contact number*" width="100%" />
                </InputGroup>
              </FormControl>
            </Stack>
            <Stack>
              <Text>Address line 1*</Text>
              <FormControl>
                <InputGroup>
                  <Input type="text" placeholder="Address line 1*" width="100%" />
                </InputGroup>
              </FormControl>
            </Stack>
            <Stack>
              <Text>Address line 2</Text>
              <FormControl>
                <InputGroup>
                  <Input type="text" placeholder="Address line 2" width="100%" />
                </InputGroup>
              </FormControl>
            </Stack>
            <Stack>
              <Text>Town/City</Text>
              <FormControl>
                <InputGroup>
                  <Input type="text" placeholder="Town/City" width="100%" />
                </InputGroup>
              </FormControl>
            </Stack>
            <Stack>
              <Text>County/State</Text>
              <FormControl>
                <InputGroup>
                  <Input type="text" placeholder="County/State" width="100%" />
                </InputGroup>
              </FormControl>
            </Stack>
            <Link to="/checkout/#payment">
              <Button onClick={() => setSection("payment")}>Continue</Button>
            </Link>
          </Box>
          <Box display={section === "payment" ? "block" : "none"}>
            <Box as="h2" textStyle="StyledH2" color="black">
              Payment
            </Box>
            <Stack>
              <Text>Payment Method*</Text>
              <FormControl>
                <RadioGroup>
                  <Radio value='cash'>Cash</Radio>
                  <Radio value='card'>Credit card</Radio>
                </RadioGroup>
              </FormControl>
            </Stack>
            <Button type="submit">Submit</Button>
          </Box>
        </form>
      </Box>
    </VStack>
  );
};

export default CheckoutPage;

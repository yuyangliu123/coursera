import { Box, Button, Checkbox, HStack, Image, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { useEffect, useState } from "react"
import { useUserRotate } from "../provider/JwtTokenRotate";
import LazyLoadImage from '../provider/LazyLoadImage';
import { HashLink } from 'react-router-hash-link';



const Account = ({ initialData }) => {
  const [myOrder, setMyOrder] = useState([])
  const { fname, email, availableAccessToken } = useUserRotate();

  const tableHeader = [
    {
      name: "order Number"
    },
    {
      name: "Order Date"
    },
    {
      name: "Quantity"
    },
    {
      name: "Price"
    }
  ]

  return (
    <>
      <Box>
        <Table width="100%">
          <Thead>
            <Tr>
              {tableHeader.map((element) => {
                return (
                  <>
                    <Th paddingLeft="0">{element.name}</Th>
                  </>
                )
              })}
            </Tr>
          </Thead>
          <Tbody>
            {initialData.map((item, index) => (
              // <Checkbox>
              <Tr key={index}
                borderBottomWidth="1px"
                gridTemplateAreas={{
                  // md: "none",
                  base: `
                                "orderNumber createdAt quantity price"
                                `,
                  // base: `
                  //                   "meal"
                  //                   "price price price"
                  //                   "quantity quantity quantity"
                  //                   "total total total"
                  //               `
                }}
              >
                <Td
                  gridArea={"orderNumber"}
                  borderBottomWidth={{ md: "1px", base: "0" }}
                  // alignItems="center"
                  paddingLeft="0"
                  paddingRight="0"
                >
                  <HashLink to={`./order/${item.orderUuid}`}>
                    <Box
                      textStyle="StyledText"
                      color="#333333"
                      textDecoration="underline"
                    >
                      #{item.orderNumber}
                    </Box>
                  </HashLink>
                </Td>
                <Td
                  gridArea={"createdAt"}
                  borderBottomWidth={{ md: "1px", base: "0" }}
                  paddingLeft="0"
                  paddingRight="0"
                >
                  <Box>{new Date(item.createdAt).toLocaleDateString()}</Box>
                </Td>
                <Td
                  gridArea={"quantity"}
                  borderBottomWidth={{ md: "1px", base: "0" }}
                  paddingLeft="0"
                  paddingRight="0"
                >
                  <Box gridArea={"total"}>{item.orderItem}</Box>
                </Td>
                <Td
                  gridArea={"price"}
                  borderBottomWidth={{ md: "1px", base: "0" }}
                  paddingLeft="0"
                  paddingRight="0"
                >
                  <Box>${item.orderAmount}</Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  )
}
export default Account
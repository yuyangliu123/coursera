import { lazy, Suspense, useContext, useEffect, useState } from "react"
import { gql, useQuery } from '@apollo/client';

import CheckoutPageSkeleton from "./CheckoutPageSkeleton.js"
import { useUserRotate } from "../provider/JwtTokenRotate.js";
import { ModalContext } from "../provider/ModalContext.js";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import Cookies from 'js-cookie';

const CheckoutPage = lazy(() => import("./CheckoutPage.js"));
const CHECKOUTPAGE_QUERY = gql`
  query Checkoutpageformat($identifier: String, $isEmail: Boolean, $state: String, $useDraft: Boolean, $sessionId: String) {
    checkoutpageformat(identifier: $identifier, isEmail: $isEmail, state: $state, useDraft :$useDraft, sessionId:$sessionId) {
    cart {
      checkedAmount
      checkedItem
      data {
        strMeal
        numMeal
        idMeal
        baseAmount
        cartAmount
        strMealThumb
        checked
      }
}
      shippingInfo {
        addressFname
        addressLname
        phone
        address1
        address2
        city
        country
        uuid
        isDefault
      }
      fee {
        fee {
          basic
          premium
        }
      }
    }
  }
`;


const CheckoutPageContainer = () => {
  const { identifier, isEmail } = useUserRotate();
  const {
    modalOpen,
    setModalOpen,
    operateAddress,
    setOperateAddress,
    setLoadAddAddress,
    loadAddAddress,
    setAllAddressInfo,
    allAddressInfo,
    setLoadDeleteAddress,
    loadDeleteAddress, } = useContext(ModalContext);
  const { setValue } = useFormContext();
  const [initialData, setInitialData] = useState(null);
  const [isDelayed, setIsDelayed] = useState(true);
  const [searchParams] = useSearchParams();
  const useDraft = searchParams.get('useDraft') === 'true';
  const sessionId = Cookies.get('sessionId');
  console.log(identifier, "identifier");

  // const { resource, isDelayed } = useCheckoutData(identifier);
  const { data: cart, loading, error, refetch: fetchlike } = useQuery(CHECKOUTPAGE_QUERY, {
    variables: { identifier: identifier, isEmail, state: "proposal", useDraft, sessionId },
    fetchPolicy: 'cache-and-network',
    skip: !identifier||!isEmail,
    //load cart item when login
    //onCompleted broken, only work when first load
    onCompleted: (data) => {
      console.log(data, "check data", data.checkoutpageformat);

      setTimeout(() => {
        setInitialData(data.checkoutpageformat);
        const initialInput = {};
        data.checkoutpageformat.cart.data.forEach(item => {
          initialInput[item.strMeal] = item.numMeal;
        });
        const { shippingInfo, fee, checkedAmount, checkedItem, checkedItems, shoppingCart } = data.checkoutpageformat;
        const defaultAddress = shippingInfo.find(addr => addr.isDefault === true);
        const [defaultShippingMethod, defaultShippingFee] = Object.entries(fee.fee)[0];
        console.log(data, "check data", data.checkoutpageformat, defaultAddress);
        setAllAddressInfo((prev => ({
          ...prev,
          shippingInfo: data.checkoutpageformat.shippingInfo,
        })));
        setValue('selectedAddress', defaultAddress?.uuid);
        setValue('shippingMethod', defaultShippingMethod);
        setValue('shippingFee', defaultShippingFee);
        setIsDelayed(false);
      }, 300);
    },
    onError: (error) => {
      console.log(error);
      setIsDelayed(false);
    }
  });

  if (isDelayed || loading || !initialData) {
    return <CheckoutPageSkeleton />;
  }

  if (error) {
    return (
      <Box>
        something went wrong
      </Box>
    )
  }


  return (
    <Suspense fallback={<CheckoutPageSkeleton />}>
      <CheckoutPage itemInfo={initialData} useDraft={useDraft} />
    </Suspense>
  );
};



export default CheckoutPageContainer;
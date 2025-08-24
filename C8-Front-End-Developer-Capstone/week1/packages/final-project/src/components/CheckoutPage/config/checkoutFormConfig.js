// src/forms/checkoutFormConfig.js
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const checkoutSchema = yup.object().shape({
    selectedAddress: yup.string().required('Please select an address'),
    shippingMethod: yup.string().oneOf(['basic', 'premium']),
    shippingFee: yup.number(),
    payment: yup.string().oneOf(['cash', 'card'], 'Select a payment method').required('Payment method is required'),
    cardNumber: yup.string().when('payment', {  // 改为 string 类型
        is: (value) => value === 'card',
        then: () => yup.string()
            .test('is-empty-or-valid', 'Card number must be 13-16 digits', (value) => {
                if (!value || value.trim().length === 0) return true;
                return /^[0-9]{13,16}$/.test(value);
            }),
        otherwise: () => yup.string().nullable()
    }),
    expire: yup.string().when('payment', {
        is: (value) => value === 'card',
        then: () => yup.string()
            .test('is-empty-or-valid', 'Expiry must be in MM/YY format', (value) => {
                if (!value || value.trim().length === 0) return true;
                return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
            }),
        otherwise: () => yup.string().nullable()
    }),
    cvv: yup.string().when('payment', {
        is: (value) => value === 'card',
        then: () => yup.string()
            .test('is-empty-or-valid', 'CVV must be 3-4 digits', (value) => {
                if (!value || value.trim().length === 0) return true;
                return /^[0-9]{3,4}$/.test(value);
            }),
        otherwise: () => yup.string().nullable()
    })
});

export const defaultValues = {
    selectedAddress: "",
    payment: 'cash',
    cardNumber: "",  // 初始化为空字符串
    expire: "",      // 初始化为空字符串
    cvv: ""          // 初始化为空字符串
};

export const checkoutFormConfig = {
    mode: 'onBlur',
    resolver: yupResolver(checkoutSchema),
    defaultValues,
};
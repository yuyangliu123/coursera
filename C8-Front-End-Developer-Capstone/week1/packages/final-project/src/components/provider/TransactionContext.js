import React, { createContext, useState, useContext } from 'react';
import { apiClient } from './axiosInstanceWithTokenCheck';

// 创建事务上下文
export const TransactionContext = createContext();

// 事务处理服务
export const transactionService = {
    // 生成唯一的事务ID
    generateTransactionId: () => {
        return 'txn-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    },

    // 开始事务
    beginTransaction: async (transactionId) => {
        try {
            const response = await apiClient.post("http://localhost:5000/transaction/begin", { transactionId });
            return response.data;
        } catch (error) {
            console.error("事务开始失败:", error);
            throw error;
        }
    },

    // 提交事务
    commitTransaction: async (transactionId) => {
        try {
            const response = await apiClient.post("http://localhost:5000/transaction/commit", { transactionId });
            return response.data;
        } catch (error) {
            console.error("事务提交失败:", error);
            throw error;
        }
    },

    // 回滚事务
    rollbackTransaction: async (transactionId) => {
        try {
            const response = await apiClient.post("http://localhost:5000/transaction/rollback", { transactionId });
            return response.data;
        } catch (error) {
            console.error("事务回滚失败:", error);
            throw error;
        }
    }
};

// 结账服务
export const checkoutService = {
    // 验证库存
    validateInventory: async (itemInfo, transactionId) => {
        try {
            const response = await apiClient.post("http://localhost:5000/checkout/validate-inventory", {
                itemInfo,
                transactionId
            });
            return response.data;
        } catch (error) {
            console.error("库存验证失败:", error);
            throw error;
        }
    },

    // 处理支付
    processPayment: async (paymentInfo, transactionId) => {
        try {
            const response = await apiClient.post("http://localhost:5000/checkout/process-payment", {
                ...paymentInfo,
                transactionId
            });
            return response.data;
        } catch (error) {
            console.error("支付处理失败:", error);
            throw error;
        }
    },

    // 创建订单
    createOrder: async (orderInfo, transactionId) => {
        try {
            const response = await apiClient.post("http://localhost:5000/checkout/create-order", {
                ...orderInfo,
                transactionId
            });
            return response.data;
        } catch (error) {
            console.error("订单创建失败:", error);
            throw error;
        }
    }
};

// 事务提供者组件
export const TransactionProvider = ({ children }) => {
    const [transactionState, setTransactionState] = useState({
        transactionId: null,
        status: 'idle', // idle, pending, committed, rolled_back, error
        error: null
    });

    const startTransaction = async () => {
        try {
            const txnId = transactionService.generateTransactionId();
            setTransactionState({ ...transactionState, transactionId: txnId, status: 'pending' });
            await transactionService.beginTransaction(txnId);
            return txnId;
        } catch (error) {
            setTransactionState({ ...transactionState, status: 'error', error });
            throw error;
        }
    };

    const commitTransaction = async (txnId) => {
        try {
            await transactionService.commitTransaction(txnId);
            setTransactionState({ ...transactionState, status: 'committed' });
        } catch (error) {
            setTransactionState({ ...transactionState, status: 'error', error });
            throw error;
        }
    };

    const rollbackTransaction = async (txnId) => {
        try {
            await transactionService.rollbackTransaction(txnId);
            setTransactionState({ ...transactionState, status: 'rolled_back' });
        } catch (error) {
            setTransactionState({ ...transactionState, status: 'error', error });
            throw error;
        }
    };

    return (
        <TransactionContext.Provider value={{
            ...transactionState,
            startTransaction,
            commitTransaction,
            rollbackTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    );
};

// 使用事务的自定义钩子
export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
};
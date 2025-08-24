import { useState, useEffect, useRef, useCallback } from 'react';
import { debounceRAF } from './debounceRAF';

/**
 * 可重複使用的待處理項目 Hook
 * 功能：
 * 1. 收集連續觸發的更新項目
 * 2. 使用防抖機制合併短時間內的多次操作
 * 3. 過濾無效的中間狀態 (如來回切換)
 * 4. 最終只發送必要的更新到伺服器
 */
export const usePendingItems = ({
    sendToServer,   // 實際發送 API 的函數 (由父組件傳入)
    onClear,        // 清除完成後的回調
    debounceTime    // 防抖時間 (ms)
}) => {
    // State 與 Ref 定義 =============================================
    const [pendingItems, setPendingItems] = useState([]);  // 待處理項目列表
    const pendingItemsRef = useRef(pendingItems);          // 即時存取 pendingItems 的 ref
    const debouncedSendRef = useRef();                     // 防抖函數的 ref

    // 副作用與初始化 ================================================
    // 初始化防抖函數 (只在 mount 時執行一次)
    useEffect(() => {
        debouncedSendRef.current = debounceRAF(() => {
            processAndSendPendingItems();
        }, debounceTime);

        // 清理函數：unmount 時取消防抖
        return () => debouncedSendRef.current?.cancel?.();
    }, []);

    // 同步 pendingItems 到 ref (確保隨時能取得最新值)
    useEffect(() => {
        pendingItemsRef.current = pendingItems;
    }, [pendingItems]);



    // 核心處理函數 ==================================================
    /**
     * 處理並發送待處理項目
     * 1. 分組相同 idMeal 的項目
     * 2. 計算最終需要更新的狀態
     * 3. 呼叫 sendToServer 發送 API
     * 4. 清空已處理的項目
     */
    const processAndSendPendingItems = useCallback(async () => {
        try {
            const allPendingItems = pendingItemsRef.current;
            if (allPendingItems.length === 0) return;

            // 步驟 1: 按 idMeal 分組
            const groupedItems = allPendingItems.reduce((acc, item) => {
                acc[item.idMeal] = acc[item.idMeal] || [];
                acc[item.idMeal].push(item);
                return acc;
            }, {});

            // 步驟 2: 計算每組的最終狀態
            const latestPendingItems = Object.entries(groupedItems).flatMap(
                ([idMeal, items]) => {
                    if (items.length === 0) return [];

                    const oldestState = items[0]
                    const latestState = items[items.length - 1]
                    const oldestCheck = oldestState.oldCheckedState;
                    const latestCheck = latestState.newCheckedState;
                    const oldestValue = oldestState.oldValue;
                    const latestValue = latestState.newValue;
                    const finalState = {
                        idMeal: idMeal,
                        oldCheckedState: oldestCheck,
                        newCheckedState: latestCheck,
                        oldValue: oldestValue,
                        newValue: latestValue
                    }
                    // 過濾掉來回切換後恢復原狀的項目
                    return oldestCheck === latestCheck && oldestValue === latestValue ? [] : [finalState];
                }
            );
            console.log(groupedItems, "groupedItems", latestPendingItems, "latestPendingItems");

            // 步驟 3: 發送有效更新
            if (latestPendingItems.length > 0) {
                await sendToServer(latestPendingItems);
            }
        } catch (error) {
            console.error("處理待處理項目失敗:", error);
            throw error;
        } finally {
            // 步驟 4: 清空已處理項目
            setPendingItems([]);
            onClear?.();
        }
    }, [sendToServer, onClear]);


    const finishPending = useCallback(async() => {
        // 立即取消任何排程中的防抖操作
        debouncedSendRef.current?.cancel?.();
        // 立即處理並發送
        await processAndSendPendingItems();
    }, [processAndSendPendingItems]); // 依賴 processAndSendPendingItems 確保其最新
    // 公開 API =====================================================
    /**
     * 添加待處理項目並觸發防抖發送
     * @param {Array} itemsToUpdate - 要添加的項目陣列
     */
    const addPendingItems = useCallback((itemsToUpdate) => {
        // 合併新項目到現有列表
        setPendingItems(prev => [...prev, ...itemsToUpdate]);
        // 觸發防抖計時 (會重置之前的計時)
        debouncedSendRef.current?.();
    }, []);

    return {
        pendingItems,      // 當前待處理項目 (僅用於監測)
        addPendingItems,   // 添加項目的主要方法
        pendingItemsRef,    // 用於需要即時訪問的場景
        finishPending,
    };
};
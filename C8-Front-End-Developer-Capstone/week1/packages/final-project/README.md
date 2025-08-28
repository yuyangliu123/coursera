購物網站專案

這是一個使用現代化 MERN (MongoDB, Express, React, Node.js)以及Apollo 技術開發的全端購物網站。專案旨在提供一個流暢、直觀的線上購物體驗，包含使用者註冊/登入、商品瀏覽、購物車管理、訂單建立與歷史查詢等核心功能。

技術

這個專案的前端和後端分別使用了不同的技術來構建，以確保高效且可擴展的應用程式架構。

前端 (Frontend)

    React: 負責使用者介面的主要函式庫。

    React Router: 處理前端路由，實現單頁應用程式 (SPA) 的導航。

    React useContext: 管理應用程式的狀態，特別是購物車和使用者資訊等全域狀態。

    Axios: 處理 API 請求。

    JWT Token Rotation: 透過Access Token及Refresh Token來達成自動刷新Token

    Chakra UI: 管理樣式，以確保樣式的一致性與可維護性。

    無限滾動: 商品頁面以無限滾動呈現

    懶加載: 大部分圖片以懶加載實現



後端 (Backend)

    Node.js: 執行後端程式碼的運行環境。

    Express.js: 快速、彈性的 Node.js Web 應用程式框架。

    MongoDB: NoSQL 資料庫，用於儲存商品、使用者、訂單等資料。

    Mongoose: 提供物件資料模型 (ODM) 解決方案，讓操作 MongoDB 更直觀。

    JWT (JSON Web Tokens): 處理使用者認證與授權。

    Bcrypt: 用於加密使用者密碼。

    imgConverter: 將圖片轉換為指定的格式並修改長寬等資訊，以此達到節省流量。

✨ 主要功能

    使用者認證: 註冊、登入與登出，發送驗證信至指定信箱來修改密碼

    商品管理: 瀏覽所有商品、商品分類、關鍵字搜尋、無限滾動及懶加載商品圖片與詳細資訊頁面。

    購物車: 新增、移除、更新商品數量，結合pending技術合併短時間內重複的操作，以此達到節省流量。

    訂單管理: 建立訂單、查詢歷史訂單。


🚀 安裝與執行

請確保你的系統已經安裝了 Node.js 和 npm (或 yarn)。

1. 複製專案

    Bash

    git clone <你的專案網址>
    cd <你的專案資料夾>

2. 環境設定

    在專案根目錄下建立 .env 檔案，並設定你的環境變數。

# 後端環境變數
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/your_database_name
    JWT_SECRET=your_jwt_secret_key

3. 安裝依賴套件

    分別進入後端和前端資料夾安裝依賴。
Bash

# 後端
    cd backend
    npm install

# 前端
    cd ../frontend
    npm install

4. 執行專案

    首先啟動後端伺服器，然後啟動前端開發伺服器。
    以系統管理員身分執行IDE
    Bash

# 啟動後端伺服器
    開啟第一個終端機
    cd ../packages/final-project/server
    npm run start-mongodb
# 開啟第二個終端機
    cd ../packages/final-project/server
    npm run start

# 開啟新視窗或終端機，啟動前端伺服器
    cd ../packages/final-project
    npm start

📁 專案結構

    server
    ┣ apolloGQL    #處理 GraphQL 相關的 API，提供更彈性、高效能的資料查詢。
    ┃ ┣ models #處理 GraphQL 的資料模型，定義資料的結構。
    ┃ ┃ ┣ OrderCounter.js  #用於追蹤訂單編號的計數器。
    ┃ ┃ ┣ RefreshToken.js  #處理使用者重新整理令牌的資料模型
    ┃ ┃ ┗ typeDefs.js  #定義 GraphQL 的 Schema，描述可用的資料類型和查詢。
    ┃ ┗ resolvers.js   # 實現 GraphQL 查詢和變動的邏輯，將請求與資料來源連結。
    ┣ config   #專案的設定檔
    ┃ ┣ apolloPrivateOperations.js #存放需要私密權限的 Apollo GraphQL 操作設定。
    ┃ ┣ apolloPublicOperations.js  #存放公開的 Apollo GraphQL 操作設定。
    ┃ ┣ apolloSemiPublicOperations.js  #存放半公開的 Apollo GraphQL 操作設定
    ┃ ┣ feeConfig.js   #存放費用相關的設定
    ┃ ┗ googleOAuth2Client.js
    ┣ data #存放資料庫相關的檔案，可能用於連接不同的資料庫或資料庫實例
    ┃ ┣ arbiter    #仲裁節點，用於管理叢集中的資料庫。
    ┃ ┣ primary    #主要資料庫實例
    ┃ ┗ secondary  #次要資料庫實例，可能用於資料備份或讀取負載平衡
    ┣ middleware   #存放伺服器請求的處理中介軟體
    ┃ ┣ authenticate.js    #處理完整的使用者認證流程
    ┃ ┣ authenticateAccessToken.js #驗證使用者的存取令牌
    ┃ ┣ refreshTokens.js   #處理刷新令牌的邏輯
    ┃ ┣ requireRefreshToken.js #驗證令牌
    ┃ ┣ semiAuth.js    #處理半認證狀態的邏輯
    ┃ ┗ validateCsrfToken.js   #驗證 CSRF 令牌以防止跨站請求偽造
    ┣ model    #存放資料庫模型定義
    ┃ ┗ models.js
    ┣ public   #存放公開的靜態檔案，例如圖片、CSS 和 JavaScript
    ┃ ┣ images #存放公開的圖片
    ┣ routes   #存放處理不同 URL 路由的邏輯，詳細請見Axios API 文件
    ┃ ┣ api.js
    ┃ ┣ apiStore.js
    ┃ ┣ auth.js
    ┃ ┣ checkout.js
    ┃ ┣ db.js
    ┃ ┣ feeStore.js
    ┃ ┣ forgotpassword.js
    ┃ ┣ imgConverter.js
    ┃ ┣ localImgConverter.js
    ┃ ┣ login.js
    ┃ ┣ logout.js
    ┃ ┣ reservation.js
    ┃ ┣ setupReplicaSet.js
    ┃ ┣ shoppingcart.js
    ┃ ┗ signup.js
    ┣ utils    #存放後端常用的工具函數
    ┃ ┣ CheckoutPage
    ┃ ┃ ┣ getCheckoutInfo.js   #獲得結帳頁面資訊
    ┃ ┃ ┗ getCheckoutInfoWithDraft.js  #獲得臨時購物車資訊
    ┃ ┣ deleteShoppingCart.js  #刪除購物車
    ┃ ┣ findInitialShoppingCart.js #獲得購物車資訊
    ┃ ┣ getInitialUserInfo.js  #獲取初始使用者資訊
    ┃ ┣ getLikeItemData.js #取使用者喜歡的商品資料
    ┃ ┣ getShoppingCart.js #獲取購物車資料
    ┃ ┣ orderNumberGenerator.js    #生成訂單編號
    ┃ ┣ unAuthMergeCart.js #生成臨時購物車
    ┃ ┗ updateCartState.js #更新購物車的狀態
    ┣ .env #環境變數設定檔
    ┣ categoriesData.json  #從www.themealdb.com的免費api獲取的餐點資料儲存位置
    ┗ server.js    #伺服器主要啟動檔案
    src
    ┣ components
    ┃ ┣ Account    #帳號頁面相關的元件
    ┃ ┃ ┣ config   #帳號頁面相關的設定檔
    ┃ ┃ ┃ ┗ orderDetailConfig.js
    ┃ ┃ ┣ Account.js   #帳號頁面的核心元件、容器元件和骨架屏元件
    ┃ ┃ ┣ AccountContainer.js
    ┃ ┃ ┣ AccountSkeleton.js
    ┃ ┃ ┣ OrderDetail.js   #訂單詳情頁面的核心元件、容器元件和骨架屏元件
    ┃ ┃ ┣ OrderDetailContainer.js
    ┃ ┃ ┗ OrderDetailSkeleton.js
    ┃ ┣ Booking
    ┃ ┃ ┣ BookingForm.js   #預訂頁面
    ┃ ┣ CheckoutPage   #結帳頁面相關的元件
    ┃ ┃ ┣ AddressInfo  #地址資訊相關的元件
    ┃ ┃ ┃ ┣ AddAddress.js
    ┃ ┃ ┃ ┣ AddressInfo.js
    ┃ ┃ ┃ ┣ DeleteAddress.js
    ┃ ┃ ┃ ┗ SetAsDefault.js
    ┃ ┃ ┣ config   #結帳頁面相關的設定檔
    ┃ ┃ ┃ ┣ checkoutFormConfig.js
    ┃ ┃ ┃ ┗ checkoutPageConfig.js
    ┃ ┃ ┣ CheckoutPage.js  #結帳頁面的核心元件、容器元件和骨架屏元件
    ┃ ┃ ┣ CheckoutPageContainer.js
    ┃ ┃ ┣ CheckoutPageSkeleton.js
    ┃ ┃ ┣ OrderSummary.js  #訂單摘要和價格相關的元件
    ┃ ┃ ┣ OrderSummaryPrice.js
    ┃ ┃ ┣ ShippingContainer.js #運送資訊相關的核心元件、容器元件和骨架屏元件
    ┃ ┃ ┣ ShippingPage.js
    ┃ ┃ ┗ ShippingSkeleton.js
    ┃ ┣ Home   #首頁相關的元件
    ┃ ┃ ┣ config   #首頁相關的設定檔
    ┃ ┃ ┃ ┗ footerConfig.js
    ┃ ┃ ┣ CustomerSaying   #客戶評價相關的元件
    ┃ ┃ ┃ ┗ CustomerCard.js
    ┃ ┃ ┣ Main #首頁的各個區塊元件
    ┃ ┃ ┃ ┣ Card.js
    ┃ ┃ ┃ ┗ Main.js
    ┃ ┃ ┣ About.js
    ┃ ┃ ┣ Footer.js
    ┃ ┃ ┣ Header.js
    ┃ ┃ ┣ Home.js
    ┃ ┃ ┣ SubFooter.js
    ┃ ┃ ┗ SubFooterContainer.js
    ┃ ┣ Nav    #導航列相關的元件
    ┃ ┃ ┣ config   #導航列相關的設定檔
    ┃ ┃ ┃ ┗ navConfig.js
    ┃ ┃ ┣ MiniCart2.js #導航列中不同功能的元件
    ┃ ┃ ┣ MobileNav.js
    ┃ ┃ ┣ Nav2.js
    ┃ ┃ ┣ NavCart.js
    ┃ ┃ ┣ NavItems.js
    ┃ ┃ ┣ NavLike.js
    ┃ ┃ ┣ NavLogin.js
    ┃ ┃ ┗ NavReserve.js
    ┃ ┣ OrderOnline    #無限滾動商品頁面相關的元件
    ┃ ┃ ┣ CartPage #購物車頁面相關的元件
    ┃ ┃ ┃ ┣ config #購物車頁面相關的設定檔
    ┃ ┃ ┃ ┃ ┗ cartPageConfig.js
    ┃ ┃ ┃ ┣ CartPage.js    # 購物車頁面的核心元件、容器元件、上下文提供者和骨架屏元件
    ┃ ┃ ┃ ┣ CartPageContainer.js
    ┃ ┃ ┃ ┣ CartPageContext.js
    ┃ ┃ ┃ ┣ CartPageHeading.js
    ┃ ┃ ┃ ┗ CartPageSkeleton.js
    ┃ ┃ ┣ FoodButton.js #商品頁面的依種類篩選按鈕
    ┃ ┃ ┣ FoodPage2.js #商品詳細頁面
    ┃ ┃ ┣ LikeItem.js  喜歡的商品元件
    ┃ ┃ ┣ LikeItemContainer.js
    ┃ ┃ ┣ LikeItemSkeleton.js
    ┃ ┃ ┣ OrderOnline2.js  #訂購數量和線上訂購頁面的核心元件
    ┃ ┃ ┣ OrderOnlineContainer.js
    ┃ ┃ ┣ OrderOnlineSkeleton.js
    ┃ ┃ ┣ Payment.js   #支付、商品上下文和商品單個元件
    ┃ ┃ ┣ ProductContext.js
    ┃ ┃ ┣ ProductItem.js
    ┃ ┃ ┣ SearchSuggestionBox.js   #搜尋建議相關的元件
    ┃ ┃ ┣ SearchSuggestionBoxMobile.js
    ┃ ┃ ┗ SearchSuggestionBoxMobileContent.js
    ┃ ┣ provider   #提供各種上下文 (Context) 和通用功能的元件或鉤子
    ┃ ┃ ┣ apollo-client.js #設定apollo
    ┃ ┃ ┣ axiosInstanceWithTokenCheck.js   #結合axios及refresh token rotation，自動刷新token
    ┃ ┃ ┣ backToTop.js #回到頁面頂部
    ┃ ┃ ┣ CheckCapslock.js #回傳是否開啟大寫
    ┃ ┃ ┣ checkRefreshToken.js #刷新過期token
    ┃ ┃ ┣ debounceRAF.js   #防抖動函數
    ┃ ┃ ┣ GlobalModal.js
    ┃ ┃ ┣ GlobalModalContext.js
    ┃ ┃ ┣ imageConvert.js  轉換圖片到指定的設定
    ┃ ┃ ┣ JwtTokenRotate.js    透過jwt回傳使用者相關資訊，同時自動刷新過期token
    ┃ ┃ ┣ LazyLoadImage.js 圖片懶加載
    ┃ ┃ ┣ MealContext.js
    ┃ ┃ ┣ ModalContext.js
    ┃ ┃ ┣ ModalPage.js
    ┃ ┃ ┣ ModalsSystem.js
    ┃ ┃ ┣ SearchContext.js
    ┃ ┃ ┣ showToast.js
    ┃ ┃ ┣ StickyNav.js
    ┃ ┃ ┣ throttleRAF.js   #節流函數
    ┃ ┃ ┣ tokenUpdater.js
    ┃ ┃ ┣ useBreakpoint.js #自定義螢幕斷點
    ┃ ┃ ┣ useClickOutside.js   #點擊指定ref以外的區域觸發函數
    ┃ ┃ ┣ usePendingItems.js   #購物車待辦函數
    ┃ ┃ ┗ window-scroll.js #無限滾動
    ┃ ┣ Register   #註冊登入相關的元件
    ┃ ┃ ┣ ForgotPassword.js
    ┃ ┃ ┣ LoginRotate.js
    ┃ ┃ ┣ ResetPassword.js
    ┃ ┃ ┗ Signup.js
    ┃ ┣ FloatingNav.js #浮動導航
    ┃ ┣ FullScreenSection.js   #全螢幕區塊
    ┃ ┣ globalConfig.js    #全域設定
    ┃ ┣ Loading.js
    ┃ ┗ restaurant.jpg
    ┣ App.css
    ┣ App.js
    ┣ App.test.js
    ┣ GlobalProvider.js
    ┣ index.css
    ┣ index.js
    ┣ LoadingLogo.js
    ┣ reportWebVitals.js
    ┗ theme.js #通用css設定

# Axios API 文件

    請求方式	路徑	描述
    GET	/api/api	獲取目前分頁的商品資訊
    GET	/api/products/:id	獲取單一商品詳細資訊
    POST /api/order	獲取目前分頁的商品資訊


    POST /signup/register 用戶註冊
    POST /shoppingcart/addToCart 將商品加入購物車
    POST /shoppingcart/updateCart 修改購物車
    POST /shoppingcart/mergeCart  在使用者從「未登入」狀態轉換為「已登入」狀態時，創建臨時購物車。
        當前情境： 使用者在未登入時，購物車裡有商品 A。
        登入行為： 使用者點擊「checkout」，成功登入並創建包含商品A的臨時購物車
    POST /shoppingcart/like 將商品加入喜歡列表

    GET /reservation/checkReservation 查詢時段是否已被預訂
    POST /reservation/reservation 提交訂位

    POST /logout/logout 使用者登出
    POST /login/login 使用者登入
    POST /login/check-refresh-token 檢查Access Token和Refresh Token是否過期，若過期則透過Refresh Token Rotation刷新

    GET /imgConverter  圖片格式轉換與壓縮
    此 API 可將圖片轉換為指定格式，並改變長寬，以達到壓縮容量的目的。例如，將 JPEG 轉換為 WEBP。

    POST /forgotpassword/send 使用者忘記密碼時 根據輸入的email查詢用戶是否存在，若存在則產生金鑰並儲存在資料庫，同時發送更改密碼的url到指定的email
    POST /forgotpassword/checkvalidate 當用戶點擊url時，檢查用戶及金鑰是否存在於資料庫
    POST /frogotpassword/reset 重設新密碼

    POST /checkout/checkoutInfo 運送地址的CRUD，包含將選擇的地址設為預設
    POST /checkout/checkout 創建新訂單

    📜 Apollo API 文件
    Query:
        shoppingcarts 獲取購物車資料，包含商品個別數量/單價/圖片、總金額、總數量
        cartitemnumber 獲取購物車總數量
        likeitemnumber 回傳該商品是否在喜歡列表內
        likeitemlist 獲取喜歡列表資訊，包含商品個別數量/單價/圖片
        myorderinfo 獲取用戶的歷史訂單，包含訂單編號、總金額、付款方式等
        orderdetail 查詢特定歷史訂單詳細資訊，包含訂單編號、總金額、付款方式、商品資訊等
        checkoutpageformat 獲取選擇的商品資訊、運送地址、費用等

    Mutation:
        updatelikelist 將喜歡列表內的商品新增至購物車內/刪除喜歡列表的特定商品


⚠️ 注意事項

    請確保你的 MongoDB 服務正在執行。

    在正式部署時，請將 JWT_SECRET 和 MONGODB_URI 設為更複雜的字串，並妥善保管。

    為了安全性，請不要將 .env 檔案提交到版本控制系統中 (例如 Git)。



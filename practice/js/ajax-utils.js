(function (global) {

    // Set up a namespace for our utility
    var ajaxUtils = {};
    
    
    // Returns an HTTP request object
    function getRequestObject() {
      if (global.XMLHttpRequest) {
        return (new XMLHttpRequest());
      } 
      else if (global.ActiveXObject) {
        // For very old IE browsers (optional)
        return (new ActiveXObject("Microsoft.XMLHTTP"));
      } 
      else {
        global.alert("Ajax is not supported!");
        return(null); 
      }
    }
    
    
    // Makes an Ajax GET request to 'requestUrl'
    ajaxUtils.sendGetRequest = 
      function(requestUrl, responseHandler, isJsonResponse) {
        var request = getRequestObject();
        request.onreadystatechange = 
          function() { 
            handleResponse(request, responseHandler,isJsonResponse); 
          };
        request.open("GET", requestUrl, true);
        request.send(null); // for POST only
      };
    
    
    // Only calls user provided 'responseHandler'
    // function if response is ready
    // and not an error
    function handleResponse(request,
                            responseHandler,
                            isJsonResponse) {
      if ((request.readyState == 4) &&
         (request.status == 200)) {
           
          //Default to isJsonResponse = true
          if(isJsonResponse==undefined){
            isJsonResponse=true;
          }
          //JSON.parse(request.responseText) == convert JSON to string
          if(isJsonResponse){
            responseHandler(JSON.parse(request.responseText))
          }
          else{
            responseHandler(request.responseText);
          }
      }
    }

    global.$ajaxUtils = ajaxUtils;
  
})(window)

    

    
    //==以下程式碼
    // var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function() {
    //     // 如果狀態是4，表示請求已完成
    //     if (xhr.readyState == 4) {
    //       // 如果狀態碼是200，表示成功
    //       if (xhr.status == 200) {
    //         // 取得回應的內容
    //         var response = xhr.responseText;
    //         // 把回應的內容顯示在console上
    //         console.log(response);
    //       }
    //     }
    //   };
    //   xhr.open("GET", "https://example.com/data", true);
    //   xhr.send(null);


    //Expose utility to the global object

    
    // Expose utility to the global object
    // global.$ajaxUtils = ajaxUtils;
    
    
    // })(window);




   

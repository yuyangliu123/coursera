import { jwtDecode } from "jwt-decode";
const onLogout = async (e) => {
    if(localStorage.getItem("token")){
        const decodeToken=jwtDecode(localStorage.getItem("token"))
        const blacklist={jti:decodeToken.jti,exp:decodeToken.exp}
        try {
            let result = await fetch("http://localhost:5000/logout/logout", {
              method: "post",
              body: JSON.stringify(blacklist),
              headers: {
                "Content-Type": "application/json"
              }
            });
            if (result.status === 400) {
              setServerError(await result.text());
            } else {
              result = await result.json();
              console.warn(result);
              if (result) {
                console.log(result);
                alert(`Sign Up Successfully`);
                reset();
                window.location.href = "./login";//After singup success, relocate to login page
              }
            }
          } catch (error) {
            console.error("Error:", error);
          }
    }
  };
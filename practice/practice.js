function isValidUrl(string) {
  try {
      new URL(string);
      return true;
  } catch (_) {
      return false;  
  }
}

let links = document.querySelectorAll("a");
let regex = new RegExp("\\.(jpg|JPG|png|PNG).*","i");
links.forEach(link => {
  let href = link.getAttribute("href");
  if (href && isValidUrl(href) && regex.test(href)) {
      console.log(href);
  }
});



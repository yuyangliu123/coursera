export const backToTop=()=>{
    requestAnimationFrame(() => {
        window.scrollTo({ top: 0 });
      })
}
const hamburgerMenu = document.getElementById("hamburger-menu");
const nav = document.getElementsByTagName("nav")[0];

const toggleHamburgerMenu = () =>{
    if ( hamburgerMenu.classList.contains("open") ){
        // HIDE
        hamburgerMenu.classList.remove("open");
        nav.style.maxHeight = "0px";

        if ( !nav.classList.contains("hidden") ){
            nav.classList.add("hidden");
            nav.style.overflow = "hidden";
        }
    } else {
        // REVEAL
        hamburgerMenu.classList.add("open");
        nav.style.maxHeight = "1000px";

        if ( nav.classList.contains("hidden") ){
            nav.classList.remove("hidden");
            nav.style.overflow = "";
        }
    }
}


hamburgerMenu.addEventListener("click", toggleHamburgerMenu);
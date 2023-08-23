let menu = document.querySelector('.menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    navbar.classList.toggle('open-menu')
    menu.classList.toggle("move");
}
window.onscroll = () => {
    navbar.classList.remove('open-menu')
    menu.classList.remove("move");
}

// Email JS
function validate(){
    let name = document.querySelector(".name");
    let email = document.querySelector(".email");
    let msg = document.querySelector(".message");
    let sendBtn = document.querySelector(".send-btn");
    sendBtn.addEventListener("click", (e)=> {
        e.preventDefault();
        if(name.value == "" || email.value == "" || msg.value == ""){
            emptyerror();
        } else{
            sendmail (name.value, email.value, msg.value);
            success();
        }
    });
}
validate();
function sendmail(name, email, msg) {
    emailjs.send("service_36dwc6p","template_lyzevr4",{
        from_name: email,
        to_name: name,
        message: msg,
        });
}
function emptyerror() {
    swal({
        title: "Oh No....",
        text: "Fields Cannot be empty!",
        icon: "error",
    });
}
function success() {
    swal({
        title: "Email Send Successfully",
        text: "We try to in 24 hours",
        icon: "success",
    });
}

//Header background change on scroll
let header = document.querySelector('header')
window.addEventListener('scroll', () => {
    header.classList.toggle('header-active', window.scrollY > 0);
});

//Scroll Top
let scrollTop = document.querySelector(".scroll-top")
window.addEventListener("scroll", () => {
    scrollTop.classList.toggle("scroll-active", window.scrollY > 400);
});

// Custom Scroll Bar
window.onscroll = function() {mufunction()};
function mufunction(){
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-bar').style.width = scrolled + '%';
}
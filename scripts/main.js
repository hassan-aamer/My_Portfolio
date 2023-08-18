let menu = document.querySelector('.menu-icon');
menu.onclick = () => {
    menu.classList.toggle("move");
};


//Reviews Swiper
var swiper = new Swiper(".review-content", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: true,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});

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
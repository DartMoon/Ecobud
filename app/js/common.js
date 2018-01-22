function ready() {

    AOS.init({
        disable: function () {
            var maxWidth = 1024;
            return window.innerWidth < maxWidth;
        }
    });
}

document.addEventListener("DOMContentLoaded", ready);
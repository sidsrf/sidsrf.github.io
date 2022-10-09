const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = false;

xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        console.log(this.responseText);
    }
});

xhr.open("GET", "https://google.com");
xhr.setRequestHeader("Accept", "*/*");

xhr.send(data);
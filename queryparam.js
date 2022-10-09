const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        console.log(this.responseText);
    }
});

xhr.open("POST", "https://www.thunderclient.com/welcome");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("User-Agent", "Thunder Client (https://www.thunderclient.com)");

xhr.send(data);
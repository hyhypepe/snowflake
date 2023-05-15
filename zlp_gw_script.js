setInterval(async () => {
    if (!await isEnableDebugGateway()) {
        return;
    }
    appendAutoFillBtn()
    appendRedirectToLocalBtn()
}, 1000)

function isEnableDebugGateway() {
    return new Promise((resolve) => {
        chrome.storage.local.get('enableDebugGW', function (result) {
            resolve(result.enableDebugGW);
        });
    })
}

function appendAutoFillBtn() {
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("AUTO FILL");
    btn.appendChild(t);
    btn.addEventListener("click", onAutoFillClick);
    btn.setAttribute("id", "autofill");
    btn.style.color = "white"
    btn.style.backgroundColor = "red"
    btn.style.width = "100%"
    btn.style.height = "50px"
    btn.style.fontSize = "15px"

    const cardField = document.getElementsByClassName("card-field-wrap")[0];
    if (!cardField) {
        return
    }
    const autofill = document.getElementById("autofill");
    if (autofill) {
        return
    }
    cardField.prepend(btn);
}

function appendRedirectToLocalBtn() {
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("REDIRECT TO LOCAL");
    btn.appendChild(t);
    btn.addEventListener("click", onRedirectToLocalClick);
    btn.setAttribute("id", "redirect-to-local");
    btn.style.color = "white"
    btn.style.backgroundColor = "red"
    btn.style.width = "100%"
    btn.style.height = "50px"
    btn.style.fontSize = "15px"

    const logoWrap = document.getElementsByClassName("logo-wrap")[0];
    if (!logoWrap) {
        return
    }
    const redirectToLocalBtn = document.getElementById("redirect-to-local");
    if (redirectToLocalBtn) {
        return
    }
    logoWrap.append(btn);
}

function onAutoFillClick() {
    if (document.getElementsByClassName("bank-name-logo visa-master-jcb").length > 0) {
        const cardNumber = document.getElementsByClassName("form-group card-number")[0].getElementsByClassName("form-control")[0];
        simulateClickAndFill(cardNumber, "4111111111111111");
        const ownerName = document.getElementsByClassName("form-group owner-name")[0].getElementsByClassName("form-control")[0];
        simulateClickAndFill(ownerName, "NGUYEN VAN A");
        const expireDate = document.getElementsByClassName("form-group expire-date")[0].getElementsByClassName("form-control")[0];
        simulateClickAndFill(expireDate, "01/25");
        const cvv = document.getElementsByClassName("form-group cvv")[0].getElementsByClassName("form-control")[0];
        simulateClickAndFill(cvv, "123");
    } else {
        const cardNumber = document.getElementsByClassName("form-group card-number")[0].getElementsByClassName("form-control")[0]
        simulateClickAndFill(cardNumber, "9704540000000062");
        const ownerName = document.getElementsByClassName("form-group owner-name")[0].getElementsByClassName("form-control")[0]
        simulateClickAndFill(ownerName, "NGUYEN VAN A");
        const expireDate = document.getElementsByClassName("form-group expire-date")[0].getElementsByClassName("form-control")[0]
        simulateClickAndFill(expireDate, "10/18");
    }
}

function onRedirectToLocalClick() {
    // Get the current URL
    var url = window.location.href;
    // Replace the hostname
    url = url.replace(window.location.hostname, 'localhost:3000');
    // Replace the protocol
    url = url.replace(/^https:/, 'http:');
    // Update the location
    window.location.href = url;
}

function simulateClickAndFill(element, value) {
    element.value = value;
    element.dispatchEvent(new Event('input', {
        view: window,
        bubbles: true,
        cancelable: true
    }))
}

setInterval(async () => {
    if (!await isEnableDebugGateway()) {
        return;
    }
    appendAutoFillSuccessBtn()
    if (isAtmPage()) {
        appendAutoFillFailBtn()
    }
    appendRedirectToLocalBtn()
    appendRedirectToDevBtn()
}, 1000)

function isEnableDebugGateway() {
    return new Promise((resolve) => {
        chrome.storage.local.get('enableDebugGW', function (result) {
            resolve(result.enableDebugGW);
        });
    })
}

function appendAutoFillSuccessBtn() {
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("AUTO FILL SUCCESS");
    btn.appendChild(t);
    btn.addEventListener("click", function() {
        onAutoFillClick(true)
    });
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


function appendAutoFillFailBtn() {
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("AUTO FILL FAIL");
    btn.appendChild(t);
    btn.addEventListener("click", function() {
        onAutoFillClick(false)
    });
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
    const existingBtn = document.getElementById("redirect-to-local");
    if (existingBtn) {
        return
    }
    logoWrap.append(btn);
}


function appendRedirectToDevBtn() {
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("REDIRECT TO DEV");
    btn.appendChild(t);
    btn.addEventListener("click", onRedirectToDevClick);
    btn.setAttribute("id", "redirect-to-dev");
    btn.style.color = "white"
    btn.style.backgroundColor = "red"
    btn.style.width = "100%"
    btn.style.height = "50px"
    btn.style.fontSize = "15px"

    const logoWrap = document.getElementsByClassName("logo-wrap")[0];
    if (!logoWrap) {
        return
    }
    const existingBtn = document.getElementById("redirect-to-dev");
    if (existingBtn) {
        return
    }
    logoWrap.append(btn);
}

function onAutoFillClick(isSuccess) {
    if (isAtmPage()) {
        const cardNumber = document.getElementsByClassName("form-group card-number")[0].getElementsByClassName("form-control")[0];
        simulateClickAndFill(cardNumber, "4111111111111111");
        const ownerName = document.getElementsByClassName("form-group owner-name")[0].getElementsByClassName("form-control")[0];
        simulateClickAndFill(ownerName, "NGUYEN VAN A");
        const expireDate = document.getElementsByClassName("form-group expire-date")[0].getElementsByClassName("form-control")[0];
        simulateClickAndFill(expireDate, "01/25");
        const cvv = document.getElementsByClassName("form-group cvv")[0].getElementsByClassName("form-control")[0];
        simulateClickAndFill(cvv, "123");
    } else {
        let cardNumberValue;
        let ownerNameValue;
        let expireDateValue;
        if (isSuccess) {
            cardNumberValue = "9704540000000062";
            ownerNameValue = "NGUYEN VAN A";
            expireDateValue = "1018";
        } else {
            cardNumberValue = "9704540000000013";
            ownerNameValue = "NGUYEN VAN A";
            expireDateValue = "1018";
        }
        const cardNumber = document.getElementsByClassName("form-group card-number")[0].getElementsByClassName("form-control")[0]
        simulateClickAndFill(cardNumber, cardNumberValue);
        const ownerName = document.getElementsByClassName("form-group owner-name")[0].getElementsByClassName("form-control")[0]
        simulateClickAndFill(ownerName, ownerNameValue);
        const expireDate = document.getElementsByClassName("form-group expire-date")[0].getElementsByClassName("form-control")[0]
        simulateClickAndFill(expireDate, expireDate);
    }
}

function isAtmPage() {
    return document.getElementsByClassName("bank-name-logo visa-master-jcb").length > 0;
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

function onRedirectToDevClick() {
    // Get the current URL
    var url = window.location.href;
    // Replace the hostname
    url = url.replace(window.location.hostname, 'devgateway.zalopay.vn');
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

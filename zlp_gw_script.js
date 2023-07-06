setInterval(async () => {
    if (!await isEnableDebugGateway()) {
        return;
    }
    appendAutoFillBtn()
    appendRedirectBtn("redirect-to-local", redirectToLocalClick)
    appendRedirectBtn("redirect-to-dev", redirectToDevClick)
}, 1000)

function isEnableDebugGateway() {
    const enableDebugGW = "enableDebugGW"
    return new Promise((resolve) => {
        chrome.storage.local.get(enableDebugGW, function (result) {
            const isItemNotInStorage = !(enableDebugGW in result);
            if (isItemNotInStorage) {
                chrome.storage.local.set({enableDebugGW: true }, function () {})
            }
            if (isItemNotInStorage) {
                resolve(true)
            } else {
                resolve(result.enableDebugGW);
            }
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

    let cardField = null
    if (isGWV2()) {
        cardField = findElementByTagAndPrefixClass("div", "input_card_field_wrap_")
    } else {
        cardField = document.getElementsByClassName("card-field-wrap")[0];
    }
    if (!cardField) {
        return
    }
    const autofill = document.getElementById("autofill");
    if (autofill) {
        return
    }
    cardField.prepend(btn);
}

function appendRedirectBtn(id, redirectFunc) {
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("REDIRECT TO DEV");
    btn.appendChild(t);
    btn.addEventListener("click", redirectFunc);
    btn.setAttribute("id", id);
    btn.style.color = "white"
    btn.style.backgroundColor = "red"
    btn.style.width = "100%"
    btn.style.height = "50px"
    btn.style.fontSize = "15px"

    let logoWrap = null
    if (isGWV2()) {
        logoWrap = findElementByTagAndPrefixClass("div", "header-logo_logo_wrap_");
    } else {
        logoWrap = document.getElementsByClassName("logo-wrap")[0];
    }
    if (!logoWrap) {
        return
    }
    const existingBtn = document.getElementById(id);
    if (existingBtn) {
        return
    }
    logoWrap.append(btn);
}

function onAutoFillClick() {
    if (isGWV2()) {
        if (window.location.href.indexOf("pay/v2/cc") != -1) {
            const cardNumber = findElementByTagAndPrefixClass("div","input_card_number").getElementsByClassName("form-control")[0];
            simulateClickAndFill(cardNumber, "4111111111111111");
            const ownerName = findElementByTagAndPrefixClass("div","owner-name").getElementsByClassName("form-control")[0];
            simulateClickAndFill(ownerName, "NGUYEN VAN A");
            const expireDate = findElementByTagAndPrefixClass("div", "expire-date").getElementsByClassName("form-control")[0];
            simulateClickAndFill(expireDate, "01/25");
            const cvv = findElementByTagAndPrefixClass("div", "cvv").getElementsByClassName("form-control")[0];
            simulateClickAndFill(cvv, "123");
        } else {
            const cardNumber = findElementByTagAndPrefixClass("div", "input_card_number").getElementsByClassName("form-control")[0]
            simulateClickAndFill(cardNumber, "9704540000000062");
            const ownerName = findElementByTagAndPrefixClass("div", "input_owner_name").getElementsByClassName("form-control")[0]
            simulateClickAndFill(ownerName, "NGUYEN VAN A");
            const expireDate = findElementByTagAndPrefixClass("div", "input_expire_date").getElementsByClassName("form-control")[0]
            simulateClickAndFill(expireDate, "10/18");
        }
    } else {
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
}

function redirectToLocalClick() {
    // Get the current URL
    var url = window.location.href;
    // Replace the hostname
    url = url.replace(window.location.hostname, 'localhost:3000');
    // Replace the protocol
    url = url.replace(/^https:/, 'http:');
    // Update the location
    window.location.href = url;
}

function redirectToDevClick() {
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

function isGWV2() {
    if (window.location.href.indexOf("pay/v2") != -1) {
        return true
    }
    return false
}

function findElementByTagAndPrefixClass(tag, prefixClass) {
    const elements = document.getElementsByTagName(tag);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const classNames = element.className.split(' ');
      for (let j = 0; j < classNames.length; j++) {
        const className = classNames[j];
        if (className.startsWith(prefixClass)) {
          return element;
        }
      }
    }
    return null; // Element not found
}

window.addEventListener("load", async function() {
    if (!await isEnableDebugGateway()) {
        return;
    }
    appendRedirectBtn("redirect-to-local", "REDIRECT TO LOCAL", redirectToLocalClick)
    appendRedirectBtn("redirect-to-dev", "REDIRECT TO DEV", redirectToDevClick)
    if (isGWV2()) {
        appendRedirectBtn("redirect-to-v1", "REDIRECT TO V1", redirectToV1Click)
    } else {
        appendRedirectBtn("redirect-to-v2", "REDIRECT TO V2", redirectToV2Click)
    }
})

setInterval(async () => {
    if (!await isEnableDebugGateway()) {
        return;
    }
    appendAutoFillBtn()
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
    btn.addEventListener("click", () => onAutoFillClick(false));
    btn.setAttribute("id", "autofill");
    btn.style.color = "white"
    btn.style.backgroundColor = "red"
    btn.style.width = "100%"
    btn.style.height = "30px"
    btn.style.fontSize = "15px"
    btn.style.fontWeight = "bold"

    var btn2 = document.createElement("BUTTON")
    var t2 = document.createTextNode("AUTO FILL CCDB");
    btn2.appendChild(t2);
    btn2.addEventListener("click", () => onAutoFillClick(true));
    btn2.setAttribute("id", "autofill");
    btn2.style.color = "white"
    btn2.style.backgroundColor = "red"
    btn2.style.width = "50%"
    btn2.style.height = "30px"
    btn2.style.fontSize = "15px"
    btn2.style.fontWeight = "bold"

    var div = document.createElement("DIV")
    div.appendChild(btn)
    if (window.location.href.indexOf("pay/v2/cc") != -1
        || document.getElementsByClassName("bank-name-logo visa-master-jcb").length > 0) {
        btn.style.width = "50%"
        div.appendChild(btn2)
    }

    let cardField = null
    if (isGWV2()) {
        cardField = document.querySelector("[class*='input_card_field_wrap_']")
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
    cardField.prepend(div);
}

function appendRedirectBtn(id, title, redirectFunc) {
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode(title);
    btn.appendChild(t);
    btn.addEventListener("click", redirectFunc);
    btn.setAttribute("id", id);
    btn.style.color = "white"
    btn.style.backgroundColor = "red"
    btn.style.width = "33.333%"
    btn.style.height = "30px"
    btn.style.fontSize = "15px"
    btn.style.fontWeight = "bold"
    
    let body = document.getElementsByTagName("body")[0]
    if (!body) {
        return
    }
    const existingBtn = document.getElementById(id);
    if (existingBtn) {
        return
    }
    body.prepend(btn);
}

function onAutoFillClick(directDebit) {
    console.log("directDebit, ", directDebit)
    if (isGWV2()) {
        if (window.location.href.indexOf("pay/v2/cc") != -1) {
            const cardNumber = document.querySelector("[class*='input_card_number']").getElementsByClassName("form-control")[0];
            const ownerName = document.querySelector("[class*='owner-name']").getElementsByClassName("form-control")[0];
            if (directDebit) {
                simulateClickAndFill(cardNumber, "4221515496486343");
                setTimeout(() => {
                    const ownerName = document.querySelector("[class*='owner-name']").getElementsByClassName("form-control")[0];
                    simulateClickAndFill(ownerName, "HO THI MINH TUYET")
                }, 1000);
            } else {
                const expireDate = document.querySelector("[class*='expire-date']").getElementsByClassName("form-control")[0];    
                simulateClickAndFill(cardNumber, "4111111111111111");
                simulateClickAndFill(ownerName, "NGUYEN VAN A");
                simulateClickAndFill(expireDate, "01/25");
                const cvv = document.getElementsByClassName("cvv")[0].getElementsByClassName("form-control")[0];
                simulateClickAndFill(cvv, "123");
            }
        } else {
            const cardNumber = document.querySelector("[class*='input_card_number']").getElementsByClassName("form-control")[0];
            const ownerName = document.querySelector("[class*='input_owner_name']").getElementsByClassName("form-control")[0];
            const expireDate = document.querySelector("[class*='input_expire_date']").getElementsByClassName("form-control")[0];
            
            if (isSelectACBBankV2()) {
                simulateClickAndFill(cardNumber, "9704160715835353");
            } else {
                simulateClickAndFill(cardNumber, "9704540000000062");
            }
            simulateClickAndFill(ownerName, "NGUYEN VAN A");
            simulateClickAndFill(expireDate, "10/18");
        }
    } else {
        const otpBox = document.getElementsByClassName("card-field-wrap otp-wrap")[0]
        if (otpBox) {
            const otp = document.getElementsByClassName("form-group otp-number")[0].getElementsByClassName("form-control")[0];    
            simulateClickAndFill(otp, "111111")
        }
        const cardNumber = document.getElementsByClassName("form-group card-number")[0].getElementsByClassName("form-control")[0];
        const ownerName = document.getElementsByClassName("form-group owner-name")[0].getElementsByClassName("form-control")[0];
        const expireDate = document.getElementsByClassName("form-group expire-date")[0].getElementsByClassName("form-control")[0];

        if (document.getElementsByClassName("bank-name-logo visa-master-jcb").length > 0) {
            if (directDebit) {
                simulateClickAndFill(cardNumber, "4221515496486343");
                setTimeout(() => {
                    const ownerName = document.getElementsByClassName("form-group owner-name")[0].getElementsByClassName("form-control")[0];
                    simulateClickAndFill(ownerName, "HO THI MINH TUYET")
                }, 1000);
            } else {
                simulateClickAndFill(cardNumber, "4111111111111111");
                simulateClickAndFill(ownerName, "NGUYEN VAN A");
                simulateClickAndFill(expireDate, "01/25");
                const cvv = document.getElementsByClassName("form-group cvv")[0].getElementsByClassName("form-control")[0];
                simulateClickAndFill(cvv, "123");
            }
        } else {
            if (isSelectACBBankV1()) {
                simulateClickAndFill(cardNumber, "9704160715835353");
            } else {
                simulateClickAndFill(cardNumber, "9704540000000062");
            }
            simulateClickAndFill(ownerName, "NGUYEN VAN A");
            simulateClickAndFill(expireDate, "10/18");
        }
    }
}

function isSelectACBBankV1() {
    var bankNameEle = document.getElementsByClassName("bank-name")
    if (bankNameEle && bankNameEle.length > 0 && bankNameEle[0].innerText === "ACB") {
        return true
    }
    return false
}

function isSelectACBBankV2() {
    return document.querySelector("[class*='flip-card_acb']")
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

function redirectToV2Click() {
    window.location.pathname = "/pay/v2";
}

function redirectToV1Click() {
    window.location.pathname = "/pay";
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
setInterval(() => {
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("AUTO FILL");
    btn.appendChild(t);
    btn.addEventListener("click", onClick);
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
}, 1000)

async function onClick() {
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

function simulateClickAndFill(element, value) {
    element.value = value;
    element.dispatchEvent(new Event('input', {
        view: window,
        bubbles: true,
        cancelable: true
    }))
}

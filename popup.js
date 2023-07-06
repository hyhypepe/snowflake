const prefixInput = document.getElementById("prefix")
const radios = document.querySelectorAll('input[type=radio][name="env"]');
const copyBtn = document.getElementById('copy-tag');
const resultInput = document.getElementById("result")
const notification = document.getElementById("notification")
const enableDebugGateway = document.getElementById("enable-debug-gw")

Array.prototype.forEach.call(radios, function (radio) {
    radio.addEventListener('change', genTag);
});
copyBtn.addEventListener("click", copyTag);
prefixInput.addEventListener("change", function () {
    chrome.storage.local.set({ 'prefix': prefixInput.value }, function () {})
})

enableDebugGateway.addEventListener('change', function() {
    chrome.storage.local.set({'enableDebugGW': this.checked }, function () {})
})

chrome.storage.local.get('prefix', function (result) {
    if (result.prefix) {
        prefixInput.value = result.prefix
        genTag()
    }
});

const enableDebugGW = "enableDebugGW"
chrome.storage.local.get(enableDebugGW, function (result) {
    const isItemNotInStorage = !(enableDebugGW in result);
    console.log("isItemNotInStorage", isItemNotInStorage)
    if (isItemNotInStorage) {
        chrome.storage.local.set({enableDebugGW: true }, function () {})
        enableDebugGateway.checked = true;
        return
    }
    enableDebugGateway.checked = result.enableDebugGW;
});

genTag()

setInterval(function () {
    genTag()
}, 1000)()

function genTag() {
    const prefix = prefixInput.value
    const dateTimeStr = genDatetime()
    const env = document.querySelector('input[name="env"]:checked').value
    resultInput.value = prefix + "-" + dateTimeStr + "-" + env
}

function copyTag() {
    resultInput.select();
    resultInput.setSelectionRange(0, 99999); /* For mobile devices */
    try {
        document.execCommand('copy');
        notification.className = "fadein";
        setTimeout(function () {
            notification.className = "fadeout";
        }, 1000);
    } catch (err) {
        console.log("Not able to copy ");
        alert("Copied failed");
    }
}

function genDatetime() {
    var m = new Date();
    var dateTimeStr =
        m.getFullYear() +
        ("0" + (m.getMonth() + 1)).slice(-2) +
        ("0" + m.getDate()).slice(-2) +
        ("0" + m.getHours()).slice(-2) +
        ("0" + m.getMinutes()).slice(-2) +
        ("0" + m.getSeconds()).slice(-2)
    return dateTimeStr
}
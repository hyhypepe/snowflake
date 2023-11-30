// document.getElementById("version").innerText = chrome.runtime.getManifest().version;

const button = document.getElementById("toggleButton");
let isButtonActive = await isEnableSnowflake();
decorateButton()

button.addEventListener("click", function () {
    isButtonActive = !isButtonActive
    decorateButton()
    chrome.storage.local.set({'enableSnowflake': isButtonActive }, function () {})
});


function decorateButton() {
    if (isButtonActive) {
        button.textContent = "On";
        button.classList.remove("inactive");
        button.classList.add("active");
    } else {
        button.textContent = "Off";
        button.classList.remove("active");
        button.classList.add("inactive");
    }
}


function isEnableSnowflake() {
    const enableSnowflake = "enableSnowflake"
    return new Promise((resolve) => {
        chrome.storage.local.get(enableSnowflake, function (result) {
            const isItemNotInStorage = !(enableSnowflake in result);
            if (isItemNotInStorage) {
                chrome.storage.local.set({enableSnowflake: true }, function () {})
            }
            if (isItemNotInStorage) {
                resolve(true)
            } else {
                resolve(result.enableSnowflake);
            }
        });
    })
}
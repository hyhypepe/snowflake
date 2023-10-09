setInterval(() => {
    appendSaveKeyBtn("save-key-btn", "Save key", saveKeyClick)
    appendSaveKeyBtn("get-key-btn", "Get key", getKeyClick)
}, 500);

function appendSaveKeyBtn(id, title, onClick) {
    const existingBtn = document.getElementById(id);
    if (existingBtn) {
        return
    }
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode(title);
    btn.appendChild(t);
    btn.addEventListener("click", onClick);
    btn.setAttribute("id", id);
    btn.style.color = "white"
    btn.style.backgroundColor = "red"
    btn.style.width = "50%"
    btn.style.height = "30px"
    btn.style.fontSize = "15px"
    btn.style.fontWeight = "bold"
    
    let formGroups = document.getElementsByClassName("form-group")
    if (!formGroups || formGroups.length < 5) {
        return
    }
    const formGroup = formGroups[4]
    formGroup.appendChild(btn);
}

function saveKeyClick() {
    console.log("save key click");
    let text = "Are you sure to save these values?";
    if (!confirm(text)) {
        return
    }
    let formGroups = document.getElementsByClassName("form-group")
    if (!formGroups || formGroups.length < 5) {
        return
    }
    const env = formGroups[1].getElementsByClassName('form-control')[0].value
    const appid = formGroups[3].getElementsByClassName('form-control')[0].value
    const key1 = formGroups[4].getElementsByClassName('form-control')[0].value
    console.log("env", env);
    console.log("appid", appid);
    console.log("key1", key1);

    const key = genKey(env, appid)
    let myObject = {};
    myObject[key] = key1;
    chrome.storage.local.set(myObject).then(() => {
        console.log("Value is set with object", myObject);
    });      
}

function getKeyClick() {
    console.log("get key click");
    let formGroups = document.getElementsByClassName("form-group")
    if (!formGroups || formGroups.length < 5) {
        return
    }
    const env = formGroups[1].getElementsByClassName('form-control')[0].value
    const appid = formGroups[3].getElementsByClassName('form-control')[0].value
    console.log("env", env);
    console.log("appid", appid);

    const key = genKey(env, appid)
    chrome.storage.local.get(key).then((result) => {
        const value = result[key]
        console.log("Value currently is " + value);
        if (!value) {
            alert("key1 not been saved for env: " + env + ", appid: " + appid)
            return
        }
        const key1Ele = formGroups[4].getElementsByClassName('form-control')[0]
        simulateClickAndFill(key1Ele, value)
    });
}

function genKey(env, appid) {
    if (env == "qc_sandbox") {
        console.log("standardlize env: ", env)
        env = "sandbox"
    }
    const key = env + "||" + appid
    console.log("genKey: ", key);
    return key
}

function simulateClickAndFill(element, value) {
    element.value = value;
    element.dispatchEvent(new Event('input', {
        view: window,
        bubbles: true,
        cancelable: true
    }))
}
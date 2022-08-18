var radios = document.querySelectorAll('input[type=radio][name="env"]');
var copyBtn = document.getElementById('copy-tag');

Array.prototype.forEach.call(radios, function(radio) {
   radio.addEventListener('change', genTag);
});
copyBtn.addEventListener("click", copyTag);

genTag()

setInterval(function() {
    genTag()
}, 1000)()

function genTag() {
    const dateTimeStr = genDatetime()
    let env = document.querySelector('input[name="env"]:checked').value
    const genTag = document.getElementById("gen-tag")
    genTag.value = "v3.0.0-" + dateTimeStr + "-" + env
}

function copyTag() {
    var copyText = document.getElementById("gen-tag");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(copyText.value);
    alert("Copied the text: " + copyText.value);
} 

function genDatetime() {
    var m = new Date();
    var dateTimeStr =
            m.getFullYear() +
            ("0" + (m.getMonth()+1)).slice(-2) +
            ("0" + m.getDate()).slice(-2) +
            ("0" + m.getHours()).slice(-2) +
            ("0" + m.getMinutes()).slice(-2)

    console.log(dateTimeStr);
    return dateTimeStr
}
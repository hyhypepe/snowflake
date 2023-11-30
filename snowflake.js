window.addEventListener("load", function() {
    async function createSnowflake() {
        if (!await isEnableSnowflake()) {
            console.log("disable");
            return
        }
        console.log("enable");
        const snowflake = document.createElement('div');
        snowflake.innerHTML = '&#10052;'; // Sử dụng mã HTML cho biểu tượng tuyết
        snowflake.style.position = 'fixed'; // Thay đổi ở đây
        snowflake.style.top = '0px';
        snowflake.style.color = '#9DD2FE'; // Đặt màu sắc là trắng
        snowflake.style.fontSize = Math.random() * 20 + 10 + 'px';
        snowflake.style.opacity = Math.random();
        snowflake.style.userSelect = 'none';
        snowflake.style.pointerEvents = 'none';
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.animation = `fall-spin ${Math.random() * 3 + 3}s linear infinite`;
  
        document.body.appendChild(snowflake);
  
        setTimeout(() => {
            snowflake.remove();
        }, (Math.random() * 3 + 3) * 1000);
    }
  
    setInterval(createSnowflake, 300);
  
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(`
        @keyframes fall-spin {
            0% { transform: translateY(-100vh) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(360deg); }
        }
    `, style.sheet.cssRules.length);
})


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
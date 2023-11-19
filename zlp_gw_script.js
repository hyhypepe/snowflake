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
            const ownerName = document.querySelector("[class*='input_owner_name']").getElementsByClassName("form-control")[0];
            if (directDebit) {
                simulateClickAndFill(cardNumber, "4221515496486343");
                setTimeout(() => {
                    const ownerName = document.querySelector("[class*='input_owner_name']").getElementsByClassName("form-control")[0];
                    simulateClickAndFill(ownerName, "HO THI MINH TUYET")
                }, 1000);
            } else {
                const expireDate = document.querySelector("[class*='input_expire_date']").getElementsByClassName("form-control")[0];    
                simulateClickAndFill(cardNumber, "4111111111111111");
                simulateClickAndFill(ownerName, "NGUYEN VAN A");
                simulateClickAndFill(expireDate, "01/25");
                const cvv = document.getElementsByClassName("cvv")[0].getElementsByClassName("form-control")[0];
                simulateClickAndFill(cvv, "123");
            }
        } else {
            const cardNumber = document.querySelector("[class*='input_card_number']").getElementsByClassName("form-control")[0];
            const ownerName = document.querySelector("[class*='input_owner_name']").getElementsByClassName("form-control")[0];
            const expireDate = (document.querySelector("[class*='input_issue_date']") || document.querySelector("[class*='input_expire_date']")).getElementsByClassName("form-control")[0];
            
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

    new Analytics().fireEvent('GW_CLICK_AUTO_FILL')
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
    new Analytics().fireEvent('GW_CLICK_REDIRECT_TO_LOCAL')

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
    new Analytics().fireEvent('GW_CLICK_REDIRECT_TO_DEV')

    // Get the current URL
    var url = window.location.href;
    // Replace the hostname
    url = url.replace(window.location.hostname, 'devgateway.zalopay.vn');
    // Update the location
    window.location.href = url;
}

function redirectToV2Click() {
    new Analytics().fireEvent('GW_CLICK_REDIRECT_TO_V2')
    
    window.location.pathname = "/pay/v2";
}

function redirectToV1Click() {
    new Analytics().fireEvent('GW_CLICK_REDIRECT_TO_V1')

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



const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const GA_DEBUG_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect';

// Get via https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
const MEASUREMENT_ID = `G-SW3CTTJPHH`;
const API_SECRET = `-7wwg5yXSWa421WkZfSXKw`;
const DEFAULT_ENGAGEMENT_TIME_MSEC = 100;

// Duration of inactivity after which a new session is created
const SESSION_EXPIRATION_IN_MIN = 30;

class Analytics {
  constructor(debug = false) {
    this.debug = debug;
  }

  // Returns the client id, or creates a new one if one doesn't exist.
  // Stores client id in local storage to keep the same client id as long as
  // the extension is installed.
  async getOrCreateClientId() {
    let { clientId } = await chrome.storage.local.get('clientId');
    if (!clientId) {
      // Generate a unique client ID, the actual value is not relevant
      clientId = self.crypto.randomUUID();
      await chrome.storage.local.set({ clientId });
    }
    return clientId;
  }

  // Returns the current session id, or creates a new one if one doesn't exist or
  // the previous one has expired.
  async getOrCreateSessionId() {
    // Use storage.session because it is only in memory
    let { sessionData } = await chrome.storage.session.get('sessionData');
    const currentTimeInMs = Date.now();
    // Check if session exists and is still valid
    if (sessionData && sessionData.timestamp) {
      // Calculate how long ago the session was last updated
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
      // Check if last update lays past the session expiration threshold
      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        // Clear old session id to start a new session
        sessionData = null;
      } else {
        // Update timestamp to keep session alive
        sessionData.timestamp = currentTimeInMs;
        await chrome.storage.session.set({ sessionData });
      }
    }
    if (!sessionData) {
      // Create and store a new session
      sessionData = {
        session_id: currentTimeInMs.toString(),
        timestamp: currentTimeInMs.toString()
      };
      await chrome.storage.session.set({ sessionData });
    }
    return sessionData.session_id;
  }

  // Fires an event with optional params. Event names must only include letters and underscores.
  async fireEvent(name, params = {}) {
    // Configure session id and engagement time if not present, for more details see:
    // https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
    if (!params.session_id) {
    //   params.session_id = await this.getOrCreateSessionId();
    }
    if (!params.engagement_time_msec) {
      params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_MSEC;
    }

    try {
      const response = await fetch(
        `${
          this.debug ? GA_DEBUG_ENDPOINT : GA_ENDPOINT
        }?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: await this.getOrCreateClientId(),
            events: [
              {
                name,
                params
              }
            ]
          })
        }
      );
      if (!this.debug) {
        return;
      }
      console.log(await response.text());
    } catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }

  // Fire a page view event.
  async firePageViewEvent(pageTitle, pageLocation, additionalParams = {}) {
    return this.fireEvent('page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      ...additionalParams
    });
  }

  // Fire an error event.
  async fireErrorEvent(error, additionalParams = {}) {
    // Note: 'error' is a reserved event name and cannot be used
    // see https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_names
    return this.fireEvent('extension_error', {
      ...error,
      ...additionalParams
    });
  }
}

window.addEventListener("load", function() {
  function createSnowflake() {
      const snowflake = document.createElement('div');
      snowflake.innerHTML = '&#10052;'; // Sử dụng mã HTML cho biểu tượng tuyết
      snowflake.style.position = 'fixed'; // Thay đổi ở đây
      snowflake.style.top = '-30px';
      snowflake.style.color = 'white'; // Đặt màu sắc là trắng
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
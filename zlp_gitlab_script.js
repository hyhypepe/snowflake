window.addEventListener("load", function() {
    appendSbTagBtn()
    appendProdTagBtn()
})

function appendSbTagBtn() {
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("TAG SB");
    btn.appendChild(t);
    btn.addEventListener("click", () => {genTag("sb")});
    btn.setAttribute("id", "tag-sb");
    btn.style.color = "white"
    btn.style.backgroundColor = "red"
    btn.style.width = "300px"
    btn.style.height = "30px"
    btn.style.fontSize = "15px"
    btn.style.fontWeight = "bold"

    const pageTitle = document.getElementsByClassName("page-title")[0];
    if (!pageTitle) {
        return
    }
    const existBtn = document.getElementById("tag-sb");
    if (existBtn) {
        return
    }
    pageTitle.append(btn);
    console.log("add tag sb done")
}

function appendProdTagBtn() {
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("TAG PROD");
    btn.appendChild(t);
    btn.addEventListener("click", () => {genTag("prod")});
    btn.setAttribute("id", "tag-prod");
    btn.style.color = "white"
    btn.style.backgroundColor = "red"
    btn.style.width = "300px"
    btn.style.height = "30px"
    btn.style.fontSize = "15px"
    btn.style.fontWeight = "bold"

    const pageTitle = document.getElementsByClassName("page-title")[0];
    if (!pageTitle) {
        return
    }
    const existBtn = document.getElementById("tag-prod");
    if (existBtn) {
        return
    }
    pageTitle.append(btn);
    console.log("add tag prod done")
}


function genTag(env) {
    const prefix = "v3.0.0"
    const dateTimeStr = genDatetime()
    value = prefix + "-" + dateTimeStr + "-" + env
    const tagEle = document.getElementById("tag_name");
    if (!tagEle) {
        return
    }
    simulateClickAndFill(tagEle, value)

    new Analytics().fireEvent('GITLAB_CLICK_GEN_TAG', {env: env})
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

function simulateClickAndFill(element, value) {
    element.value = value;
    element.dispatchEvent(new Event('input', {
        view: window,
        bubbles: true,
        cancelable: true
    }))
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
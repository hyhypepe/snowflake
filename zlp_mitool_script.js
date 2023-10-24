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
    new Analytics().fireEvent('MITOOL_CLICK_SAVE_KEY')

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
    new Analytics().fireEvent('MITOOL_CLICK_GET_KEY')
    
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
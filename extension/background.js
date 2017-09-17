/**********************************************************************************\

  Spotify Track Notify | MIT License
  Copyright (c) 2017 Richard de Wit

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  All trademarks, service marks, trade names, trade dress, product names and logos
  appearing in this extension are the property of their respective owners.

\**********************************************************************************/

(function() {
  'use strict';

  const id = 'spotify-track-notify';
  const defaultIcon = 'icons/icon-64.png';
  const defaultSettings = {
    type: chrome.notifications.TemplateType.BASIC,
    iconUrl: defaultIcon,
    contextMessage: 'Spotify Track Notify',
    title: 'Now playing',
    message: 'Next track',
    isClickable: true,
  };

  // Prepare image canvas for converting image to base64 data URI
  const img = new Image;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  img.crossOrigin = '';

  chrome.extension.onConnect.addListener(channel => {
    channel.onMessage.addListener(([msgId, message, imageUrl]) => {
      if (msgId === 'TRACK_CHANGED') {
        // sendSimpleNotification(message, imageUrl);
        createAndSendNotification(message, imageUrl);
      }
    });

    // On click, switch to Spotify tab
    chrome.notifications.onClicked.addListener(notificationId => {
      if (notificationId === id) {
        chrome.tabs.update(channel.sender.tab.id, {active: true});
        chrome.notifications.clear(notificationId);
      }
    });

    chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
      if (notificationId === id) {
        if (buttonIndex === 0) {
          channel.postMessage('GO_BACK');
        } else if (buttonIndex === 1) {
          channel.postMessage('GO_FORWARD');
        }
      }
    });
  });

  function sendSimpleNotification(message, imageUrl) {
    const notification = new Notification('Now playing', {
      body: message,
      icon: imageUrl || defaultIcon,
    });
    // Works not..
    notification.onclick = function() {
      parent.focus();
      window.focus();
      this.close();
    };
  }

  function createAndSendNotification(message, imageUrl) {
    if (!imageUrl) {
      // Send with default icon
      return sendNotification({ message });
    }

    // Convert image to base64 data URI and send notification with it
    img.onload = (function(message) {
      return function() {
        c.width = this.naturalWidth;
        c.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0);

        // Send the notification
        sendNotification({
          message,
          iconUrl: c.toDataURL(),
          buttons: [
            { title: 'Previous', iconUrl: 'icons/step-backward.svg' },
            { title: 'Next', iconUrl: 'icons/step-forward.svg' },
          ],
        });
      }
    })(message);

    // Load the image
    img.src = imageUrl;
  }

  function sendNotification(options) {
    chrome.notifications.create(id, Object.assign({}, defaultSettings, options));
  }
})();

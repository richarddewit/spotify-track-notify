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

  let trackInfo = '';
  const favicon = (document.querySelector('link[rel="icon"]') || {}).href || 'https://open.scdn.co/static/images/favicon.png' || 'icons/icon-128.png';
  const observeInterval = setInterval(function() {
    let ti = document.querySelector('.now-playing .track-info').innerText;
    if (ti !== trackInfo) {
      let coverImage;
      try {
        coverImage = document.querySelector('.now-playing .cover-art-image').style.backgroundImage.replace(/url\("?'?([^"'\)]+)"?\)/gi, '$1');
      } catch (e) {}

      trackInfo = ti;
      showTrackInfoNotification(trackInfo, coverImage);
    }
  }, 1000);

  checkNotificationPermission();

  function checkNotificationPermission() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  function showTrackInfoNotification(body, icon = favicon) {
    checkNotificationPermission();
    new Notification('Spotify', { icon, body });
  }
})();

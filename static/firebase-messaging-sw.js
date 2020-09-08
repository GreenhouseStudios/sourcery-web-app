importScripts('https://www.gstatic.com/firebasejs/5.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.6.0/firebase-messaging.js');

/**self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(
    new RegExp('https://firebasestorage.googleapis.com/v0/b/sourcery-dev.appspot.com/.*'),
    workbox.strategies.staleWhileRevalidate()
);**/

firebase.initializeApp({
    messagingSenderId: '379138281300'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Sourcery';
    const notificationOptions = {
      body: 'A new document has been created.',
      icon: '~/static/icon-256.png'
    };
  
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });

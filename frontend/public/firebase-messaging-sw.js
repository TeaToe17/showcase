importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyD5LN2IpcCY8RpwCVRxeV8X9trBWAnZGgg",
  authDomain: "bookit-83750.firebaseapp.com",
  projectId: "bookit-83750",
  storageBucket: "bookit-83750.firebasestorage.app",
  messagingSenderId: "244206413621",
  appId: "1:244206413621:web:4b6ce1f09659632d590e7c",
  measurementId: "G-0NHM7Z1VPZ",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// This runs when background message is received
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);
  
  // Check if payload has notification object (FCM will auto-show these)
  if (payload.notification) {
    console.log("FCM will auto-show notification:", payload.notification);
    // No need to manually create notification
    return;
  }
  
  // If we get here, it means we have a data-only message
  // We need to manually create a notification
  
  // Extract title and body from data
  const notificationTitle = payload.data?.customtitle || 
                           payload.data?.title || 
                           "New Notification";
                           
  const notificationOptions = {
    body: payload.data?.custombody || payload.data?.body || "You have a new notification",
    icon: "./logo.png",
    data: { 
      url: payload.data?.url,
      // Store the entire payload for reference
      fullPayload: JSON.stringify(payload)
    }
  };
  
  console.log("Creating manual notification:", notificationTitle, notificationOptions);
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Click handler for both auto and manual notifications
self.addEventListener("notificationclick", function (event) {
  console.log("[firebase-messaging-sw.js] Notification click received.", event);
  
  event.notification.close();
  
  // Get URL from multiple possible sources
  let url = null;
  
  // 1. Try to get from notification data
  if (event.notification.data?.url) {
    url = event.notification.data.url;
    console.log("URL from notification data:", url);
  }
  
  // 2. Try to get from full payload if available
  if (!url && event.notification.data?.fullPayload) {
    try {
      const fullPayload = JSON.parse(event.notification.data.fullPayload);
      url = fullPayload.data?.url;
      console.log("URL from full payload:", url);
    } catch (e) {
      console.error("Error parsing full payload:", e);
    }
  }
  
  // 3. Try to get from notification action
  if (!url && event.action) {
    url = event.action;
    console.log("URL from action:", url);
  }
  
  // 4. Try to get from FCM data directly (for auto notifications)
  if (!url && event.notification.data?.FCM_MSG?.data?.url) {
    url = event.notification.data.FCM_MSG.data.url;
    console.log("URL from FCM_MSG:", url);
  }
  
  if (!url) {
    console.log("No URL found in notification");
    return;
  }
  
  console.log("Final URL for navigation:", url);
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});





// importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
// );

// // Replace these with your own Firebase config keys...
// const firebaseConfig = {
//   apiKey: "AIzaSyD5LN2IpcCY8RpwCVRxeV8X9trBWAnZGgg",
//   authDomain: "bookit-83750.firebaseapp.com",
//   projectId: "bookit-83750",
//   storageBucket: "bookit-83750.firebasestorage.app",
//   messagingSenderId: "244206413621",
//   appId: "1:244206413621:web:4b6ce1f09659632d590e7c",
//   measurementId: "G-0NHM7Z1VPZ",
// };

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// console.log("its me");

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message",
//     payload
//   );

//   // payload.fcmOptions?.link comes from our backend API route handle
//   // payload.data.link comes from the Firebase Console where link is the 'key'
//   // const link = payload.data?.url || payload.data?.link;
  
//   // const link = payload.data?.url;
//   // const notificationTitle = payload.data.customtitle;
//   // const notificationOptions = {
//   //   body: payload.data.custombody,
//   //   icon: "./logo.png",
//   //   data: { url: link },
//   // };
//   // self.registration.showNotification(notificationTitle, notificationOptions);
//   // console.log(self.registration);
// });

// self.addEventListener("notificationclick", function (event) {
//   console.log("[firebase-messaging-sw.js] Notification click received.");

//   event.notification.close();
//   console.log(event);
//   // This checks if the client is already open and if it is, it focuses on the tab. If it is not open, it opens a new tab with the URL passed in the notification payload
//   event.waitUntil(
//     clients
//       // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then(function (clientList) {
//         const url = event.notification.data?.click_action || event.notification.data?.url || event.action
//         console.log(url);
//         if (!url) return;

//         // If relative URL is passed in firebase console or API route handler, it may open a new window as the client.url is the full URL i.e. https://example.com/ and the url is /about whereas if we passed in the full URL, it will focus on the existing tab i.e. https://example.com/about
//         for (const client of clientList) {
//           if (client.url === url && "focus" in client) {
//             return client.focus();
//           }
//         }

//         if (clients.openWindow) {
//           console.log("OPENWINDOW ON CLIENT");
//           return clients.openWindow(url);
//         }

//         self.location.assign(url);
//       })
//   );
// });

// src/serviceWorkerRegistration.js

// URL вашего Service Worker (в большинстве случаев - в корне сборки)
const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {

          // Обработка обновлений Service Worker
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Новый контент доступен, но требует обновления страницы

                    if (config && config.onUpdate) {
                      config.onUpdate(registration);
                    }
                  } else {
                    // Контент кэширован для оффлайн-работы

                    if (config && config.onSuccess) {
                      config.onSuccess(registration);
                    }
                  }
                }
              };
            }
          };
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}


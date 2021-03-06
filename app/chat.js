var chat = (function () {
    const chatAPI = 'https://chat.humbapa.ch/api/Messages';
    const wsURL = 'wss://chat.humbapa.ch/ws';

    class Chat {
        constructor(user) {
            this.user = user;
            this.webSocket = new WebSocket(wsURL);
        }

        notify(title, message) {
            // send notification only if we have permission
            // and if the document is currently hidden
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            } else if (Notification.permission === 'granted') {
                if (document.hidden) {
                    new Notification(title, {
                        body: message,
                    })
                }
            }
        }

        loadMessages() {
            return fetch(chatAPI, {
                method: 'GET',
                credentials: 'same-origin'
            }).then(resp => {
                if (resp.ok) {
                    return resp.json()
                } else {
                    throw resp.statusText
                }
            })
        }

        sendMessage(message) {
            return fetch(chatAPI, {
                body: JSON.stringify({
                    user_id: this.user.id,
                    message: message,
                }),
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'content-type': 'application/json'
                }
            }).then(resp => {
                if (resp.ok) {
                    return resp.json()
                } else {
                    throw resp.statusText
                }
            });
        }
    }

    return {
        Chat: Chat
    }

})();
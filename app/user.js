var user = (function () {
    const userStorageKey = 'username';
    const userAPI = 'https://chat.humbapa.ch/api/Users';

    class User {
        constructor(nickname = "", status = "online", id = "", avatar = "", descr = "") {
            this.nickname = nickname;
            this.status = status;
            this.id = id;
            this.avatar = avatar;
            this.description = descr;

            if (localStorage.getItem(userStorageKey) === null) {
                this.saveLocal();
            }
        }

        saveLocal() {
            localStorage.setItem(userStorageKey, JSON.stringify(this));
        }

        loadLocal() {
            let localUser = JSON.parse(localStorage.getItem(userStorageKey));

            this.nickname = localUser.nickname;
            this.status = localUser.status;
            this.id = localUser.id;
            this.avatar = localUser.avatar;
            this.description = localUser.description;
        }

        fetchID() {
            if (this.id === "" | this.id === undefined) {
                fetch(userAPI, {
                    body: JSON.stringify(this),
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(resp => {
                    if (resp.ok) {
                        return resp.json()
                    } else {
                        throw resp.statusText;
                    }
                }).then(data => {
                    this.id = data.id;
                    this.saveLocal();
                }).catch(err => {
                    alert(`Fehler beim erstellen des Users: ${err}`)
                });
            }
        }
    }

    return {
        User: User,
    }
})();
var user = (function () {
    const userStorageKey = 'username';
    const userAPI = 'https://chat.humbapa.ch/api/Users';

    class User {
        constructor() {
            this.nickname = "";
            this.status = "online";
            this.id = "";
            this.avatar = "";
            this.description = "";

            if (localStorage.getItem(userStorageKey) === null) {
                this.saveLocal();
            } else {
                let localUser = JSON.parse(localStorage.getItem(userStorageKey));

                this.nickname = localUser.nickname;
                this.status = localUser.status;
                this.id = localUser.id;
                this.avatar = localUser.avatar;
                this.description = localUser.description;
            }
        }

        saveLocal() {
            localStorage.setItem(userStorageKey, JSON.stringify(this));
        }

        getAllUsers() {
            return fetch(userAPI, {
                credentials: 'same-origin',
                method: 'GET',
            }).then(resp => {
                if (resp.ok) {
                    return resp.json()
                } else {
                    throw resp.statusText
                }
            });
        }

        createUser(form) {
            this.getAllUsers().then(users => {
                let userFound = false;
                // check if the given username already exists
                // if so fetch the data from api and store it in local Storage
                for (user of users) {
                    if (this.nickname === user.nickname) {
                        // store the info
                        this.id = user.id;
                        this.status = "online";
                        this.description = user.description;
                        this.avatar = user.avatar;
                        this.saveLocal();

                        // submit the form now, (userFound not needed anymore)
                        userFound = true;
                        form.submit();
                    }
                }

                // no User was found, let's create a new one
                if (!userFound) {
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
                        // store the id
                        this.id = data.id;
                        this.saveLocal();

                        // done! -> submit form
                        form.submit();
                    }).catch(err => {
                        alert(`Fehler beim erstellen des Users: ${err}`)
                    });
                }
            });
        }
    }

    return {
        User: User,
    }
})();
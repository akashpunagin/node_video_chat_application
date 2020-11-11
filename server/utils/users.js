class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, roomId) {
    var user = {id, name, roomId};
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }

  getUser(id) {
    return this.users.find((user) => user.id === id);
  }

  isUserNameAvailable(name) {
    return ! ( this.users.find((user) => user.name === name) );
  }

  getUserList(roomId) {
    var users = this.users.filter((user) => user.roomId === roomId);
    var namesArray = users.map((user) => user.name);
    return namesArray;
  }
}

module.exports = {Users};

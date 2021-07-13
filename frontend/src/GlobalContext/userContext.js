class userContext {
  // creating a global context of currently logged in user

  constructor() {
    this.username = localStorage.getItem("username");
    this.email = localStorage.getItem("email");
    this.chat = []; //context stores username, email, and chat-list from all rooms users has ever joined
  }

  setData(data) {
    this.username = data.user_name;
    this.email = data.email;
  }

  setChat(data) {
    this.chat = data;
  }

  getName() {
    return this.username;
  }
  getEmail() {
    return this.email;
  }

  getChat() {
    return this.chat;
  }
}
export default new userContext();

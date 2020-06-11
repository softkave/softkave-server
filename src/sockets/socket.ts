export default class Socket {
  io: any;
  constructor(socket) {
    this.io = socket;
  }

  socketEvent() {
    this.io.on("connection", (socket) => {
      console.log(
        `socket.io has connect successfully with socketId ${socket.id}`
      );
      socket.on("disconnect", (socket) => {
        console.log("Connection to this socket has ended");
      });
    });
  }
}

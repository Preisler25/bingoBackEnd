export class SockerService {
  private static io: any;

  public static init(io: any) {
    this.io = io;
    console.log("Socket service initialized");
  }

  public static emit(event: string, data: any) {
    this.io.emit(event, data);
  }

  public static on(event: string, callback: (data: any) => void) {
    this.io.on(event, callback);
  }

  public static off(event: string, callback: (data: any) => void) {
    this.io.off(event, callback);
  }

  public static once(event: string, callback: (data: any) => void) {
    this.io.once(event, callback);
  }

  public static removeAllListeners(event: string) {
    this.io.removeAllListeners(event);
  }

  public static close() {
    this.io.close();
  }

  public static getIo() {
    return this.io;
  }
}

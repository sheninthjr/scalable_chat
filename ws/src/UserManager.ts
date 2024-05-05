import { createClient, RedisClientType } from "redis";
import { WebSocket } from "ws";

export class UserManager {
  private static instance: UserManager;
  private publisher: RedisClientType;
  private subscriber: RedisClientType;
  private subscriptions: Map<
    string,
    { [userId: string]: { userId: string; ws: WebSocket } }
  >;
  private constructor() {
    this.subscriptions = new Map<
      string,
      { [userId: string]: { userId: string; ws: WebSocket } }
    >();
    this.subscriber = createClient();
    this.publisher = createClient();
    this.publisher.connect();
    this.subscriber.connect();
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new UserManager();
    return this.instance;
  }
  subscribe(roomId: string, userId: string, ws: WebSocket) {
    this.subscriptions.set(roomId, {
      ...(this.subscriptions.get(roomId) || {}),
      [userId]: { userId: userId, ws },
    });
    if (Object.keys(this.subscriptions.get(roomId) || {}).length === 1) {
      this.subscriber.subscribe(roomId, (payload) => {
        try {
          const subscribers = this.subscriptions.get(roomId) || {};
          Object.values(subscribers).forEach(({ ws }) => ws.send(payload));
        } catch (error) {}
      });
    }
  }
  sendChat(roomId: string, userId: string, message: string) {
    console.log(roomId, userId, message);
    this.publish(roomId, message);
  }
  publish(roomId: string, message: string) {
    this.publisher.publish(roomId, message);
  }
}

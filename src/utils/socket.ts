class WebSocketService {
    private socket: WebSocket | null = null;
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    connect() {
        this.socket = new WebSocket(this.url);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onerror = this.onError.bind(this);
    }

    onOpen() {
        console.log('WebSocket连接已建立');
    }

    onMessage(event: MessageEvent) {
        console.log('收到消息:', event.data);
    }

    onClose() {
        console.log('WebSocket连接已关闭');
    }

    onError(error: Event) {
        console.error('WebSocket错误:', error);
    }

    send(data: any) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket未连接');
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export default WebSocketService
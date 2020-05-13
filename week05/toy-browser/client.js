const net = require('net');

class Request {
    //method, url = host + port + path
    //body: k/v
    //headers
    constructor(options) {
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.body = options.body || {};
        this.path = options.path || "/";
        this.headers = options.headers || {};
        this.headers["Content-Type"] = this.headers["Content-Type"] || "application/x-www-form-urlencoded";
        if (this.headers["Content-Type"] === "application/json") {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&");
        }
        this.headers["Content-Length"] = this.bodyText.length;
    }
    toString () {
        //不缩进保持格式正确
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("\r\n")}\r\n
${this.bodyText}`;
    }
    send (connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser();
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }
            connection.on("data", (data) => {
                // 这里返回的是流式数据，data事件可能会触发很多次，需要用状态机来parse
                parser.receive(data.toString());
                console.log(parser.headers);
                // resolve(data.toString());
                connection.end();
            })
            connection.on("error", (err) => {
                reject(err);
                connection.end();
            })
        })
    }
}
class Response {

}
class ResponseParser {
    constructor() {
        this.WAITING_STATUS_LINE = 0;//开始，等待状态行
        this.WAITING_STATUS_LINE_END = 1;//等待行结束
        this.WAITING_HEADER_NAME = 2;//等待header name
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;//等待body

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }
    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers
        }
    }
    //处理字符流，一般情况下这里是个buffer，这里简化处理
    receive(string){
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char) {
        if (this.current === this.WAITING_STATUS_LINE) {//正在接收status line
            if (char === "\r") {//读到\r时准备结束
                this.current = this.WAITING_STATUS_LINE_END;
            } else if (char === "\n") {//直接结束，准备接收header name
                this.current = this.WAITING_HEADER_NAME;
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === "\n") {//结束，准备接收header name
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {//header name以冒号结尾,后面有一个空格
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === "\r") {//结束接收所有header，开始准备接收body
                this.current = this.WAITING_HEADER_BLOCK_END;//body之前会有一个\n
                //这个时候开始创建body parser，因为在解析完header之前不知道用什么样的encoding去解析
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedBodyParser();
                } //else...为了简单其他encoding的情况忽略
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === " ") {//接收空格后准备接收header value
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === "\r") {//准备结束接收value，将这行header写入header
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === "\n") {//结束这行的heaer，准备接收下一行headerd
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === "\n") {//接收到\n后之后就是body的部分
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;//计数器
        this.content = [];
        this.isFinished = false;
        this.currrent = this.WAITING_LENGTH;
    }
    receiveChar(char) {//chunk 总是以0为结束。每次读取一个字符
        // console.log(JSON.stringify(char));
        // if (this.currrent === this.WAITING_LENGTH) {
        //     if (char === '\r') {
        //         if (this.length === 0) {
        //             this.isFinished = true;
        //         }
        //         this.current = this.WAITING_LENGTH_LINE_END;
        //     } else {
        //         this.length *= 10;
        //         this.length += char.charCodeAt(0) - "0".charCodeAt(0);
        //     }
        // } else if (this.currrent === this.WAITING_LENGTH_LINE_END) {
        //     if (char === "\n") {
        //         this.current = this.READING_TRUNK;
        //     }
        // } else if (this.current === this.READING_TRUNK) {
        //     this.content.push(char);
        //     this.length--;
        //     if (this.length === 0) {
        //
        //     }
        // }
    }
}

void (async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: 8088,
        path: "/",
        headers: {
            "X-Foo2": "custom"
        },
        body: {
            name: "toy"
        }
    })
    let response = await request.send();
    // console.log(response);
})()
// const client = net.createConnection({
//     host: "127.0.0.1",
//     port: 8088
// }, () => {
//     // 'connect' listener.
//     console.log('connected to server!');
//     client.write('POST / HTTP/1.1\r\n');
//     client.write('Content-Type: application/x-www-form-urlencoded\r\n');
//     client.write('Content-Length: 11\r\n');
//     client.write('\r\n');
//     client.write("name=winter");
// });
// client.on('data', (data) => {
//     console.log(data.toString(), "----")
//     client.end()
// });
// client.on('end', () => {
//     console.log('disconnected from server');
// });

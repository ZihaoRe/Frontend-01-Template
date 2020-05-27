const http = require("http");
const server = http.createServer((req, res) => {
    console.log("request received");
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`<html maaa=a >
<head>
    <style>
#father-flex {
    display: flex;
    width:200px;
    background-color: green;
}
#flex0{
    width:100px;
    background-color: #ff5000;
}
.flex1{
    width:30px;
    height: 100px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div id="father-flex">
        <div id="flex0"/>
        <div class="flex1">
    </div>
</body>
</html>`);
});
server.listen(8088);
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 5002;
const redis = require("redis")
const db = require("./dbConfig")
const app = express()
const router = express.Router();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const redisClient = redis.createClient(db.redis_config.port, db.redis_config.host, {})
redisClient.on('error', (err) => {
    console.log('Error ' + err);
});

function redisUtil(redisClient) {
    this.redisClient = redisClient;
}

redisUtil.prototype.set = function (key, value, expiration) {
    this.redisClient.set(key.toString(), value.toString());
    if (expiration) {
        this.redisClient.expire(key.toString(), expiration);
    }
}
// redis 自定義工具
const redisHelper = new redisUtil(redisClient);
// redis 原生方法
const redisOriginal = redisClient

router.get("/aaa", (req, res) => {
    res.status(200)
    return res.json({ok:1})
})


app.use("/", router);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
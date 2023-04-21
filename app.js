const express = require('express');
const querystring = require('querystring');
const {
  createProxyMiddleware
} = require('http-proxy-middleware');
const app = express();
app.use(express.json());
const port = process.env.PORT||9000;
const api  = process.env.API_URL||'https://oa.api2d.net';
const notice = process.env.NOTICE||'你的请求中包含关键词，可能泄露公司机密，已被拦截。';
// 从 keywords.txt 中读取关键词
const keywords = require('fs').readFileSync('keywords.txt', 'utf-8').split("\n").map( item => item.trim() );

app.use('/', createProxyMiddleware({
  
  target: api,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // console.log("开始处理代理逻辑 onProxyReq");
    proxyReq.removeHeader('x-forwarded-for');
    proxyReq.removeHeader('x-real-ip');

    if (!req.body || !Object.keys(req.body).length) {
        return;
    }

    // 进行关键词监测
    const url = req.originalUrl;
    console.log("url", url);
    
    // 只检查聊天接口
    const chat_interface = ['/v1/chat/completions'];
    if( chat_interface.includes(url) )
    {
        const text = JSON.stringify(req.body);
        for (let i = 0; i < keywords.length; i++) {
            const keyword = keywords[i];
            console.log("text", text, "keyword", keyword);
            // 如果 text 部分包含敏感词，且不分大小写，返回 403
            if (text && text.toLowerCase().includes(keyword.toLowerCase())) {
                
                if( req.body.stream )
                {
                    // 模拟openai api chat/completions 接口的返回，把内容替换成警告: 你的请求中包含敏感词，可能泄露公司机密，已被拦截
                    res.writeHead(200, {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                    });
                    const choice = {
                        delta: {
                            content: notice,
                        }
                    }
                    const forbidden_array = {
                        choices:[
                            choice
                        ],
                    };
                    res.write("data: "+JSON.stringify(forbidden_array)+"\n\n" );
                    res.write("data: [DONE]\n\n" );
                    res.end();
                }else
                {
                    const choice = {
                        message: {
                            content: notice,
                        }
                    }
                    const ret = {
                        choices:[
                            choice
                        ],
                    };
                    res.status(403).json(ret);
                }
                
                return;
            }
        }

    }
    
    const contentType = proxyReq.getHeader('Content-Type');
    const writeBody = (bodyData) => {
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
    };

    if (contentType.toString().includes('application/json')) {
    writeBody(JSON.stringify(req.body));
    }

    if (contentType.toString().includes('application/x-www-form-urlencoded')) {
    writeBody(querystring.stringify(req.body));
    }
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})


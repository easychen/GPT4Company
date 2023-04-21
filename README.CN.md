# Gpt4Company

Gpt4Company 是一个用来避免三星式泄密的请求转发器，配置好关键词和API地址就可以启动。公司内部的软件都通过转发器的API接入OpenAI，这样当有关键词传输时，会返回警告信息。

![用户群](./group.jpg)

## 使用步骤

1. 编辑 `keywords.txt`，每行一个关键词
1. 进入 `keywords.txt` 同级目录，启动 Docker  `docker run -d -p 9000:9000 -v ${PWD}/keywords.txt:/app/keywords.txt easychen/gpt4company`
1. 通过 `localhost:9000` 使用 OpenAI API

## 自定义项

你可以通过环境变量来自定义一些配置


| 参数 | 描述 | 默认值 |
| --- | --- | --- |
| `PORT` | 端口 | `9000` |
| `API_URL` | 接入的API URL | `https://oa.api2d.net` |
| `NOTICE` | 错误提示 | `你的请求中包含关键词，可能泄露公司机密，已被拦截。` |
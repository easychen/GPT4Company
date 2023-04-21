# Gpt4Company

[简体中文](README.CN.md)

Gpt4Company is a request forwarder used to prevent Samsung-style leaks. Once configured with keywords and an OpenAI key, it can be launched. All software within the company accesses OpenAI through the forwarder's API, which returns a warning message when a keyword is transmitted.

## Usage Steps

1. Edit `keywords.txt`, with one keyword per line.
2. Navigate to the same directory as `keywords.txt` and launch Docker with `docker run -d -p 9000:9000 -v ${PWD}/keywords.txt:/app/keywords.txt easychen/gpt4company`.
3. Use the OpenAI API through `localhost:9000`.

## Customization

You can customize some settings through environment variables.


| Parameter | Description | Default Value |
| --- | --- | --- |
| `PORT` | Port | `9000` |
| `API_URL` | API URL | `https://oa.api2d.net` |
| `NOTICE` | Error message | `Your request contains a keyword that may leak company secrets and has been intercepted.` |
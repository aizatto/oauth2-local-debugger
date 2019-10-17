import * as express from "express";
import * as httpProxyMiddleware from "http-proxy-middleware";
import * as querystring from 'querystring';
import fetch from 'node-fetch';

const PORT = 3000;

const app = express();

app.use(
  async (req, res, next) => {
    const code = req.query.code;
    console.log(code);
    if (!code) {
      next(null);
      return;
    }

    const accessTokenResponse = await fetch(
      'https://github.com/login/oauth/access_token?' + 
      querystring.stringify({
        code,
        client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
        client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
      }),
      {
        method: 'post',
        headers: {
          Accept: 'application/json',
        }
      }
    );

    const json = await accessTokenResponse.json();
    res.redirect('/?'+
      querystring.stringify({
        accessToken: json.access_token,
      })
    );
  },
  httpProxyMiddleware({
    target: "http://localhost:3001",
    ws: true
  })
);

app.listen(PORT, () => {
  console.log(`Open in your browser http://localhost:${PORT}`);
});

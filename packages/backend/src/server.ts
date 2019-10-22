import * as express from "express";
import * as httpProxyMiddleware from "http-proxy-middleware";
import * as querystring from 'querystring';
import fetch from 'node-fetch';

const PORT = 3000;

const app = express();

function oauth2url(type: string, code: string): string {
  switch (type) {
    case 'github':
      return 'https://github.com/login/oauth/access_token?' + 
        querystring.stringify({
          code,
          client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
          client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
        });

    // https://developers.google.com/identity/protocols/OAuth2WebServer#exchange-authorization-code
    // https://console.developers.google.com/apis/credentials
    case 'google':
      return 'https://oauth2.googleapis.com/token?' + 
        querystring.stringify({
          code,
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
          redirect_uri: 'http://localhost:3001?type=google',
          grant_type: 'authorization_code',
        });

  }
}

app.use(
  async (req, res, next) => {
    const {code, type} = req.query;
    console.log({code, type});
    if (!code || !type) {
      next(null);
      return;
    }

    const url = oauth2url(type, code);

    const accessTokenResponse = await fetch(
      url,
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

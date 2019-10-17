import React, { useState, useEffect } from 'react';
import { Button, FormGroup, Label, Col, Input, Container } from 'reactstrap';
import * as querystring from 'querystring';
import './bootstrap.min.css';

const fetchAccessToken = async (
  setAccessToken: (accessToken: string) => void,
) => {
  const search = window.location.search;
  if (!search) {
    console.log('1');
    return null;
  }
  
  const codeResponse = querystring.parse(search.substr(1));
  console.log(codeResponse);
  if (!codeResponse.code) {
    console.log('2');
    return null;
  }

  const accessTokenResponse = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'post',
      body: JSON.stringify({
        code: codeResponse.code,
        client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
        client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
        // redirect_uri: redirectURI,
      }),
      headers: {
        Accept: 'application/json',
      }
    }
  )

  const json = await accessTokenResponse.json();

  setAccessToken(json.access_token);
};

const App: React.FC = () => {
  const search = window.location.search
    ? querystring.parse(window.location.search.substr(1))
    : {};
  
  const [redirectURI, setRedirectURI] = useState(window.location.origin);

  // https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#non-web-application-flow
  const github = `https://github.com/login/oauth/authorize`;

  const githubQS = querystring.stringify({
    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
    redirect_uri: redirectURI,
    scope: 'repo',
    state: 'asdf',
  })

  return (
    <div className="App">
      <Container>
        <Button href={`${github}?${githubQS}`}>
          GitHub
        </Button>
        <FormGroup row>
          <Label for="accessToken" sm={2}>Access Token</Label>
          <Col sm={10}>
            <Input
              id="accessToken"
              name="accessToken"
              value={search.accessToken}
              readOnly
            />
          </Col>
        </FormGroup>
        <ul>
          <li>
            <a href="https://github.com/settings/developers">GitHub: OAuth Apps</a>
          </li>
        </ul>
      </Container>
    </div>
  );
}

export default App;

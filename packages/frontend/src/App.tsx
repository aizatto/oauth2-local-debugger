import React from 'react';
import { Button, FormGroup, Label, Col, Input, Container } from 'reactstrap';
import * as querystring from 'querystring';
import './bootstrap.min.css';

const App: React.FC = () => {
  const search = window.location.search
    ? querystring.parse(window.location.search.substr(1))
    : {};
  
  const redirectURI = window.location.origin;

  // https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#non-web-application-flow
  const github = `https://github.com/login/oauth/authorize`;

  const githubQS = querystring.stringify({
    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
    redirect_uri: `${redirectURI}?type=github`,
    scope: 'repo',
    state: 'asdf',
  })

  const google = `https://accounts.google.com/o/oauth2/v2/auth`;

  const googleQS = querystring.stringify({
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    redirect_uri: `${redirectURI}?type=google`,
    scope: 'https://www.googleapis.com/auth/calendar.events.readonly',
    state: 'asdf',
    response_type: 'code',
  })

  return (
    <div className="App">
      <Container>
        <Button href={`${github}?${githubQS}`}>
          GitHub
        </Button>
        <Button href={`${google}?${googleQS}`}>
          Google
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
            Google
            <ul>
              <li><a href="https://developers.google.com/identity/protocols/OAuth2">Using OAuth 2.0 to Access Google APIs</a></li>
              <li><a href="https://console.developers.google.com/apis/credentials">APIs & Services: Credentials</a></li>
            </ul>
          </li>
          <li>
            <a href="https://github.com/settings/developers">GitHub: OAuth Apps</a>
          </li>
        </ul>
      </Container>
    </div>
  );
}

export default App;

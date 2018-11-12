# @codingitwrong/vue-login

Login container components for Vue.

## Installation

```sh
$ yarn install @codingitwrong/vue-login
```

## Usage

The following components are made available:

### Auth

```html
<template>
  <auth :attempt-login="dummyLogin">
    <template
      slot="login-form"
      slot-scope="slotProps"
    >
      <button @click="slotProps.attemptLogin">
        Log In
      </button>
    </template>

    <p>You are now logged in!</p>
  </auth>
</template>

<script>
import { Auth } from '@codingitwrong/vue-login';

export default {
  components: {
    Auth,
  },
  methods: {
    dummyLogin() {
      return Promise.resolve(); // login succeeded
    },
  },
};
</script>
```

The `Auth` component has two states: logged out and logged in. It defaults to logged out, and will display the `login-form` slot. This is a scoped slot that takes an `attemptLogin` function. Render out the login form you want, and call `attemptLogin` to attempt to log in. This will call through to the `attemptLogin` function you pass into the `Auth` component. It should return a promise. If it resolves, you are considered to have logged in, and `Auth` will switched to the logged in state and display the default slot. If the returned promise rejects, the login form will still be shown. You can update data properties to display an error message, for example.

### <OAuth />

Instead of implementing your own `attemptLogin` function, if you are connecting to an OAuth 2 API to log in, you can use the `OAuth` component:

```html
<template>
  <OAuth
    :http-client="httpClient"
    path="/oauth/token"
    :handle-access-token="handleAccessToken"
  >
    <template
      slot="login-form"
      slot-scope="slotProps"
    >
      <form @submit.prevent="handleSubmit(slotProps.attemptLogin)">
        <p v-if="error">{{ error }}</p>
        <div>
          Email:
          <input type="text" v-model="username" />
        </div>
        <div>
          Password:
          <input type="password" v-model="password" />
        </div>
        <button>
          Log In
        </button>
      </form>
    </template>

    <p>You are now logged in!</p>
  </OAuth>
</template>

<script>
import axios from 'axios';
import { OAuth } from '@codingitwrong/vue-login';

const httpClient = axios.create({
  baseURL: 'https://api.example.com',
});

export default {
  components: {
    OAuth,
  },
  data() {
    return {
      username: '',
      password: '',
      error: null,
      httpClient,
    };
  },
  methods: {
    handleSubmit(attemptLogin) {
      attemptLogin({
        username: this.username,
        password: this.password,
      })
        .catch(error => this.error = error);
    },
    handleAccessToken(token) {
      console.log(token); // store it somewhere that you can access it
    },
  },
};
</script>
```

The `OAuth` component doesn't require you to implement an `attemptLogin` function; instead, you pass it an `httpClient` and it handles attempting to log in. When you call the `attemptLogin` function passed to you in the slot scope, you need to pass it a username and password. It uses the `httpClient` to send those credentials to an OAuth 2 server using the password grant. If the response indicates login was a success, in addition to switching to the logged in state, it also calls a `handleAccessToken` function you pass to it, so you can store the token. If an error is returned, the promise returned by `attemptLogin` will reject with an error message, so you can use it to display an error message.

## License

Apache-2.0

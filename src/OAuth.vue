<template>
  <auth :attempt-login="handleLogin">
    <slot></slot>
    <template
      slot="login-form"
      slot-scope="slotProps"
    >
      <slot
        name="login-form"
        :attempt-login="slotProps.attemptLogin"
      >
      </slot>
    </template>
  </auth>
</template>

<script>
import Auth from './Auth';

const DEFAULT_ERROR_MESSAGE = 'An error occurred while logging in. Please try again.';

export default {
  name: 'OAuth',
  components: {
    Auth,
  },
  props: {
    httpClient: {
      required: true,
    },
    path: {
      type: String,
      default: '/oauth/token',
    },
    handleAccessToken: {
      type: Function,
      required: true,
    },
    defaultErrorMessage: {
      type: String,
      default: DEFAULT_ERROR_MESSAGE,
    },
  },
  methods: {
    handleLogin({ username, password }) {
      const { httpClient, path } = this;

      return httpClient.post(path, {
        grant_type: 'password',
        username,
        password,
      })
        .then(response => this.handleSuccessResponse(response))
        .catch(error => this.handleErrorResponse(error));
    },
    handleSuccessResponse(response) {
      const { access_token } = response.data;
      this.handleAccessToken(access_token);
    },
    handleErrorResponse(error) {
      let message;
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.error_description
      ) {
        message = error.response.data.error_description;
      } else {
        message = this.defaultErrorMessage;
      }
      throw message;
    },
  },
};
</script>

<template>
  <div>
    <template v-if="loggedIn">
      <slot></slot>
    </template>
    <template v-else>
      <slot
        name="login-form"
        :attempt-login="handleLogin"
      >
      </slot>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  props: {
    attemptLogin: {
      type: Function,
      required: true,
    },
    initiallyLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loggedIn: this.initiallyLoggedIn,
    };
  },
  watch: {
    initiallyLoggedIn() {
      // can vary internally, but also accepts changes from outside
      this.loggedIn = this.initiallyLoggedIn;
    },
  },
  methods: {
    handleLogin(...loginParams) {
      return this.attemptLogin(...loginParams)
        .then(() => this.loggedIn = true);
    },
  },
};
</script>

import Vue from 'vue';
import { mount } from '@vue/test-utils';
import Auth from '@/Auth.vue';

describe('Auth', () => {
  let attemptLogin;
  let wrapper;

  beforeEach(() => {
    attemptLogin = jest.fn();
    wrapper = mount(Auth, {
      propsData: {
        attemptLogin,
      },
      scopedSlots: {
        default: '<p data-testid="logged-in">logged in</p>',
        'login-form': `
          <form
            slot-scope="slotProps"
            data-testid="login-form"
            @click="slotProps.attemptLogin"
          >
            <button data-testid="submit-button">Log In</button>
          </form>
        `,
      },
    });
  });

  it('renders the login form by default', () => {
    expect(wrapper.contains('[data-testid="login-form"]')).toBe(true);
  });

  it('renders the logged-in state when the prop is set', () => {
    wrapper.setProps({
      initiallyLoggedIn: true,
    });
    expect(wrapper.contains('[data-testid="login-form"]')).toBe(false);
  });

  describe('success', () => {
    beforeEach(() => {
      attemptLogin.mockResolvedValue();
    });

    it('calls attemptLogin upon submitting', () => {
      wrapper.find('[data-testid="submit-button"]').trigger('click');
      expect(attemptLogin).toHaveBeenCalled();
    });

    it('shows the logged-in components upon submitting', () => {
      wrapper.find('[data-testid="submit-button"]').trigger('click');
      return Vue.nextTick(() => {
        expect(wrapper.contains('[data-testid="login-form"]')).toBe(false);
        expect(wrapper.contains('[data-testid="logged-in"]')).toBe(true);
      });
    });
  });

  describe('error', () => {
    beforeEach(() => {
      attemptLogin.mockRejectedValue();
    });

    it('still shows the login form', () => {
      wrapper.find('[data-testid="submit-button"]').trigger('click');
      return Vue.nextTick(() => {
        expect(wrapper.contains('[data-testid="login-form"]')).toBe(true);
        expect(wrapper.contains('[data-testid="logged-in"]')).toBe(false);
      });
    });
  });
});

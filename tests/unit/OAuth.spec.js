import Vue from 'vue';
import { mount } from '@vue/test-utils';
import OAuth from '@/OAuth.vue';

describe('OAuth', () => {
  let wrapper;
  let httpClient;
  let handleAccessToken;

  beforeEach(() => {
    httpClient = {
      post: jest.fn(),
    };
    handleAccessToken = jest.fn();

    wrapper = mount(OAuth, {
      propsData: {
        httpClient,
        handleAccessToken,
      },
      scopedSlots: {
        default: '<p data-testid="logged-in">logged in</p>',
        'login-form': `
          <form
            slot-scope="slotProps"
            data-testid="login-form"
            @click="slotProps.attemptLogin({ username: 'foo', password: 'bar' })"
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
      httpClient.post.mockResolvedValue({
        data: {
          access_token: 'ABC123',
        },
      });
    });

    it('sends a POST request upon submitting', () => {
      wrapper.find('[data-testid="submit-button"]').trigger('click');
      expect(httpClient.post).toHaveBeenCalledWith('/oauth/token', {
        grant_type: 'password',
        username: 'foo',
        password: 'bar',
      });
    });

    it('passes the access token to handleAccessToken', () => {
      wrapper.find('[data-testid="submit-button"]').trigger('click');
      return Vue.nextTick(() => {
        expect(handleAccessToken).toHaveBeenCalled();
      });
    });

    it('shows the logged-in components upon submitting', () => {
      wrapper.find('[data-testid="submit-button"]').trigger('click');

      return Vue.nextTick()
        .then(() => Vue.nextTick())
        .then(() => {
          expect(wrapper.contains('[data-testid="login-form"]')).toBe(false);
        });
    });
  });

  describe('failure', () => {
    beforeEach(() => {
      httpClient.post.mockRejectedValue({
        response: {
          data: {
            error_description: 'custom error message',
          },
        },
      });
    });

    it('still shows the login form', () => {
      wrapper.find('[data-testid="submit-button"]').trigger('click');
      return Vue.nextTick(() => {
        expect(wrapper.contains('[data-testid="login-form"]')).toBe(true);
        expect(wrapper.contains('[data-testid="logged-in"]')).toBe(false);
      });
    });

    // TODO: test rejects with error
  });
});

export const NavigationState = Object.freeze({
    // standard value: no error
    welcome: {
        init: Symbol("WELCOME"),
        registration_completed: Symbol("REG_COMPLETED"),
        login_completed: Symbol("LOGIN_COMPLETED"),
        shortcode_generated: Symbol("SHORTCODE_GENERATED"),
        shortcode_completed: Symbol("SHORTCODE_COMPLETED")
    },
    registration: {
        userNameInput: Symbol("REG_USER_NAME_INPUT"),
        authenticatorRegistration: Symbol("AUTHENTICATOR_REGISTRATION")
    },
    login: {
        userNameInput: Symbol("LOGIN_USERNAME_INPUT"),
        authenticatorAuthentication: Symbol("AUTHENTICATOR_AUTHENTICATION")
    },
    private: Symbol("PRIVATE"),
    shortcodeGeneration: Symbol("SHORTCODE_GENERATION"),
    shortcodeAuthorization: {
        shortcodeInput: Symbol("SHORTCODE_INPUT"),
        authentication_userNameInput: Symbol("SHORTCODE_AUTHENTICATION_LOGIN_USERNAME_INPUT"),
        authentication_authenticatorAuthentication: Symbol("SHORTCODE_AUTHENTICATION_AUTHENTICATOR_AUTHENTICATION"),
        authorizationScreen: Symbol("SHORTCODE_AUTHORIZATION_SCREEN")
    }
});
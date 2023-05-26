export const NavigationState = Object.freeze({
    welcome_init: Symbol("WELCOME"),
    registration: Symbol("Registration"),
    welcome_registration_completed: Symbol("REG_COMPLETED"),
    login: Symbol("Login"),
    private: Symbol("PRIVATE"),
    welcome_login_completed: Symbol("LOGIN_COMPLETED"),
    shortcodeGeneration: Symbol("SHORTCODE_GENERATION"),
    shortcodeAuthorization_shortcodeInput: Symbol("SHORTCODE_INPUT"),
    shortcodeAuthorization_authorizationScreen: Symbol("SHORTCODE_AUTHORIZATION"),
    welcome_shortcode_completed: Symbol("SHORTCODE_COMPLETED"),
});
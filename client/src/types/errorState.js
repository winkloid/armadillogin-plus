export const ErrorState = Object.freeze({
    success: Symbol("SUCCESS"),
    connectionError: Symbol("CONNECTION_ERROR"),
    registrationOptionsError: Symbol("REGISTRATION_OPTIONS_ERROR"),
    authenticatorCommunicationError: Symbol("AUTHENTICATOR_COMMUNICATION_ERROR"),
    completeRegistrationError: Symbol("COMPLETE_REGISTRATION_ERROR")
});
export const ErrorState = Object.freeze({
    // standard value: no error
    success: Symbol("SUCCESS"),

    // generic errors
    connectionError: Symbol("CONNECTION_ERROR"),
    notFoundError: Symbol("NOT_FOUND_ERROR"),
    serverError: Symbol("SERVER_ERROR"),
    authenticatorCommunicationError: Symbol("AUTHENTICATOR_COMMUNICATION_ERROR"),

    // Registration errors
    registrationOptionsError: Symbol("REGISTRATION_OPTIONS_ERROR"),
    completeRegistrationError: Symbol("COMPLETE_REGISTRATION_ERROR"),

    // Authentication Errors
    authenticationOptionsError: Symbol("AUTHENTICATION_OPTIONS_ERROR"),
    completeAuthenticationError: Symbol("COMPLETE_AUTHENTICATION_ERROR"),

    // Authenticator Deletion Error
    authenticatorDeletionError: Symbol("AUTHENTICATOR_DELETION_ERROR"),
});
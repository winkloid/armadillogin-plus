const isAuthenticatedMiddleware = (req, res, next) => {
    if(req.session) {
        if(req.session.userName && req.session.isAuthenticated) {
            next();
        }
        else {
            return res.status(401).send("Nicht autorisiert. sie haben den Login-Prozess noch nicht erfolgreich abgeschlossen.");
        }
    }

    return res.status(401).send("Nicht autorisiert, bitte schließen Sie zunäcsht den Login-Prozess ab.");
}

module.exports = {
    isAuthenticatedMiddleware
}
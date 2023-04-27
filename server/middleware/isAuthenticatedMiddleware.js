const isAuthenticatedMiddleware = (req, res, next) => {
    if(req.session) {
        if(req.session.isAuthenticated && req.session.userName && req.session.userId) {
            next();
        }
        else {
            return res.status(401).send("Nicht autorisiert. sie haben den Login-Prozess noch nicht erfolgreich abgeschlossen.");
        }
    } else {
        return res.status(401).send("Nicht autorisiert, bitte schließen Sie zunäcsht den Login-Prozess ab.");
    }
}

module.exports = {
    isAuthenticatedMiddleware
}
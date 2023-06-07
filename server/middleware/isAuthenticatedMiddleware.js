const isAuthenticatedMiddleware = (req, res, next) => {
    if(req.session) {
        if(req.session.isAuthenticated && req.session.userName && req.session.userId) {
            next();
        }
        else {
            return res.status(401).send("Nicht autorisiert. Sie haben den Login-Prozess noch nicht erfolgreich abgeschlossen oder die maximale Login-Zeit bereits überschritten. Bitte loggen Sie sich ein, bevor Sie fortfahren.");
        }
    } else {
        return res.status(401).send("Nicht autorisiert. Sie haben den Login-Prozess noch nicht erfolgreich abgeschlossen oder die maximale Login-Zeit bereits überschritten. Bitte loggen Sie sich ein, bevor Sie fortfahren.");
    }
}

module.exports = {
    isAuthenticatedMiddleware
}
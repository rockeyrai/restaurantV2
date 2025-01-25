const Session = require("../model/SessionSchema ");

const sessionMiddleware = async (req, res, next) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) {
        return res.status(401).json({ error: "Unauthorized: Session ID missing" });
    }

    try {
        const session = await Session.findOne({ session_id: sessionId });
        if (!session || new Date() > new Date(session.expires_at)) {
            return res.status(401).json({ error: "Unauthorized: Session expired" });
        }

        req.user_id = session.user_id; // Attach the user ID to the request
        next(); // Proceed to the next middleware or controller
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = sessionMiddleware;

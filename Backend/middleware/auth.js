import JWT from 'jsonwebtoken';

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or incorrect format' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {

        console.log(!token)
        return res.status(401).json({ error: 'Token is missing or empty' });
    }

    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        console.log(payload)
        req.user = { userID: payload.userID };
        // console.log("someting is going to be wrong here is authentication error check it ");
        console.log(payload.userID);
        const userID=payload.userID;
        console.log(userID)
        // console.log(`this is user id ${user}`);
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ error: 'User is not authorized' });
    }
};

export default auth;

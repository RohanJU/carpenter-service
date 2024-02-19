const allowedRoles = (roles) => {
    return (req, res, next) => {
        const { role } = req.user;

        if (!roles.includes(role)) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized",
                data: null,
              });
        }

        next();
    }
}

module.exports = allowedRoles;
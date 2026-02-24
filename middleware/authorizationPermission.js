const {rolePermissions} = require("../config/roles");
const authorizationPermission = (permission) => {
  return (req, res, next) => {
     console.log(req.user.role);
    const userRole = req.user.role;
    const allwedRolePermission = rolePermissions[userRole];
    if (!allwedRolePermission || !allwedRolePermission.includes(permission)) {
     return res.status(400).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};
module.exports =  authorizationPermission ;

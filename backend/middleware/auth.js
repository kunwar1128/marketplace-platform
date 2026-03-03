// export function requireAdminKey(req, res, next) {
//   const key = req.header("x-admin-key");
//   if (!key || key !== process.env.ADMIN_KEY) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
//   next();
// }

// The requireAuth middleware authenticates if the user is logged in

export function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// The requireAdmin middleware authenticates if the user is logged in and is the admin

export function requireAdmin(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.session.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
}

const bookRoutes = require("../routes/book");

module.exports = function (app) {
  app.get("/", (req, res) => res.send("Welcome to CI/CD."));

  app.use("/api/books", bookRoutes);
};

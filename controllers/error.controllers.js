exports.render404Page = (req, res, next) => {
  res.status(404).render("error/404", { title: "Page not fuond " });
};

exports.render500Page = (err, req, res, next) => {
  res
    .status(404)
    .render("error/500", { title: "Sever Error page", message: err.message });
};

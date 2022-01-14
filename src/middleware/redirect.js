module.exports = (req, res, next) => {
    console.log(`req.session`, req.session);
    if (!req.session.pokeArray) res.redirect('/');
    next();
};

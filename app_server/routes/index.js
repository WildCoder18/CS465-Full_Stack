const express = require("express");
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('index'); // render your main Handlebars template
});

// You can add more front-end routes here if needed

module.exports = router;

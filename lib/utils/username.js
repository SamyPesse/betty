var normall = require('normall');

// Normalize a username
function normalizeUsername(name) {
    return normall.username(name);
}

module.exports = {
    normalize: normalizeUsername
};

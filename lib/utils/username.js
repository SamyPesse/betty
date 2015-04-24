var normall = require('normall');

// Normalize a username
function normalizeUsername(name) {
    if (!name) return name;
    return normall.username(name);
}

module.exports = {
    normalize: normalizeUsername
};

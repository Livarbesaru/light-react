function requireFromString(src) {
    let m = new module.constructor();
    m.paths = module.paths;
    m._compile(src, "");
    return m.exports;
}

module.exports = requireFromString;
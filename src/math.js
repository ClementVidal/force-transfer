/**
 * Vector class
 */
var Vector = function(x, y) {
    this.x = x;
    this.y = y;
};

Vector.random = function() {
    return new Vector(Math.random(), Math.random());
};

Vector.prototype.add = function(v2) {
    return new Vector(this.x + v2.x, this.y + v2.y);
};

Vector.prototype.subtract = function(v2) {
    return new Vector(this.x - v2.x, this.y - v2.y);
};

Vector.prototype.multiply = function(n) {
    return new Vector(this.x * n, this.y * n);
};

Vector.prototype.divide = function(n) {
    return new Vector((this.x / n) || 0, (this.y / n) || 0); // Avoid divide by zero errors..
};

Vector.prototype.magnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.normal = function() {
    return new Vector(-this.y, this.x);
};

Vector.prototype.normalise = function() {
    return this.divide(this.magnitude());
};

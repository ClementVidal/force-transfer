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

/**
 * Node Class
 */
function Node(x, y, w, h) {

    this.pos = new Vector(x, y);
    this.size = new Vector(w, h);

    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.mass = 1;
}

Node.prototype.getDiagonalLength = function() {
    return Math.sqrt(this.size.x * this.size.x + this.size.y * this.size.y);
}

Node.prototype.vectorTo = function(otherNode) {
    return otherNode.pos.subtract(this.pos);
}

Node.prototype.applyForce = function(force) {
    this.acceleration = this.acceleration.add(force.divide(this.mass));
}

Node.prototype.energy = function() {
    var speed = this.velocity.magnitude();
    return 0.5 * this.mass * speed * speed;
}

/**
 * Edge class
 */
function Edge(sourceID, targetId, springLength, k) {
    this.sourceId = sourceID;
    this.targetId = targetId;
}

/**
 * Graph class
 */
function Graph() {
    this.nodeList = [];
    this.edgeList = [];
    this.adjacency = [];
}

Graph.prototype.getEdgeNodes = function(edge) {
    return [this.nodeList[edge.sourceId], this.nodeList[edge.targetId]];
}

Graph.prototype.totalEnergy = function() {
    var energy = 0.0;
    this.forEachNode(function(node) {
        energy += node.energy();
    });

    return energy;
};

/**
 * Add a new node
 */
Graph.prototype.addNode = function(x, y, w, h, data) {
    var node = new Node(x, y, w, h);
    node.data = data;
    this.nodeList.push(node);
    return node;
}


/**
 * Add an edge between to nodes
 */
Graph.prototype.addEdge = function(sourceId, targetId) {

    if (!(sourceId in this.adjacency)) {
        this.adjacency[sourceId] = [];
    }
    if (!(targetId in this.adjacency[sourceId])) {
        var edge = new Edge(sourceId, targetId);
        this.adjacency[sourceId][targetId] = edge;
        this.edgeList.push(edge);
    } else {
        throw new Error('Edge already exist');
        return null;
    }

    return this.adjacency[sourceId][targetId];
}

Graph.prototype.forEachEdge = function(callback) {
    var t = this;
    this.edgeList.forEach(function(edge) {
        callback.call(t, edge);
    });
};

Graph.prototype.forEachNode = function(callback) {
    var t = this;
    this.nodeList.forEach(function(node) {
        callback.call(t, node);
    });
};

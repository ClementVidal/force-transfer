
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
};

Node.prototype.vectorTo = function(otherNode) {
    return otherNode.pos.subtract(this.pos);
};

Node.prototype.applyForce = function(force) {
    this.acceleration = this.acceleration.add(force.divide(this.mass));
};

Node.prototype.energy = function() {
    var speed = this.velocity.magnitude();
    return 0.5 * this.mass * speed * speed;
};

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
};

Graph.prototype.totalEnergy = function() {
    var energy = 0.0;
    this.forEachNode(function(node) {
        energy += node.energy();
    });

    return energy;
};

/**
 * Add a new node.
 * Node are defined by:
 * 	- a position: { x, y }
 *  - a size: { w,h }
 *
 * Additional user datacan be stored in each node by providing a data argument
 *
 * Each node must be uniquely identified.
 * Unique ID are automaticly assigned for each node ( using a single incremented integer )
 * Or can be provided using the id parameter
 */
Graph.prototype.addNode = function(x, y, w, h, data, id ) {
    var node = new Node(x, y, w, h);
    node.data = data;
    node.id = id || this.nodeList.length;
    this.nodeList.push(node);
    return node;
};

/**
 * Iterator over the list of nodes
 */
Graph.prototype.forEachNode = function(callback) {
    var t = this;
    this.nodeList.forEach(function(node) {
        callback.call(t, node);
    });
};

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
    }

    return this.adjacency[sourceId][targetId];
};

Graph.prototype.forEachEdge = function(callback) {
    var t = this;
    this.edgeList.forEach(function(edge) {
        callback.call(t, edge);
    });
};

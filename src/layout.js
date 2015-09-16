var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function Spring(length, stiffness) {
    this.length = length;
    this.stiffness = stiffness
}

function Layout(graph) {
    this.graph = graph;
    this.springList = {};

    this.recenterForce = 8;
    this.repulsionForce = 400.0; // repulsionForce constant
    this.velocityDamping = 0.7; // velocity velocityDamping factor
    this.minEnergyThreshold = 2; //threshold used to determine render stop
    this.maxIterationCount = 60 * 6;
    this.springStiffness = 20.0; // spring stiffness constant
    this.springMarginLength = 10;
}

Layout.prototype.getSpring = function(edge) {
    if (!_.contains(this.springList, edge)) {
        var nodes = this.graph.getEdgeNodes( edge );

        var springLength = nodes[0].getDiagonalLength()  + nodes[1].getDiagonalLength() +  this.springMarginLength;
        //var springLength = this.springMarginLength;

        this.springList[edge] = new Spring(springLength, this.springStiffness);
    }

    return this.springList[edge];
}

Layout.prototype.update = function(timestep) {
    this.applyCoulombsLaw();
    this.applyHookesLaw();
    //this.attractToCentre();
    this.updateNodes(timestep);
}

Layout.prototype.start = function(updateCallback) {

    var self = this;
    var iterationCount = 0;
    var t0 = new Date().getTime();

    requestAnimationFrame(function step() {

        // Compute delta time
        var t1 = new Date().getTime();
        var dt = 0.001 * (t1 - t0);
        t0 = t1;

        iterationCount++;
        self.update(dt);
        updateCallback(self.graph);

        if (self.isStable() || iterationCount >= self.maxIterationCount) {
            console.log('Graph is stable, exiting');
        } else {
            requestAnimationFrame(step);
        }
    });
}


Layout.prototype.applyCoulombsLaw = function() {

    var self = this;
    if (self.repulsionForce == 0.0)
        return;

    self.graph.forEachNode(function(n1) {
        self.graph.forEachNode(function(n2) {

            if (n1 !== n2) {
                var d = n2.vectorTo(n1);
                var distance = d.magnitude() + 0.1; // avoid massive forces at small distances (and divide by zero)
                var direction = d.normalise();

                // apply force to each end points
                n1.applyForce(direction.multiply(self.repulsionForce).divide(distance * distance * 0.5));
                n2.applyForce(direction.multiply(self.repulsionForce).divide(distance * distance * -0.5));

            }
        });
    });
};

Layout.prototype.applyHookesLaw = function() {
    var self = this;
    self.graph.forEachEdge(function(edge) {

        var spring = self.getSpring(edge);
        var nodes = self.graph.getEdgeNodes( edge );

        var d = nodes[0].vectorTo(nodes[1]);
        var displacement = spring.length - d.magnitude();
        var direction = d.normalise();

        // apply force to each end point
        nodes[0].applyForce(direction.multiply(spring.stiffness * displacement * -0.5));
        nodes[1].applyForce(direction.multiply(spring.stiffness * displacement * 0.5));
    });
};

Layout.prototype.updateNodes = function(timestep) {
    var self = this;
    self.graph.forEachNode(function(node) {
        node.velocity = node.velocity.add(node.acceleration.multiply(timestep));
        node.velocity = node.velocity.multiply(self.velocityDamping);
        node.acceleration = new Vector(0, 0);
        node.pos = node.pos.add(node.velocity.multiply(timestep));

    });
};

Layout.prototype.attractToCentre = function(timestep) {
    var self = this;
    self.graph.forEachNode(function(node) {
        var direction = node.pos.multiply(-1.0);
        node.applyForce(direction.multiply(self.recenterForce));

    });
};

Layout.prototype.isStable = function() {
    return this.graph.totalEnergy() < this.minEnergyThreshold;
}

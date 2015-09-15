var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function Spring(length, stiffness) {
    this.length = length;
    this.stiffness = stiffness
}

function Layout(graph) {
    this.graph = graph;
    this.springList = {};

    this.repulsion = 400.0; // repulsion constant
    this.velocityDamping = 0.7; // velocity velocityDamping factor
    this.minEnergyThreshold = 5; //threshold used to determine render stop
    this.maxIterationCount = 60 * 6;
    this.springStiffness = 20.0; // spring stiffness constant
    this.springLength = 400;
}

Layout.prototype.getSpring = function(edge) {
    if (!_.contains(this.springList, edge)) {
        this.springList[edge] = new Spring(this.springLength, this.springStiffness);
    }

    return this.springList[edge];
}

Layout.prototype.update = function(timestep) {
    this.applyCoulombsLaw();
    this.applyHookesLaw();
    this.attractToCentre();
    this.updateNodes(timestep);
}

Layout.prototype.start = function(updateCallback) {

    var self = this;
    var iterationCount = 0;
    var timestep = 0.03;

    requestAnimationFrame(function step() {
        iterationCount++;
        self.update(timestep);
        updateCallback(self.graph);

        console.log('Energy ', self.graph.totalEnergy());
        if (self.isStable() || iterationCount >= self.maxIterationCount) {
            console.log('Graph is stable, exiting');

        } else {
            requestAnimationFrame(step);
        }

    });
}


Layout.prototype.applyCoulombsLaw = function() {

    var self = this;
    if (self.repulsion == 0.0)
        return;

    self.graph.forEachNode(function(n1) {
        self.graph.forEachNode(function(n2) {

            if (n1 !== n2) {
                var d = n2.vectorTo(n1);
                var distance = d.magnitude() + 0.1; // avoid massive forces at small distances (and divide by zero)
                var direction = d.normalise();

                // apply force to each end points
                n1.applyForce(direction.multiply(self.repulsion).divide(distance * distance * 0.5));
                n2.applyForce(direction.multiply(self.repulsion).divide(distance * distance * -0.5));

            }
        });
    });
};

Layout.prototype.applyHookesLaw = function() {
    var self = this;
    self.graph.forEachEdge(function(edge) {

        var spring = self.getSpring(edge);

        var n1 = self.graph.nodeList[edge.sourceId];
        var n2 = self.graph.nodeList[edge.targetId];

        var d = n1.vectorTo(n2);
        var displacement = spring.length - d.magnitude();
        var direction = d.normalise();

        // apply force to each end point
        n1.applyForce(direction.multiply(spring.stiffness * displacement * -0.5));
        n2.applyForce(direction.multiply(spring.stiffness * displacement * 0.5));
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
        var direction = node.pos.multiply( -1.0 );
        node.applyForce( direction.multiply( self.repulsion / 50 ) );

    });
};

Layout.prototype.isStable = function() {
    return this.graph.totalEnergy() < this.minEnergyThreshold;
}

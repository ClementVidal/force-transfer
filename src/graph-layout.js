(function() {

    "use strict";

    function Graph() {

        this.adjacencyList = [];

        this.addNode = function(x, y, w, h, data) {
            this.adjacencyList.push(new Array());
        }
        this.addEdge = function(n1, n2) {
            if (n1 === n2 ) {
                throw "Cannot connect a node to itself";
            }
            if (n1 >= this.adjacencyList.length || n2 >= this.adjacencyList.length) {
                throw "Invalid node index";
            }
            this.adjacencyList[n1].push(n2);
            this.adjacencyList[n1].push(n2);
        }

    }

    window.graphLayout = {
        newGraph: function() {
            return new Graph();
        }
    }
}).call(this);

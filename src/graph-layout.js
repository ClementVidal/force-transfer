(function() {

    "use strict";

    function Graph() {

        this.adjacencyList = [];

        /**
         * Add a new node
         */
        this.addNode = function(x, y, w, h, data) {

            var obj = {
                edgesTo: new Array(),
                rect: {
                    x: x,
                    y: y,
                    w: w,
                    h: h
                },
                data: data
            };

            this.adjacencyList.push(obj);

            return obj;
        }

        /**
         * Add an edge between to nodes
         */
        this.addEdge = function(n1, n2) {
            if (n1 === n2) {
                throw new Error("Cannot connect a node to itself.");
            }
            if (n1 >= this.adjacencyList.length || n2 >= this.adjacencyList.length) {
                throw new Error("Invalid node index.");
            }

            if (_.indexOf(this.adjacencyList[n1].edgesTo, n2) == -1) {
                this.adjacencyList[n1].edgesTo.push(n2);
            }

            if (_.indexOf(this.adjacencyList[n2].edgesTo, n1) == -1) {
                this.adjacencyList[n2].edgesTo.push(n1);
            }
        }
    }

    window.graphLayout = {
        newGraph: function() {
            return new Graph();
        }
    }
}).call(this);

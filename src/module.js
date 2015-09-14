window.graphLayout = {
    newGraph: function() {
        return new Graph();
    },
    newLayout: function(graph) {
        return new Layout(graph);
    }
}

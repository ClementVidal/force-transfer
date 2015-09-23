var nodeCount = 10;

var container = document.querySelector('.container');

function generateInitialLayout() {
    for (var i = 0; i < nodeCount; i++) {

        var div = document.createElement("div");
        container.appendChild(div);
        div.className += " node";
    }
}

generateInitialLayout();

var graph = graphLayout.newGraph();
var layout = graphLayout.newLayout(graph, {
    initialLayout: {
        type: 'randomCircle',
        radius: 200,
        center: {x:600, y:400}
    }
});
var divAdaptor = graphLayout.newDivAdaptor();

divAdaptor.setup(graph, '.node', container);

layout.start(function(graph) {

    divAdaptor.apply(graph);

}, function(graph) {
    console.log('Graph is stable');
});

function generateInitialLayout() {

    for( var i=0; i<10; i++ ){

        var div = document.createElement("div");
        div.className += "node";
        document.getElementsByClassName('container')[0].appendChild(div);
    }
}

generateInitialLayout();

var graph = graphLayout.newGraph();

var nodesDiv = document.getElementsByClassName( 'node' );

for( var i=0;i<nodesDiv.length; i++ ) {
    
    graph.addNode( 0, 0, 10, 10 );
}
graph.addNode( 0, 0, 10, 10 );
graph.addEdge( 0, 1);

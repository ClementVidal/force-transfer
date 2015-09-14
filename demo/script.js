function generateInitialLayout() {

    var containerDiv = document.getElementsByClassName( 'container' );

    for( var i=0; i<10; i++ ){

        var div = document.createElement("div");
        div.className += "node";
        div.style.left = ( Math.random() * 200 + containerDiv[0].getBoundingClientRect().width / 2 ) + 'px';
        div.style.top =  ( Math.random() * 200 + containerDiv[0].getBoundingClientRect().height / 2 ) + 'px';
        document.getElementsByClassName('container')[0].appendChild(div);
    }
}

generateInitialLayout();

var graph = graphLayout.newGraph();
var layout = graphLayout.newLayout( graph );

var nodesDiv = document.getElementsByClassName( 'node' );
for( var i=0;i<nodesDiv.length; i++ ) {
    var r = nodesDiv[i].getBoundingClientRect();
    graph.addNode( r.left + ( r.width ) / 2, r.top + ( r.height ) / 2, r.width, r.height );
}

layout.start(  );

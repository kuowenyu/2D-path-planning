function iterateGraphSearch() {

    // STENCIL: implement a single iteration of a graph search algorithm
    //   for A-star (or DFS, BFS, Greedy Best-First)
    //   An asynch timing mechanism is used instead of a for loop to avoid 
    //   blocking and non-responsiveness in the browser.
    //
    //   Return "failed" if the search fails on this iteration.
    //   Return "succeeded" if the search succeeds on this iteration.
    //   Return "iterating" otherwise.
    //
    //   Provided support functions:
    //
    //   testCollision - returns whether a given configuration is in collision
    //   drawHighlightedPathGraph - draws a path back to the start location
    //   draw_2D_configuration - draws a square at a given location 
    
    if (search_iter_count >= search_max_iterations) {
        search_iterate = false;
        return "failed";
    }    

    else if ((typeof(visit_queue) != undefined) && (Math.round(cur_node.x*10)/10 != q_goal[0] || Math.round(cur_node.y*10)/10 != q_goal[1])) {
        
        cur_node = minheaper.extract(visit_queue);
        console.log(cur_node.priority);
        search_visited ++;
        cur_node.visited = true;
        // draw_2D_configuration_blue([cur_node.x,cur_node.y]);

        for (k = 0; k < 4; k++) {
            switch (k){
                case 0:
                    var node = G[cur_node.i-1][cur_node.j];
                    break;
                case 1:
                    var node = G[cur_node.i][cur_node.j-1];
                    break;
                case 2:
                    var node = G[cur_node.i+1][cur_node.j];
                    break;
                case 3:
                    var node = G[cur_node.i][cur_node.j+1];
                    break;
            } 

            if (node.visited == false && node.queued == false && testCollision([node.x,node.y]) == false) {
                

                if (node.distance > cur_node.distance + eps) {
                    node.parent = cur_node;
                    node.distance = cur_node.distance + eps;
                    node.priority = node.distance + Math.sqrt(Math.pow(node.x-q_goal[0],2) + Math.pow(node.y-q_goal[1],2));
                    // console.log(node.priority);
                }
                
                node.queued = true;
                draw_2D_configuration_gray([node.x,node.y]);

                minheaper.insert(visit_queue,node);
            }
        }
        return "iterating";
    }

    else {
        drawHighlightedPathGraph(cur_node);
        search_iterate = false;
        return "succeeded";
    }

    
}
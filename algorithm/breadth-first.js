function iterateBFSearch() {
    if (search_iter_count >= search_max_iterations) {
        search_iterate = false;
        return "failed";
    }    

    else if ((typeof(visit_queue) != undefined) && (Math.round(cur_node.x*10)/10 != q_goal[0] || Math.round(cur_node.y*10)/10 != q_goal[1])) {
        
        cur_node = visit_queue.shift();
        search_visited ++;

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
                visit_queue.push(node);
                node.queued = true;
                draw_2D_configuration_gray([node.x,node.y]);

                if (node.distance > cur_node.distance + eps) {
                    node.parent = cur_node;
                    node.distance = cur_node.distance + eps;
                }
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
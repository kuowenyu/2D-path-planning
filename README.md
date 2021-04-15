# 2D-path-planning

The file search_canvas.html is a code stencil for implementing various search algorithms for path planning. The planner will execute automatically upon page load of the file into the browser. Other worlds can be used through custom URL commands (described below) , or uncomment/commenting lines in the initPlanner() function.
Path planning algorithms are:
  1. BFS
  2. DFS
  3. GBS
  4. A star
  5. RRT
  6. RRT connect
  7. RRT star

The algorithms are written seperately in JavaScript under folder algorithm.

### Usage

The planner will start upon browser loading this file, with execution parameters specifing:

      search_alg: string specifying choice of search algorithm, as one of:
        "depth-first","breadth-first","greedy-best-first","A-star",
        "RRT","RRT-connect","RRT-star"
      planning_scene: string specifying choice of 2D world, as one of:
        "empty","misc","narrow1","narrow2","three_sections"
      q_init: 2-element 1D array with coordinates of start location
      q_goal: 2-element 1D array with coordinates of goal location
      eps: "epsilon" number for search spatial resolution of graph 
        as well as RRT step length

These parameters can be specified in the URL as parameter assignments separated by question marks, as in the following example: 

      search_canvas.html?search_alg=A-star?planning_scene=misc?q_init=[0,0]?q_goal=[4,4]?eps=0.1

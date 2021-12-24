type Obj = { [key: string]: any };

class Graph {
  vertices: string[] = [];
  adjacencyList: Obj;

  constructor() {
    this.vertices = [];
    this.adjacencyList = {};
  }

  addVertex(vertex: string) {
    this.vertices.push(vertex);
    this.adjacencyList[vertex] = {};
  }

  addEdge(v1: string, v2: string, weight: number) {
    this.adjacencyList[v1][v2] = weight;
  }

  changeWeight(v1: string, v2: string, weight: number) {
    this.adjacencyList[v1][v2] = weight;
  }

  dijkstra(source: string) {
    let distances: Obj = {};
    let parents: Obj = {};
    let visited = new Set();

    for (let i = 0; i < this.vertices.length; i++) {
      if (this.vertices[i] === source) {
        distances[source] = 0;
      } else {
        distances[this.vertices[i]] = Infinity;
      }
      parents[this.vertices[i]] = null;
    }

    let currVertex = this.vertexWithMinDistance(distances, visited);

    while (currVertex !== null) {
      let distance = distances[currVertex],
        neighbors = this.adjacencyList[currVertex];
      for (let neighbor in neighbors) {
        let newDistance = distance + neighbors[neighbor];
        if (distances[neighbor] > newDistance) {
          distances[neighbor] = newDistance;
          parents[neighbor] = currVertex;
        }
      }
      visited.add(currVertex);
      currVertex = this.vertexWithMinDistance(distances, visited);
    }

    console.log(parents);
    console.log(distances);
  }

  vertexWithMinDistance(distances: Obj, visited: Obj) {
    let minDistance = Infinity,
      minVertex = null;
    for (let vertex in distances) {
      let distance = distances[vertex];
      if (distance < minDistance && !visited.has(vertex)) {
        minDistance = distance;
        minVertex = vertex;
      }
    }
    return minVertex;
  }
}

let g = new Graph();

g.addVertex('A');
g.addVertex('B');
g.addVertex('C');
g.addVertex('D');

g.addEdge('A', 'B', 3);
g.addEdge('A', 'C', 2);
g.addEdge('B', 'D', 2);
g.addEdge('C', 'D', 6);

g.dijkstra('A');

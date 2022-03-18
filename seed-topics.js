require('dotenv').config();
require('./config/database');
const fs = require('fs');
const Topic = require('./models/topic');

Topic.deleteMany({})
    .then(async () => {
        const fileText = fs.readFileSync('./topics.tsv', 'utf8');
        const lines = fileText.split('\n').slice(1); // cut off the header

        // build a tree of all the topics
        const topicTree = new Tree('root', { _id: 'root', left: 0, right: 0 });
        lines.forEach(line => {
            let nodes = line.trim().split('\t').map(val => val.trim());
            nodes = ['root', ...nodes];
            nodes.forEach((node, index) => {
                if (!topicTree.find(node)) {
                    topicTree.insert(nodes[index - 1], node, { _id: node, left: 0, right: 0 });
                }
            })
        })

        // traverse the tree to assign values
        numberSubTree(topicTree.root, 1);

        // add the prepared nodes to the db
        for (const node of topicTree.preOrderTraversal()) {
            await Topic.create(node.value);
        }

        console.log(topicTree.root.value.right / 2 - 1, 'topics added');
        process.exit(0);
    })
    .catch(err => console.error(err));

function numberSubTree(treeNode, startingWith) {
    treeNode.value.left = startingWith;
    treeNode.children.forEach(child => {
        startingWith = numberSubTree(child, startingWith+1);
    });
    treeNode.value.right = startingWith + 1;
    return startingWith + 1;
}



// getting help from https://www.30secondsofcode.org/articles/s/js-data-structures-tree
// and making a few adaptations/cuts
class TreeNode {
    constructor(key, value, parent = null) {
        this.key = key;
        this.value = value;
        this.parent = parent;
        this.children = [];
    }
}

class Tree {
    constructor(key, value) {
        this.root = new TreeNode(key, value);
    }

    *preOrderTraversal(node = this.root) {
        yield node;
        if (node.children.length) {
            for (let child of node.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    insert(parentNodeKey, key, value) {
        for (let node of this.preOrderTraversal()) {
            if (node.key === parentNodeKey) {
                node.children.push(new TreeNode(key, value, node));
                return true;
            }
        }
        return false;
    }

    find(key) {
        for (let node of this.preOrderTraversal()) {
            if (node.key === key) return node;
        }
        return undefined;
    }
}

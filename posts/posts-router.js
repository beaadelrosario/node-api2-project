const express = require("express");

const db = require("../data/db");

const router = express.Router();

router.get("/", (req,res) => {
    db.find()
      .then(res => {
        res.status(200).json({data:res});
    })
      .catch(err => {
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
});

/* When the client makes a GET request to /api/posts/:id: */
router.get("/:id", (req,res) => {
    const id = Number(req.params.id);
    db.findById(id)
      .then((post) => {
        if (!post) {
          res.status(404).json({ message: "Post not found" }).end();
        }
        if (post) {
          res.status(200).json(post).end();
        } else {
          res.status(500).json({ message: "something went wrong" }).end();
        }
    })
});

/* When the client makes a GET request to /api/posts/:id/comments: */
router.get("/:id/comments", (req,res) => {
    const id = Number(req.params.id);
    db.findCommentById(id)
      .then((post) => {
          if (db.findCommentById) {
              res.status(200).json(db.findCommentById);
          } else if (!db.findCommentById) {
              res.status(404).json({ message: "The post with the specified ID does not exist." })
          } else {
              res.status(500).json({ error: "The comments information could not be retrieved." })
          }
      })
});

/* When the client makes a POST request to /api/posts */
router.post("/", (req,res) => {
    const content = req.body;
    const postTitle = content.title;
    const postContent = content.contents;

    if (!postTitle || !postContent) {
      res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else if (content) {
    db.insert(content)
      .then((content)=>{
        res.status(201).json(content);
    });
    } else {
      res.status(500).json({  error: "There was an error while saving the post to the database"  });
    }
});

/* When the client makes a POST request to /api/posts/:id/comments: */
router.post("/:id/comments", (req,res) => {
    const comment = req.body;
    const id = Number(req.params.id);
    const commentId = comment.post_id;
    const commentText = comment.text

    db.insertComment(comment)
      .then((post) => {
        if (comment) {
            res.status(201).json(post);
        } if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else if (!commentText) {
            res.status(400).json({ errorMessage: "Please provide text for the comment." })
        } else {
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        }
      })
});

/* When the client makes a DELETE request to /api/posts/:id */
router.delete("/:id", (req,res)=>{
    db.remove(req.params.id)
      .then(res => {
        if(res > 0 ) {
            res.status(200).json({message:"the post has been hacked"})
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
      .catch(err => {
        res.status(500).json({ err: "The post could not be removed" })
    })
});

/* When the client makes a PUT request to /api/posts/:id */
router.put("/:id", (req,res) => {
    const id = Number(req.params.id);
    const update = req.body;
    const postTitle = req.body.title;
    const postContent = req.body.content;

    db.findById(id) // first find the post by id
    .then((post)=>{
    if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
        } else if (!postTitle || !postContent) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        } else if (update && post) {
        db.update(id, update); // all good
        res.status(200).json(update);
        } else {
        res.status(500).json({ error: "The post information could not be modified." });
        }
    })
});

module.exports = router;
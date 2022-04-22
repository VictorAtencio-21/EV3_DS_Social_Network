const router = require("express").Router();
const Post = require("../models/Post");
const {createClient} = require("redis");

//Configuring redis
const client = createClient({
  host: '127.0.0.1',
  port: 6379,
  socket: {
    host: "redis"
  }
});

//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});
//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});
//like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//comment a post
router.put("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { comment } = req.body;
    await post.updateOne({ $push: { comments: comment }})
    res.status(200).json("comment published!")
  } catch (err){
    res.status(500).json(err.message);
  }
})

//get a post

router.get("/:id", async (req, res) => {
  try {

     // Search Data in Redis
    const reply = await client.get(req.params.id);

    // if exists returns from redis and finish with response
    if (reply) {
      console.log("using cached data");
      return res.send(JSON.parse(reply));
    }

    // finding post in database
    const post = await Post.findById(req.params.id);

    // Saving the results in Redis. The "EX" and 15, sets an expiration of 15 Seconds
    const saveResult = await client.set(
      req.params.id,
      JSON.stringify(post),
      {
        EX: 15,
      }
    );

    console.log("saved data:", saveResult);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//get timeline posts

router.get("/timeline/all", async (req, res) => {
  try {

    // Search Data in Redis
    const reply = await client.get("posts");

    // if exists returns from redis and finish with response
    if (reply) return res.send(JSON.parse(reply));

    // finding in database
    const userPosts = await Post.find();

    // Saving the results in Redis. The "EX" and 20, sets an expiration of 20 Seconds
    const saveResult = await client.set(
      "posts",
      JSON.stringify(userPosts),
      {
        EX: 20,
      }
    );

    console.log("saved data:", saveResult);

    res.json(userPosts)
  } catch (err) {
    res.status(500).json(err.message);
  }
});

async function connectRedis() {
  await client.connect();
}

connectRedis();

module.exports = router;
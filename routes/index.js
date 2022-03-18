const express = require('express');
const router = express.Router();
const Question = require('../models/question');
const Topic = require('../models/topic');

router.get('/search', async function (req, res) {
  try {
    const mainTopic = await Topic.findOne({ _id: req.query['q'].trim() }).exec();
    const subTopics = await Topic.find({ left: { $gt: mainTopic.left }, right: { $lt: mainTopic.right } }).exec();
    const allTopicsText = [mainTopic, ...subTopics].map(topic => topic._id);
    const questions = await Question.find({ annotations: { $in: allTopicsText } }).sort({ _id: 1 }).exec();
    const questionNumbers = questions.map(question => question._id);
    res.status(200).json(questionNumbers);
  } catch (err) {
    console.error(err);
    res.status(400).json(null);
  }
});

module.exports = router;

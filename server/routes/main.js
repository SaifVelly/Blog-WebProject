const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


/**
 * GET /
 * Contact
*/
router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});


//just inserting some data so it does not look empty at the beggining !
function insertPostData() {
  Post.insertMany([
    {
      title: "The Rise of Progressive Web Apps (PWAs)",
      body: "Explore the evolution of web applications with Progressive Web Apps, their advantages, and how they are changing the landscape of web development."
    },
    {
      title: "Machine Learning in JavaScript with TensorFlow.js",
      body: "Discover how TensorFlow.js is enabling machine learning capabilities in the browser and Node.js, making it easier for developers to build and deploy ML models in JavaScript."
    },
    {
      title: "Securing Your Web Applications: Best Practices in 2024",
      body: "Stay updated on the latest security practices for web applications, covering topics such as HTTPS, Content Security Policy (CSP), and protection against common vulnerabilities."
    },
    {
      title: "GraphQL vs. REST: Choosing the Right API for Your Project",
      body: "Compare GraphQL and REST APIs, their strengths, weaknesses, and considerations for selecting the right API architecture based on your project requirements."
    },
    {
      title: "Introduction to Serverless Computing with AWS Lambda",
      body: "Dive into the world of serverless computing using AWS Lambda, exploring how this paradigm shift is revolutionizing the way developers build and deploy applications."
    },
    {
      title: "Microservices Architecture: Breaking Down Monoliths",
      body: "Learn about the benefits and challenges of microservices architecture, and discover how it enables scalable, maintainable, and loosely coupled software systems."
    },
    {
      title: "JavaScript Frameworks: React vs. Vue vs. Angular",
      body: "Compare popular JavaScript frameworks—React, Vue, and Angular—understanding their strengths, use cases, and the factors to consider when choosing the right framework for your project."
    },
    {
      title: "The Future of WebAssembly: Unlocking High-Performance Web Apps",
      body: "Explore the capabilities of WebAssembly (Wasm) and its potential impact on web development, paving the way for high-performance, cross-platform applications."
    },
    {
      title: "DevOps in Action: Continuous Integration and Continuous Deployment (CI/CD)",
      body: "Implement CI/CD pipelines in your development workflow, understanding the principles of continuous integration and continuous deployment for faster, more reliable software delivery."
    },
    {
      title: "The Art of Code Review: Best Practices for Effective Collaboration",
      body: "Master the art of code review, understanding the importance of collaborative code inspection and adopting best practices for providing and receiving constructive feedback in the development process."
    },
  ]);
}

// insertPostData();


module.exports = router;

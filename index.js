import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname =  dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// Middleware to support PUT and DELETE methods in forms
app.use(methodOverride("_method"));

// Array to store data
const user = [{id: 1, title: "Travel Blog", date: '15/7/2024, 12:42:11 am', subject: "Love Travelling Blog", content: "Welcome to my travel blog, Love Travelling.  I’m Marion, an award winning independent traveller writing about my visits to countries near and far.I research destinations myself and that’s part of the fun – visiting the local library and selecting some travel guides, looking things up online and, of course, all the amazing tips I discover from fellow travel bloggers.The world is a book and those who do not travel read only one page.Augustine of Hippo My passion is travel,  I just love visiting new places, immersing myself into local cultures of life around the world and discovering the unexpected!  Stepping off a plane, I’m always in a hurry to get my passport stamped, reclaim my luggage and walk out of the arrivals hall ready to begin a new adventure.", likes: 0, dislikes: 0},
    {id: 2, title: "Moving On",subject: "Moving on from those things which hurt you.", content: "I know you have lots of questions and I’ve kept you in the dark for some time now.It hasn’t been that I haven’t wanted to tell you what’s been going on, it just didn’t occur to me that it would all last this long.When we left Australia it was at a time of worldwide hopefulness. That brief window where covid was about to be vanquished for good by the vaccine, people felt comfortable enough to travel, party, get married, and surely the world’s borders would soon be flung open.Sadly that window didn’t stay open for very long.You see, Americans can travel to and from Europe and the UK, but we can’t. We can get into England, but we can’t get back here again. Here is where my husband needs to be for work, and if we learned one thing from the sudden state closures in Aus, it’s not to risk splitting the family across borders.Home is where the dog is! Which is at my mum’s. I’ve been battling waves of homesickness and the constant sense of impending doom we all live with now, so probably haven’t been as chatty as I usually am.The question “are you in LA forever?” pops up a few times a day and the truth is, I don’t know. I don’t think I’ll ever be anywhere forever, but I no longer make plans further than a week away. Ask me about Christmas and I’ll put my fingers in my ears and start singing.",date: '15/7/2024, 12:42:11 am', likes: 0, dislikes: 0}];

app.get("/",(req,res) => {
    res.render("index.ejs",{user});
});

app.get("/create",(req,res) => {
    res.render("create.ejs");
});

app.post("/submit", (req, res) => {
    // collect req.body is JSON data
    const {title,subject,content} = req.body; 

    // Create a new blog post object
    const newBlogPost = {
        id: user.length + 1,
        title,
        subject,
        content,    
        likes: 0,
        dislikes: 0,
        date: new Date().toLocaleString() // Store current date and time
    };
    // Store data in the array
    user.push(newBlogPost);

    // Redirect to newly created blog
    res.redirect("/");
});

// Route to view blog.ejs
app.get("/blogs/:id", (req, res) => {
    const { id } = req.params;
    const userPost = user.find(post => post.id === parseInt(id));

    if (!userPost) {
        res.status(404).send("Blog post not found");
        return;
    }
    res.render("blog.ejs", { userPost });
});

// Route to serve the form to edit a specific blog post
app.get("/blogs/:id/update", (req, res) => {
    const { id } = req.params;
    const userPost = user.find(post => post.id === parseInt(id));

    if (!userPost) {
        res.status(404).send("Blog post not found");
        return;
    }

    res.render("update.ejs", { userPost });
});

// Route to handle PUT requests to update a specific blog post
app.put("/blogs/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    // Find index of blog post with given id
    const index = user.findIndex(post => post.id === parseInt(id));

    if (index === -1) {
        res.status(404).send("Blog post not found");
        return;
    }

    // Update blog post in array
    user[index].title = title;
    user[index].content = content;

    // Redirect to view the updated blog post
    res.redirect(`/blogs/${id}`);
});

// Route to handle POST requests to like a blog post
app.post("/blogs/:id/like", (req, res) => {
    const { id } = req.params;

    // Find index of blog post with given id
    const index = user.findIndex(post => post.id === parseInt(id));

    if (index === -1) {
        res.status(404).send("Blog post not found");
        return;
    }

    // Increment likes count
    user[index].likes++;

    // Redirect to view the blog post
    res.redirect(`/blogs/${id}`);
});

// Route to handle POST requests to dislike a blog post
app.post("/blogs/:id/dislike", (req, res) => {
    const { id } = req.params;

    // Find index of blog post with given id
    const index = user.findIndex(post => post.id === parseInt(id));

    if (index === -1) {
        res.status(404).send("Blog post not found");
        return;
    }

    // Increment dislikes count
    user[index].dislikes++;

    // Redirect to view the blog post
    res.redirect(`/blogs/${id}`);
});

// Route to handle DELETE requests to delete a specific blog post
app.delete("/blogs/:id", (req, res) => {
    const { id } = req.params;

    // Find index of blog post with given id
    const index = user.findIndex(post => post.id === parseInt(id));

    if (index === -1) {
        res.status(404).send("Blog post not found");
        return;
    }

    // Remove blog post from array
    user.splice(index, 1);

    console.log(`Post id:${id} deleted successfully!!`);
    // Redirect to view all blog posts
    res.redirect("/");
});

app.get("/contact", (req,res) => {
    res.sendFile(__dirname + "/public/contact.html");
});

app.get("/about", (req,res) => {
    res.sendFile(__dirname + "/public/about.html");
});

app.listen(port, () => {
    console.log(`Server is running on port${port}`);
});
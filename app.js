var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	methodOverride 	= require("method-override"),
	expressSanitizer= require("express-sanitizer"),
	mongoose 		= require("mongoose");


//FIXING DEPRECATION WARNINGS (Write it above mongoose.connect(...))
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


// Set-up mongoose
mongoose.connect("mongodb://localhost/restful_blog_app");  //Creating a database restful_blog_app as it is executed for first time

// App Config 
app.set("view engine", "ejs");                             // Allows to write file names without extension .ejs
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());                               // Write it after bodyParser



// Mongoose SCHEMA
var blogSchema=  new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}               // Date will be automatically allocated
});


// Compile mongoose model to an object
var Blog = mongoose.model("Blog", blogSchema);




// RESTful Routes
app.get("/", function(req, res){
	res.redirect("/blogs");	
});


// INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){                   // Retrieve all the Blogs from the database
		if(err){
			console.log(err);
		}
		else{
			res.render("index", {blogs: blogs});          // render index.ejs with all the data
		}
	});                                                      
});


// NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});


// CREATE ROUTE
app.post("/blogs", function(req, res){
	// sanitize 
	req.body.blog.body = req.sanitize(req.body.blog.body);
	
	// create blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}
		else{
			// redirect to index page
			res.redirect("/blogs");
		}
	});
	
});


// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show", {blog: foundBlog});
		}
	});
});


// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit", {blog: foundBlog});
		}
	});
	
});


// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	// sanitize 
	req.body.blog.body = req.sanitize(req.body.blog.body);
	
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});


// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	
	// destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
	
	//Redirect
	
});



app.listen(process.env.PORT || 3000, process.env.IP, function(){
   console.log("SERVER STARTED!!!"); 
});








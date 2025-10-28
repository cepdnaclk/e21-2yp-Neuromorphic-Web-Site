const fs=require('fs');
const mongoose=require('mongoose');
const colors=require('colors');
const dotenv=require('dotenv');


// Load env vars
dotenv.config({path: './config/config.env'});

// Load models
const User=require('./models/User');
const Contributor=require('./models/Contributor');
const News=require('./models/News');
const Event=require('./models/Publication');
const Project=require('./models/Project');
const Blog=require('./models/Blog');
const Publication = require('./models/Publication');



// Connect to DB
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once('open',()=>{
    console.log('MongoDB Connected'.cyan.underline);
})

// Read JSON files

const users=JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8')
);

const contributors=JSON.parse(
    fs.readFileSync(`${__dirname}/_data/contributors.json`,'utf-8')
);

const news=JSON.parse(
    fs.readFileSync(`${__dirname}/_data/news.json`,'utf-8')
);

const publications=JSON.parse(
    fs.readFileSync(`${__dirname}/_data/publications.json`,'utf-8')
);

const project=JSON.parse(
    fs.readFileSync(`${__dirname}/_data/projects.json`,'utf-8')
);

const blogs=JSON.parse(
    fs.readFileSync(`${__dirname}/_data/blogs.json`,'utf-8')
);


// Import into DB
const importData=async()=>{
    try{
        // First, create bootcamps and users
        await User.create(users);
        await Contributor.create(contributors);
        
        await News.create(news);
        await Event.create(publications);
        await Project.create(project);
        await Blog.create(blogs);

        
        console.log('Data Imported....'.green.inverse);
        process.exit()
    }catch(err){
        console.log(err);
    }
}

// Delete data
const deleteData=async()=>{
    try{
        await User.deleteMany();
        await Contributor.deleteMany();
        await News.deleteMany();
        await Publication.deleteMany();
        await Project.deleteMany();
        await Blog.deleteMany();
        console.log('Data Destroyed....'.red.inverse);
        process.exit()
    }catch(err){
        console.log(err);
    }
};

if(process.argv[2]==='-i'){
    importData();
}else if(process.argv[2]==='-d'){
    deleteData();
}


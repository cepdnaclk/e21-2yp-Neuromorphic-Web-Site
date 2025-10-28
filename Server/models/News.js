const mongoose = require('mongoose');
const slugify = require('slugify');

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: { type: String, unique: true },
    brief: {
        type: String,
        required: [true, 'Please add a brief description'],
        maxlength: [300, 'Brief cannot be more than 300 characters']
    },
    fullContent: {
        type: String,
        required: [true, 'Please add full content']
    },
    author: {
        type: String,
        required: [true, 'Please add an author name'],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: 'img/hero.jpg'
    },
    link: {
        type: String,
        default: '#'
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
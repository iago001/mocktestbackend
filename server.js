const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;

const examCategory = require('./examcategory.js');

app.use(express.static('static'));
app.use(bodyParser.json());

const issues = [{
		id: 1,
		status: 'Open',
		owner: 'Ravan',
		created: new Date('2016-08-15'),
		effort: 5,
		completionDate: undefined,
		title: 'Error in console when clicking Add',
	}, {
		id: 2,
		status: 'Assigned',
		owner: 'Eddie',
		created: new Date('2016-08-16'),
		effort: 14,
		completionDate: new Date('2016-08-30'),
		title: 'Missing bottom border on panel',
	},
];

app.get('/api/exam/categories', (req, res) => {
	db.collection('exam_category').find().toArray().then(categories => {
        const metadata = { total_count: categories.length };
        res.json({ _metadata: metadata, records: categories});
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: $(error)`});
    });
});

app.post('/api/exam/categories', (req, res) => {
	const newCategory = req.body;

	const err = examCategory.validateExamCategory(newCategory);
	if (err) {
		res.status(422).json({
			message: `Invalid request: ${err}`
		});
		return;
	}

	db.collection('exam_category').insertOne(newCategory).then(result =>
		db.collection('exam_category').find({
			_id: result.insertedId
		}).limit(1).next())
	.then(newCategory => {
		res.json(newCategory);
	}).catch(error => {
		console.log(error);
		res.status(500).json({
			message: `Internal server error: $(error)`
		});
	});
});

let db;
mongoClient.connect('mongodb://localhost:27017').then(connection => {
	db = connection.db('mocktestdb');
	app.listen(3100, function () {
		console.log('App started on port 3100');
	});
}).catch(error => {
	console.log('Error:', error);
});
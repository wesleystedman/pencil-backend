require('dotenv').config();
require('./config/database');
const fs = require('fs');
const Question = require('./models/question');

Question.deleteMany({})
    .then(async () => {
        const fileText = fs.readFileSync('./questions.tsv', 'utf8');
        const lines = fileText.split('\n').slice(1); // cut off the header
        const questions = lines.map(line => {
            const values = line.split('\t').map(val => val.trim());
            const questionDoc = {
                number: parseInt(values[0]),
                annotations: values.slice(1)
            }
            return questionDoc;
        });
        await Question.create(questions);
        console.log(`Created ${questions.length} questions`);
        process.exit(0);
    })
    .catch(err => console.error(err))

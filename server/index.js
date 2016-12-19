import Express from 'express'
import fs from 'fs'
import Q from 'q'
import Marked from 'marked'
import BodyParser from 'body-parser'

const app = Express()
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1337')
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST')

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true)

	// Pass to next layer of middleware
	next()
})


app.get('/posts', (req, res) => {
	Q.fcall(() => getData('./data/posts/'))
		.then(data => res.status(200).json({ posts: data }))
		.catch(err => { console.log(err); return res.sendStatus(500) })
		.done()
})

app.post('/posts', (req, res) => {
	console.dir(req.body)
	try {
		Q.fcall(
			() => {
				console.log(
					fs.readdirSync(req.body.directory))
				if (fs.readdirSync(
					req.body.directory,
					err => { if (err) return res.status(500).json({ error: 'No such directory' }) })
					.indexOf(req.body.title + '.md') < 0) {
					fs.writeFile(
						req.body.directory + req.body.title + '.md',
						req.body.text,
						'utf8',
						err => { if (err) return res.status(500).json({ error: 'Cant write file.' }) }
					)
					return res.sendStatus(200)
				} else {
					return res.status(500).json({ error: 'File exists.' })
				}
			})
			.catch(err => { console.log(err); return res.status(500).json({ error: 'Something went wrong.' }) })
			.done()
	}
	catch (err) {
		console.log(err)
	}

})


app.get('/portfolio', (req, res) => {
	Q.fcall(() => getData('./data/portfolio/'))
		.then(data => res.status(200).json({ portfolio: data }))
		.catch(err => { console.log(err); return res.sendStatus(500) })
		.done()
})


const getData = (directory) => {
	let content = []
	if (fs.readdirSync(directory).length) {
		fs.readdirSync(directory).sort((file, nextfile) => {
			if (fs.statSync(directory + file).birthtime > fs.statSync(directory + nextfile).birthtime) return -1
			if (fs.statSync(directory + file).birthtime < fs.statSync(directory + nextfile).birthtime) return 1
			return 0
		}).forEach((file, index) =>
			content.push({
				id: index,
				createdate: fs.statSync(directory + file).birthtime,
				editdate: fs.statSync(directory + file).ctime,
				data: fs.readFileSync(directory + file).toString()
			})
			)
	}
	return content
}


app.listen(9000, () => {
	console.log('listening on port 9000')
})

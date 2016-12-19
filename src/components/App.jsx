import React, { Component } from 'react'

import Axios from 'axios'
import Marked from 'marked'

import testmd from '../../data/test.md'

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = { posts: null }
	}

	componentWillMount() {
		Axios.get('http://localhost:9000/posts')
			.then(res => this.setState({ posts: res.data.posts }))
	}
	render() {
		return (
			<div>
				<div dangerouslySetInnerHTML={{ __html: testmd }} />
				{this.state.posts ?
					this.state.posts.map(
						(p, i) =>
							<div
								key={new Date().getTime() + i}
								dangerouslySetInnerHTML={{ __html: Marked(p.data) }}
								/>
					) :
					null
				}
			</div>
		)
	}
}

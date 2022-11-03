import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import HelloWorld from './components/HelloWorld/HelloWorld'
import Loading from './components/Loading'

const App = () => {
	return (
		<React.Fragment>
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={HelloWorld} />
				</Switch>
			</BrowserRouter>
			<Loading/>
		</React.Fragment>
	)
}

export default App

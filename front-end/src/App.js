import React, { Component } from 'react';
import "semantic-ui-css/semantic.min.css"; //{ Input, List} from
import './App.css';
import WeatherContainer from './WeatherContainer';
import Login from './Login';
import Navi from './Navbar/Navbar';
import Delete from './DeleteUser/DeleteContainer'
import { Route, Link, Switch } from 'react-router-dom';
import EditUser from './Editing/EditContainer'
import Profile from './Profile';

// Dark sky API key: 54027aaa136404819ab799aaa96235ce
// Google API key: AIzaSyBHLett8djBo62dDXj0EjCimF8Rd6E8cxg
class App extends Component {
  constructor(){
    super();
    this.state = {
      username: [],
      password: "",
      location: Number,
      loggedIn: false,
      id: ""
    }
  }
  handleInputs = (e) => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
  }

  submitRegistration = async (e) => {
    e.preventDefault();
    console.log("GOT HERE")
    console.log(this.state);
    try{
      console.log("GOT HERE, TOO")
      const createUser = await fetch('http://localhost:9000/auth/register', {
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
          'Content-Type': 'application/json'
        } 
      });
      const parsedResponse = await createUser.json();
      console.log(parsedResponse, ' this is response')
      if(parsedResponse.status == 200){
        this.setState({
          loggedIn: true,
          // this isn't a real login - need to align it with the back-end to sort that out
          username: parsedResponse.data.username,
          location: parsedResponse.data.location,
          id: parsedResponse.data._id
        })
      } else if (parsedResponse.status == 500){
        console.log("INTERNAL SERVER ERROR")
      }
    }catch(err){
      console.log(err, " error")
    }
  }

  submitLogin = async (e) => {
    e.preventDefault();
    console.log("GOT LOGS")
    try{
      const loggedUser = await fetch('http://localhost:9000/auth/login', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
          'Content-Type': 'application/json'
        } 
      });
      const parsedLogged = await loggedUser.json();
      console.log(parsedLogged, ' login successful')
      if(parsedLogged.status == 200){
        //this.state.history.push('/users');
        this.setState({
          loggedIn: true,
          username: parsedLogged.data.username,
          location: parsedLogged.data.location,
          id: parsedLogged.data._id
        })
      } else if (parsedLogged.status == 500){
        console.log("INTERNAL SERVER ERROR")
      }
    }catch(err){
      console.log(err, " error")
    }
  }

  deletedUser = async(id) => {
    console.log("delete user " + id);

    const deleted = await fetch("http://localhost:9000/users/" + id, {
      //credentials: 'include',
        method: "DELETE"
    })
    this.setState({
      loggedIn: false,
    })
    const deletedParsed = await deleted.json();
  //  if(deletedParsed.status === 200){
  //       this.setState({
  //           username: this.state.username.filter((user)=>{
  //               return user._id !== id
  //           })
  //       })
  //   }
    console.log(deletedParsed)
}

  submitEdits = async (e) => {
    // e.preventDefault();
    console.log("EDITS SUBMITTED");
    console.log(this.state.id)
    try{
        const editedUser = await fetch("http://localhost:9000/users/" + this.state.id, {
          method: 'PUT',
          body: JSON.stringify(this.state),
          headers: {
            'Content-Type': 'application/json'
        } 
        });
        const parsedEdit = await editedUser.json();
        console.log(parsedEdit);
        this.setState({
            username: parsedEdit.data.username,
            password: parsedEdit.data.password,
            location: parsedEdit.data.location,
        })
        console.log(this.state.location);
    }catch(err){
      console.log("HERE")
      console.log(err);
    }
}

handleLogout = async (e) => {
  console.log('GOT LOGOUT')
  await this.setState({
    loggedIn: false
  })
  console.log(this.state.loggedIn)
  //this.props.history.push("/");
}

  render(){
    return (
      <div className="App">
        <Profile handleInputs={this.handleInputs} username={this.state.username} password={this.state.password} location={this.state.location} submitEdits={this.submitEdits} id={this.state.id}/>
        <Navi deletedUser ={this.deletedUser} username={this.state.username} id={this.state.id}/>

        {/* <Switch>
          <Route exact path="/" Component={Login}/>
          <Route exact path="/weather" Component={WeatherContainer}/> */}
        { this.state.loggedIn ? <WeatherContainer username={this.state.username} location={this.state.location} /> : <Login submitRegistration={this.submitRegistration} handleInputs={this.handleInputs} submitLogin={this.submitLogin}/>}
        {/* </Switch> */}
      </div>
    );
  }
}


export default App;
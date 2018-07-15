import React from "react";
import axios from "axios";
import { getToken } from "../services/tokenService";
import Logout  from './Logout';

class Dashboard extends React.Component {
  state = {
    todo: "",
    todos: []
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  async componentDidMount() {
    // 1. When the dashboard loads, get the user's token
    const token = getToken();
    // 2. Send a GET request to /todo and pass the token to grab a list of ONLY this user's todos
    try {
      const res = await axios.get('todo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.setState({todos: res.data.payload})
    } catch(e) {
      console.error(e);
    }
    // 3. If we get a successful response, store the todos in state.
  }
  handleSubmit = async e => {
    e.preventDefault();
    const { todo } = this.state;

    // 1. Get the user's token
    const token = getToken();
    // 2. Send a POST to /todo with
    try {
      const res = await axios.post('/todo', 
      {
        description: todo
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res);
      this.getTodos();
    } catch(e) {
      console.error(e);
    }
    //  a - the body containing the TODO we wish to post
    //  b - the Authorization Header Bearer <token>
  };
  getTodos = async () => {
    const token = getToken();

    try {
      const res = await axios.get('/todo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res);
      const todos = res.data.payload;
      this.setState({ todos });
    } catch(e) {
      console.error(e);
    }
  }
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <form onSubmit={this.handleSubmit}>
          <input name="todo" type="text" onChange={this.handleChange} />
          <button>Add Todo</button>
        </form>
        <ul>
          {this.state.todos.map(todo => {
            return <li>{JSON.stringify(todo, null, 3)}</li>;
          })}
        </ul>
        <Logout setUser={this.props.setUser} />
      </div>
    );
  }
}

export default Dashboard;

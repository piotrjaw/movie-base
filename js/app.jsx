import React from 'react';
import ReactDOM from 'react-dom';
import "../scss/style.scss";

document.addEventListener('DOMContentLoaded', function(){

  class Header extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        text: "Welcome to movies base!"
      }
    }
    componentDidMount() {
      this.timerId = setTimeout( () =>{
        this.setState({text: "See some details about movie you want!"})
      }, 3000)
    }
    componentWillUnmount() {
      clearTimeout(this.timerId);
    }
    render(){
      return <header>
          <h1>{this.state.text}</h1>
        </header>
    }
  }

  class MovieInfo extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        loading: true,
        info: {}
      }
    }

    componentWillReceiveProps(props) {
      console.log('componentWillReceiveProps: ', props.title)
      if (props.title === null) {
        return null;
      }
      fetch('http://www.omdbapi.com/?t=' + props.title).then( resp =>{
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error("Błąd sieci");
        }
      }).then( info => {
        console.log('JSON: ', info);
        this.setState({loading: false, info: info})
      }).catch( (err) => {
          this.setState({title: "ERROR!"})
        });
    }

    render(){
      if (this.state.loading) {
        return null;
      } else {
        const details = <div className="movie-info">
            <div className="image">
              <img src={this.state.info.Poster}></img>
            </div>
            <div className="details">
              <h3>Movie title: <span>{this.state.info.Title}</span></h3>
              <ul>
                <li>Year: {this.state.info.Year}</li>
                <li>Genre: {this.state.info.Genre}</li>
                <li>Runtime: {this.state.info.Runtime}</li>
                <li>Director: {this.state.info.Director}</li>
                <li>Description: {this.state.info.Plot}</li>
              </ul>
            </div>
          </div>
        return details
      }
    }
  }

  class SearchMovies extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        title: this.props.title
      }
    }
    handleClick = (e) => {
      e.preventDefault();
      console.log('kliknięty');
      console.log('Input value: ', this.input.value);
      this.setState({title: this.input.value});
    }

    render(){
        return <div className="container">
              <Header/>
              <form className="search-form">
                <input type="text" name="search" ref={ (input) => {
                    return this.input = input;
                  } } placeholder="Wpisz tytuł filmu"></input>
                <button onClick={this.handleClick}>Pobierz film</button>
              </form>
              <MovieInfo title={this.state.title}/>
            </div>
        }
  }

  class App extends React.Component {
    render(){
      return <SearchMovies/>
    }
  }
  ReactDOM.render(
      <App/>,
      document.getElementById('app')
  );
});

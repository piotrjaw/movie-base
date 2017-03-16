import React from 'react';
import ReactDOM from 'react-dom';
// import "../scss/style.scss";

document.addEventListener('DOMContentLoaded', function(){

  class Header extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        text: "Witaj w bazie filmów!"
      }
    }
    componentDidMount() {
      this.timerId = setTimeout( () =>{
        this.setState({text: "Pobieraj filmy jakie tylko chcesz!"})
      }, 3000)
    }
    componentWillUnmount() {
      clearTimeout(this.timerId);
    }
    render(){
      return <div className="container">
        <header>
          <h1>{this.state.text}</h1>
        </header>
      </div>
    }
  }

  class MovieInfo extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        loading: true,
        infos: []
      }
    }
    // index.html:1 Uncaught (in promise) SyntaxError: Unexpected token < in JSON at position 2
    componentDidMount() {
      fetch('http://www.omdbapi.com/?t=Batman').then( resp =>{
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error("Błąd sieci");
        }
      }).then( obj => {
        console.log(obj);
        const details = obj.map( (items) => {
          return <li key={items.imdbID}>
            <div className="movie-info">
              <div className="image">
                Plakat
              </div>
              <h3>Tytuł: {items.Title}</h3>
              <ul>
                <li>Rok: {items.Year}</li>
                <li>Gatunek: {items.Genre}</li>
                <li>Czas trwania: {items.Runtime}</li>
                <li>Reżyseria: {items.Director}</li>
              </ul>
              <p>
                Opis filmu: {items.Plot}
              </p>
            </div>
          </li>
        })
      }).catch( (err) => {
          this.setState({title: "ERROR!"})
        });
    }
    render(){
      if (this.state.loading) {
        return null
      } else {
        return <div>
          <ul>
            {this.state.infos}
          </ul>
        </div>
      }
    }
  }

  class SearchMovies extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        value: ""
      }
    }
    handleClick = (e) => {
      e.preventDefault();
      console.log('kliknięty');
    }

    handleChange = (event) => {
      this.setState({value: event.target.value})
    }

    render(){
      return <div className="container">
              <Header/>
              <form className="search-form">
                <input type="text" name="search" onChange={this.handleChange} value={this.state.value} placeholder="Wpisz tytuł filmu"></input>
                <button onClick={this.handleClick}>Pobierz film</button>
              </form>
              <MovieInfo/>
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

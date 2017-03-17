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
        info: {}
      }
    }
    componentDidMount() {
      console.log('MovieInfo',this.props.title)
      if (this.props.title === null) {
        return null;
      }
      fetch('http://www.omdbapi.com/?t=' + this.props.title).then( resp =>{
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
            <h3>Movie title: {this.state.info.Title}</h3>
            <ul>
              <li>Year: {this.state.info.Year}</li>
              <li>Genre: {this.state.info.Genre}</li>
              <li>Runtime: {this.state.info.Runtime}</li>
              <li>Director: {this.state.info.Director}</li>
              <li>Description: {this.state.info.Plot}</li>
            </ul>
          </div>
        return details
      }
    }
  }

  class SearchMovies extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        title: null
      }
    }
    handleClick = (e) => {
      e.preventDefault();
      console.log('kliknięty');
      console.log(this.input.value);
        this.setState({title: this.input.value});

    }

    render(){
      console.log(this.state.title)
      return <div className="container">
              <Header/>
              <form className="search-form">
                <input type="text" name="search" ref={ (input) => {
                    return this.input = input;
                  } } placeholder="Wpisz tytuł filmu"></input>
                <button onClick={this.handleClick}>Pobierz film</button>
              </form>
              <MovieInfo title={this.state.title} />
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

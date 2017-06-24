'use strict';
const createResponse = (intent,movie)=>{
  if(movie.Response=='True'){
    let {
      Title,
      Year,
      Plot,
      Director,
      Actors,
      Poster
    } = movie;
    let str=""
    switch(intent){
      case 'movieinfo':
        str = `${Title} (${Year}). This film was directed by ${Director} and starred ${Actors}. ${Plot}`.substring(0,317)+'...';
        return {
          text:str,
          image:Poster
        }
      case 'releaseYear':
      str = `${Title} was released in ${Year}`;
      return {
        text:str,
        image:null
      }
      case 'director':
      str = `${Title} (${Year}) was directed by ${Director}`
      return {
        text:str,
        image:null
      }
      default:{
        return {
          text:'Always at your service :)',
          image:null
        }
      }
    }
  }else{
    return {
      text:"I don't seem to understand you question!",
      image:null
    }
  }
}

module.exports = createResponse;

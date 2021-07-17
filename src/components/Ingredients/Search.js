import React,{useState,useEffect,useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredients} = props; 
  const [enterfil,setenterfil] = useState('');

const ref = useRef();


useEffect(()=>{
 const timer = setTimeout(() =>{
    if (enterfil === ref.current.value ){
      let query = 
    enterfil.length === 0 ? '' : `?orderBy="title"&equalTo="${enterfil}"`;
    fetch('https://hooks-7579c-default-rtdb.firebaseio.com/ingredients.json'+ query)
      .then(res=> res.json())
      .then(response=>{
        const loadedIng = [];
        for(let key in response){
          loadedIng.push({
            id: key,
            title: response[key].title,
            amount: response[key].amount
          });
        }
        onLoadIngredients(loadedIng);
      });

    }
    return ()=>{
       clearTimeout(timer);
    }
    

  },500)
 
 
},[enterfil,onLoadIngredients,ref])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" ref={ref} value={enterfil} onChange={(event)=>{setenterfil(event.target.value)}} />
        </div>
      </Card>
    </section>
  );
});

export default Search;

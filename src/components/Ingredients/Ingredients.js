import React, { useEffect,useState,useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isloading,setloading] = useState(false);
  const [erri,seterri] = useState('');

useEffect(()=>{
  fetch('https://hooks-7579c-default-rtdb.firebaseio.com/ingredients.json')
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
      setUserIngredients(loadedIng);
    })
   
},[])

  const addIngredientHandler = ingredient => {
    setloading(true)
    fetch('https://hooks-7579c-default-rtdb.firebaseio.com/ingredients.json',{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        setloading(false);
        return response.json();
        
      })
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = ingredientId => {
    setloading(true);
    fetch(`https://hooks-7579c-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
    {
      method: 'DELETE',
    }
    ).then(response=>{
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
      setloading(false);
    })
    .catch(err => {
      setloading(false);
      seterri(err.message);
    }) 
  }

  const filterHandler = useCallback((filt) =>{
    setUserIngredients(filt)
  
  },[]);

  const clearerr = () => {
    seterri(null);
  }

  return (
    <div className="App">
      {erri && <ErrorModal onClose={clearerr}>{erri}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isloading} />

      <section>
        <Search onLoadIngredients={filterHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;

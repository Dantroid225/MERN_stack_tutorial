import React, { useState, useContext } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Card from '../../shared/components/UIElements/Card';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/components/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({ //get data from the form
        email: {
          value: '',
          isValid: false
        },
        password: {
          value: '',
          isValid: false
        }
      }, false);

const switchModeHandler = () =>{
    if (!isLoginMode){
        setFormData(
            {
                ...formState.inputs,
                name: undefined, //see 'continue' in form-hook. change?
                image: undefined
            },
            formState.inputs.email.isValid && formState.inputs.password.isValid);
    } else {
        setFormData(
            {
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                  value: null,
                  isValid: false
                }
            }, 
            false);        
    }

    setIsLoginMode(prevMode => !prevMode);

};

const authSubmitHandler = async event => { //could use promise/catch
    event.preventDefault();

    
    
    if (isLoginMode) {   
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login', 
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
            {
              'Content-Type': 'application/json'
            }
          );
        //could use axios
        console.log(responseData.token);
        auth.login(responseData.userId, responseData.token);

      } catch (err) {
          //blank as errs handled in hook. could use then method instead and have no catch
      }
    } else {
      try {
        const formData = new FormData();         //browser api formData
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/signup', 
          'POST',
          /* this is replaced with formData for image binary data and sets headers
            JSON.stringify({
              name: formState.inputs.name.value,
              email: formState.inputs.email.value,
              password: formState.inputs.password.value
            }),
            
            {
              'Content-Type': 'application/json'
            }
            */
            formData
        ); //could use axios

        auth.login(responseData.userId, responseData.token);
        console.log(responseData.token);

      } catch (err) {

      }
    } 
    
  };
/*
  const errorHandler = () =>{
    clearError(null);
  };
*/
  return ( //research ErrorModal
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
          {isLoading && <LoadingSpinner asOverlay={true}/>} 
          <h2>Login Required</h2>
          <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && 
          <Input 
              id="name"
              element="input" 
              type="text" 
              label="Your Name" 
              validators={[VALIDATOR_REQUIRE()]}
              errorText ="Please enter a name."
              onInput={inputHandler}
          />   
        }
        {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image." />} {/*passing same data used in inputHandler. change switchModeHandler*/}
        <Input 
          id="email"
          element="input" 
          type="email" 
          label="E-mail" 
          validators={[VALIDATOR_EMAIL()]}
          errorText ="Please enter a valid e-mail."
          onInput={inputHandler}
        />       
        <Input 
          id="password"
          element="input" 
          type="password"  
          label="Password" 
          validators={[VALIDATOR_MINLENGTH(8)]}
          errorText ="Please enter a valid password (at least 8 characters)."
          onInput={inputHandler}
        />
            
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
      </Card>
    </React.Fragment>
    );
  };
export default Auth;
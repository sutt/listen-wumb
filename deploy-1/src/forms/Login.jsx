import React from 'react'
import { Redirect } from 'react-router-dom'


//simple log in form. Our backend doesn't have a users table yet so this is just dummy data to play with after 
//we get all of the fetch, response, and renders to work properly through the front end.
//ideally making it dynamic depending on if user has already logged in or not (duh)

const Login = (props, isLoggedIn) =>
{

    if (!isLoggedIn)
        {
            return <Redirect to="/" />
        }
  return (

    <div>
      <h2>Login to your existing account!</h2>
      <form onSubmit={(e) =>
      {
        e.preventDefault()
        props.handleLogin()
      }} >

        <p>Email:</p>
        
        <input name="email" 
               type="text" 
            //    value={props.formData.email}
               value="" 
               onChange={props.handleChange} />

        <p>Password:</p>

        <input name="password"
               type="password" 
            //    value={props.formData.password} 
               value= ""
               onChange={props.handleChange} />
        <button className="button">Login</button>
      </form>
    </div>
  )
}

export default Login
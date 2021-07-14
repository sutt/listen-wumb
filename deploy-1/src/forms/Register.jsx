import React from 'react';


//form to register new user. Like Login says, we don't have a defined user table in our backend
//so this is just boilerplate code to sit now until we finish the main front end parts
//and can begin focusing on auth/login


export default function Register (props) {
    return (
        <div>
            <div className="register-form-container">
                <form
                    className="register-form"
                    onSubmit={(e) =>
                    {
                        e.preventDefault()
                        props.handleSubmit()
                    }} >
                    <div>
                        <h1> Create a New Account</h1>
                        
                            <p>Email: </p>
                            <input name="email" type="email"
                                // value={props.formData.email} 
                                value="" 
                                onChange={props.handleChange}
                            />

                            <p>Password: </p>
                            <input name="password" type="password"
                                value=""
                                onChange={props.handleChange}
                            />
            

                    </div>
                    <button className="button">Register Account</button>
                </form>
                
            </div>

        </div>
    )
}

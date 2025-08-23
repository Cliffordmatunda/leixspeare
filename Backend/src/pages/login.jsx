import {useState} from "react";


const login = () => {
    const [email,setEmail]=useStateP("");
    const[password,setPassword]=useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Email:", email);
        console.log("Password:", password);
       
    }
     return(
            <div className="login-container">
                {/* <form clas */}

            </div>
        );
}
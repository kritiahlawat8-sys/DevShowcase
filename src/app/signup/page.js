"use client";

import { useState} from "react";
import { useRouter} from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        tenantID: "",
        subdomain: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const res= await fetch ("/api/auth/signup", {
            method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
            body: JSON.stringify(formData),
        });

        const data =await res.json();

        if (res.ok) {
            router.push ("/login");
        }else {
            setError(data.message);
        }
    };
    return(
        <div style={{ maxWidth: "400px", margin: "50px auto"}}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                name="name"
                placeholder="Name"
                value= {formData.name}
                onChange={handleChange}
                aria-required/>
                <br />
                <input
                type="email"
                name="email"
                placeholder="Email"
                value= {formData.email}
                onChange={handleChange}
                required
                />
                <br />
                <input
                type="password"
                name="password"
                placeholder="Password"
                value= {formData.password}
                onChange={handleChange}
                required
                />
                <br />
                <input 
                type="text"
                name="subdomain"
                placeholder="Subdomain (e.g. KRITI)"
                value={formData.subdomain}
                onChange={handleChange}
                />
                <br />
                <button type= "submit">Sign UP</button>
                </form>{error && <p style= {{color: "red" }}>{error}</p>}
                </div>
    );
}
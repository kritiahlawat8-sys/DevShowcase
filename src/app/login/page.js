"use client";

import { useState } from "react";
import { signIn} from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

 const result = await signIn ("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            } else {
      router.push("/dashboard");
    }
 };

    return(
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
          value ={formData.password}
          onChange= {handleChange}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p style ={{ color: "red" }}>{error}</p>}
    </div>
  );
}
import { useState } from "react";
import "./Login.css";

function Login() {
    const [form, setForm] = useState({ username: "", password: "" })

    const handleSubmit = () => {
        console.log("test")
        console.log(form)
    }
    return (<form onSubmit={handleSubmit}>
        <label>
            Username:
            <input type="text" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
        </label>
        <label>
            Password:
            <input type="text" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        <input type="submit" value="Submit" />
    </form>)

}

export default Login;

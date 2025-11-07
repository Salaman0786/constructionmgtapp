import { useState } from "react";
import { useLoginMutation } from "../api/authApi";
import { useAppDispatch } from "../../../app/hooks";
import { setCredentials } from "../slices/authSlice";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: userData.token, user: userData.user }));
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-3">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="text-red-500 mt-2">Invalid credentials</p>}
    </form>
  );
}

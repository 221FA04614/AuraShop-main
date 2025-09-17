"use client";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

export function SignInForm() {
  const [flow, setFlow] = useState("signIn"); 
  const [submitting, setSubmitting] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    try {
      const endpoint = flow === "signIn" ? "login" : "register";
      const payload = flow === "signIn" ? { email, password } : { name, email, password };
      const response = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
      
      const { token } = response.data;
      login(token);
      
      toast.success(flow === "signIn" ? "Signed in successfully!" : "Account created!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const email = formData.get("email");
    setEmailForReset(email);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      toast.success(response.data.message);
      setFlow("resetPassword");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const otp = formData.get("otp");
    const newPassword = formData.get("newPassword");

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', { email: emailForReset, otp, newPassword });
      toast.success(response.data.message);
      setFlow("signIn");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (flow === "forgotPassword") {
    return (
      <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
        <p className="text-sm text-center text-gray-600">Enter your email to receive a password reset OTP.</p>
        <input className="auth-input-field" type="email" name="email" placeholder="Email" required />
        <button className="auth-button" type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send OTP"}
        </button>
        <button type="button" className="text-center text-sm text-blue-600 hover:underline" onClick={() => setFlow("signIn")}>
          Back to Sign In
        </button>
      </form>
    );
  }

  if (flow === "resetPassword") {
    return (
      <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
        <p className="text-sm text-center text-gray-600">Enter the OTP from your email and your new password.</p>
        <input 
          className="auth-input-field" 
          type="text" 
          name="otp" 
          placeholder="Enter OTP" 
          required 
        />
        <input 
          className="auth-input-field" 
          type="password" 
          name="newPassword" 
          placeholder="New Password" 
          required 
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
         <button type="button" className="text-center text-sm text-blue-600 hover:underline" onClick={() => setFlow("signIn")}>
          Back to Sign In
        </button>
      </form>
    );
  }

  return (
    <div className="w-full">
      <form className="flex flex-col gap-4" onSubmit={handleAuthSubmit}>
        {flow === "signUp" && <input className="auth-input-field" type="text" name="name" placeholder="Name" required />}
        <input className="auth-input-field" type="email" name="email" placeholder="Email" required />
        <input className="auth-input-field" type="password" name="password" placeholder="Password" required />
        
        <button className="auth-button" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : flow === "signIn" ? "Sign in" : "Sign up"}
        </button>

        <div className="text-center text-sm text-gray-600">
          <span>
            {flow === "signIn" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button type="button" className="font-medium text-blue-600 hover:underline" onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}>
            {flow === "signIn" ? "Sign up" : "Sign in"}
          </button>
        </div>
        
        {flow === "signIn" && (
            <div className="text-center text-sm">
                <button type="button" className="font-medium text-blue-600 hover:underline" onClick={() => setFlow("forgotPassword")}>
                    Forgot Password?
                </button>
            </div>
        )}
      </form>
    </div>
  );
}
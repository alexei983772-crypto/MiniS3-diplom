import { useState } from "react";
import {
  register,
  login,
  verifyEmail,
} from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register({ onLogin }) {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [code, setCode] = useState("");

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!email.trim()) return "Email is required.";
    if (!emailRegex.test(email))
      return "Please enter a valid email address.";

    if (!passwordRegex.test(password))
      return "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number.";

    if (password !== confirmPassword)
      return "Passwords do not match.";

    if (!acceptedTerms)
      return "You must accept the Terms of Service and Privacy Policy.";

    return null;
  };

  // STEP 1: REGISTER
  const handleRegister = async () => {
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await register(email, password);

      setSuccess(
        "Verification code sent to your email."
      );

      setStep(2);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY + LOGIN
  const handleVerify = async () => {
    setError("");
    setSuccess("");

    if (!code) {
      setError("Enter verification code.");
      return;
    }

    try {
      setLoading(true);

      await verifyEmail(email, code);
      await login(email, password);

      setSuccess("Email verified successfully!");

      if (onLogin) onLogin();

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-3xl p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-slate-300 text-sm mt-2">
            Secure distributed cloud storage for your files.
          </p>

          <p className="text-slate-400 text-xs mt-2">
            Step {step} of 2
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="space-y-4">

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  placeholder-slate-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                "
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  placeholder-slate-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                "
              />

              <div className="mt-2 text-xs text-slate-400">
                Password must contain:
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  placeholder-slate-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                "
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) =>
                  setAcceptedTerms(e.target.checked)
                }
                className="mt-1 h-4 w-4 accent-emerald-500"
              />

              <label
                htmlFor="terms"
                className="text-xs leading-relaxed text-slate-300"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-emerald-400 hover:text-emerald-300 underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-emerald-400 hover:text-emerald-300 underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="
                w-full
                py-3
                rounded-xl
                font-semibold
                text-white
                bg-emerald-600
                hover:bg-emerald-500
                disabled:opacity-60
                disabled:cursor-not-allowed
                transition
                shadow-lg
                shadow-emerald-900/30
              "
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="space-y-4">

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Verification Code
              </label>

              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  text-center
                  tracking-widest
                  text-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                "
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="
                w-full
                py-3
                rounded-xl
                font-semibold
                text-white
                bg-emerald-600
                hover:bg-emerald-500
                disabled:opacity-60
                disabled:cursor-not-allowed
                transition
              "
            >
              {loading
                ? "Verifying..."
                : "Verify & Continue"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full text-sm text-slate-400 hover:text-slate-300"
            >
              Back
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:text-emerald-300"
          >
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../database/firebaseConfiguration";
import { useRouter } from "next/navigation";

export default function PhoneVerification() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar errores

  const router = useRouter();

  useEffect(() => {
    // Inicializar Recaptcha solo si no ha sido creado previamente
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "normal",
            callback: () => {
              // Recaptcha resuelto
              console.log("Recaptcha verificado");
            },
            "expired-callback": () => {
              setErrorMessage("Recaptcha ha expirado, refresca la página.");
            },
          },
          auth
        );
        window.recaptchaVerifier.render(); // Asegurarse de renderizar el reCAPTCHA
      } catch (error) {
        console.error("Error al inicializar Recaptcha:", error);
        setErrorMessage("Error al inicializar Recaptcha");
      }
    }
  }, []);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOTP = async () => {
    if (!window.recaptchaVerifier) {
      setErrorMessage(
        "Recaptcha no está disponible. Refresca la página e inténtalo de nuevo."
      );
      return;
    }

    try {
      const formattedPhoneNumber = `+${phoneNumber.replace(/\D/g, "")}`;
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setErrorMessage(""); // Reiniciar el mensaje de error en caso de éxito
      alert("OTP ha sido enviado");
    } catch (e) {
      console.error("Error al enviar OTP:", e);
      setErrorMessage("Error al enviar OTP. Intenta nuevamente.");
    }
  };

  const handleOTPSubmit = async () => {
    try {
      if (confirmationResult) {
        await confirmationResult.confirm(otp);
        alert("Número de teléfono verificado exitosamente");
        router.push("/");
      } else {
        setErrorMessage("No se ha enviado OTP. Por favor intenta de nuevo.");
      }
    } catch (e) {
      console.error("Error al verificar OTP:", e);
      setErrorMessage("Error al verificar OTP. Intenta nuevamente.");
    }
  };

  return (
    <div>
      <h2>Verificación de Teléfono</h2>
      {!otpSent ? (
        <div>
          <label htmlFor="phone-number">Introduce tu número de teléfono:</label>
          <input
            type="text"
            id="phone-number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="e.g. +1234567890"
          />
          <div id="recaptcha-container"></div>
          <button onClick={handleSendOTP}>Enviar OTP</button>
        </div>
      ) : (
        <div>
          <label htmlFor="otp">Introduce el OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOTPChange}
            placeholder="Introduce OTP"
          />
          <button onClick={handleOTPSubmit}>Enviar OTP</button>
        </div>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
      {/* Mostrar errores */}
    </div>
  );
}

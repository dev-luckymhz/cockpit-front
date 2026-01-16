import Swal from 'sweetalert2';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { loginSchema } from "../schemas/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";

function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    document.title = "Connexion | Rempli";
  }, []);

  const onSubmit = async (data) => {
    const { username, password } = data;

    try {
      await AuthService.login(username, password);

      Swal.fire({
        icon: "success",
        title: "Connexion réussie",
        text: "Bienvenue sur le tableau de bord !",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Échec de la connexion";
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: msg,
      });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-12 col-xl-10">
          <div
            className="card shadow-lg border-0 my-5"
            style={{ backgroundColor: "#f8f9fc" }}
          >
            <div className="card-body p-0">
              <div className="row">
                <div
                  className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "#242424", borderRadius: "5px" }}
                >
                  <img
                    src="/logorempli.png"
                    alt="Login visual"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>

                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h4 className="text-dark mb-4">Bienvenue Sur Cockpit</h4>
                    </div>

                    <form className="user" onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-3">
                        <input
                          type="text"
                          className={`form-control form-control-user ${
                            errors.username ? "is-invalid" : ""
                          }`}
                          placeholder="Nom d'utilisateur"
                          {...register("username")}
                        />
                        {errors.username && (
                          <div className="invalid-feedback">
                            {errors.username.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <input
                          type="password"
                          className={`form-control form-control-user ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          placeholder="Mot de passe"
                          {...register("password")}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password.message}
                          </div>
                        )}
                      </div>

                      <button
                        className="btn btn-danger btn-user w-100"
                        type="submit"
                      >
                        Se connecter
                      </button>
                    </form>
                  </div>
                </div>
                {/* End right form */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <p className="fs-3">
          <span className="text-danger">Oups !</span> Page introuvable.
        </p>
        <p className="lead">
          La page que vous cherchez n’existe pas ou a été déplacée.
        </p>
        <Link to="/dashboard" className="btn btn-primary mt-3">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}

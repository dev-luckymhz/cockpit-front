import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required("Nom d'utilisateur requis"),
  password: yup
    .string()
    .required("Mot de passe requis")
    .min(4, "Le mot de passe doit contenir au moins 4 caractères"),
});

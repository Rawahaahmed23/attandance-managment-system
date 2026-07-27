// validation/userSchemas.js
const yup = require("yup");
const { object, string } = yup;

// Signup Schema
const signupSchema = object({
  name: string()
    .required("Username is required")
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must not be more than 255 characters" }),

  email: string()
    .required("Email is required")
    .trim()
    .email({ message: "Invalid email address" }),

  password: string()
    .required("Password is required")
    .trim()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(1024, { message: "Password must not be more than 1024 characters" }),

  phoneNumber: string()
    .required("Phone number is required")
    .trim()
    .min(10, { message: "Phone must be at least 10 characters" })
    .max(20, { message: "Phone must not be more than 20 characters" }),
    
    role: string()
    .required("role is required")
    .trim(),
  

      profileImage: string()
    .required("Profile image is required"),
   
});

// Login Schema
const loginSchema = object({
  email: string()
    .required("Email is required")
    .trim()
    .email({ message: "Invalid email address" }),

  password: string()
    .required("Password is required")
    .trim()
    .min(6, { message: "Password must be at least 6 characters" }),
});

module.exports = { signupSchema, loginSchema,};

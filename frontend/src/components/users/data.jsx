export const inputs = [
  {
    id: 1,
    name: "userName",
    type: "text",
    placeholder: "User Name",
    errorMessage: "name should be 3-16 characters",
    label: "User Name",
    // pattern: "^[A-Za-z]{3,16}$",
    required: true,
  },
  {
    id: 2,
    name: "userEmail",
    type: "email",
    placeholder: "Email",
    errorMessage: "Try a valid email address!",
    label: "Email",
    required: true,
  },
  {
    id: 3,
    name: "userPhoneNo",
    type: "tel",
    placeholder: "Mob Number",
    errorMessage: " !",
    label: "Mob Number",
    required: true,
  },
];
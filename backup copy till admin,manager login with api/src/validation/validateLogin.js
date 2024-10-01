import validator from "validator";

const validateLoginUser = (data) => {
    const errors = {};
    const { email, password } = data;

    if (validator.isEmpty(email)) {
        errors.email = "Email is required";
    }

    if (validator.isEmpty(password)) {
        errors.password = "Password is required"; 
    }

    return {
        isInvalid: Object.keys(errors).length > 0,
        errors
    };
};

export default validateLoginUser;

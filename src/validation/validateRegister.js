import validator from "validator";

const validateUser = (data) => {
    const errors = {};

    const { Name, email, file } = data;

    // Validate Name
    if (validator.isEmpty(Name)) {
        errors.Name = "Name is required";
    }

    // Validate Email
    if (validator.isEmpty(email)) {
        errors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
        errors.email = "Email is not valid"; // Optional: add email format validation
    }

    // Validate File
    if (!file || !(file instanceof File)) {
        errors.file = "Your CV is required"; // Checks if the file is not provided or not a File object
    }

    return {
        isInvalid: Object.keys(errors).length > 0,
        errors
    };
};

export default validateUser;

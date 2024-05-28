export const usernameRules = [{
    required: true,
    message: 'Please input the username',
}]

export const passwordRules = [{
    required: true,
    message: "Please input your password!",
}, { /* 密码要求8-16位 */
    min: 8,
    max: 16,
    message: 'The password must be between 8 and 16 characters long',
}, { /* 密码需要同时包含大小写字母与数字 */
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]*$/,
    message: 'The password must contain at least one uppercase letter, one lowercase letter, and one number',
}]

export const nameRules = [{
    required: true,
    message: 'Please input the name',
}]

export const emailRules = [{
    required: true,
    message: "Please input your email",
}, {
    type: "email",
}]

export const generateToken = () => {
    const token = Math.floor(100000 + Math.random() * 90000).toString();
    return token;
};
